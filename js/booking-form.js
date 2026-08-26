/* ============================
   Marcação de Consulta — form logic
   ----------------------------
   Each "accordion" group (Tipo de Consulta / Modalidade Preferencial /
   Preferência de Contacto) behaves like a single-select radio group: picking
   an option highlights it and disables its siblings until it is toggled off
   again. Any number of accordion panels can be open at once — opening one
   does not close the others. The submit button stays disabled until every
   required field/group has a value.
   ============================ */
(function () {
  'use strict';
  window.Site = window.Site || {};

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  // No country/prefix picker — just one plain text field. A number typed
  // without any country code (e.g. "912345678") is assumed to be
  // Portuguese; one that already carries a "+" or "00" prefix (e.g.
  // "+351912345678", "0034612345678") is parsed using that instead.
  // window.libphonenumber comes from the CDN <script> loaded ahead of
  // this file (see marcar-consulta.html) — see parsePhoneField below for
  // what happens if it hasn't loaded.
  var DEFAULT_PHONE_COUNTRY = 'PT';

  // Strips characters that can't be part of a phone number as the user
  // types — letters and stray punctuation — while still allowing "+" and
  // the spaces/dashes/parentheses people naturally format numbers with.
  // Those formatting characters are just visual at this point: libphone-
  // number (see parsePhoneField) ignores them when it actually parses.
  function sanitizePhoneField(field) {
    field.value = field.value.replace(/[^\d+\s().-]/g, '');
  }

  // Parses the field's current text with libphonenumber-js, defaulting to
  // Portugal when the text has no country code of its own. Returns the
  // parsed PhoneNumber (which may still be .isValid() === false for a
  // badly-formed number) or null if it couldn't even be parsed as a
  // phone number, or if the library hasn't loaded (offline/CDN blocked —
  // treated as "can't validate" rather than silently letting anything
  // through).
  function parsePhoneField(field) {
    var raw = field.value.trim();
    if (!raw || !window.libphonenumber) return null;
    try {
      return window.libphonenumber.parsePhoneNumberFromString(raw, DEFAULT_PHONE_COUNTRY) || null;
    } catch (e) {
      return null;
    }
  }

  function isPhoneValid(field) {
    var parsed = parsePhoneField(field);
    return !!(parsed && parsed.isValid());
  }

  // Only ever called at submit time (see the submit handler) — not on
  // input/blur — so the field never shows an error before the user has
  // actually tried to submit, same as validateEmailField below. The title
  // attribute doubles as a native, no-JS hover tooltip stating the
  // expected format.
  function validatePhoneField(field) {
    var value = field.value.trim();
    var isInvalid = value.length > 0 && !isPhoneValid(field);
    field.closest('.booking-field').classList.toggle('has-error', isInvalid);
    field.title = isInvalid ? 'Formato esperado: +351912345678 ou 912345678 (assume Portugal sem indicativo).' : '';
    return !isInvalid;
  }

  // Clears a previously-shown error the moment the user edits the field
  // again — mirrors clearEmailError below.
  function clearPhoneError(field) {
    field.closest('.booking-field').classList.remove('has-error');
    field.title = '';
  }

  // Rewrites the field to the canonical E.164 form (e.g. "+351912345678")
  // once it parses as valid — called on blur rather than on every
  // keystroke, so it doesn't fight the user's cursor position while
  // they're still typing.
  function normalizePhoneField(field) {
    var parsed = parsePhoneField(field);
    if (parsed && parsed.isValid()) field.value = parsed.number;
  }

  // Trim + lowercase — called right before validating on submit, not on
  // every keystroke, so it doesn't fight the user's cursor mid-typing.
  function normalizeEmailField(field) {
    field.value = field.value.trim().toLowerCase();
  }

  // Only ever called at submit time (see the submit handler) — not on
  // input/blur — so the field never shows an error before the user has
  // actually tried to submit. The title attribute doubles as a native,
  // no-JS hover tooltip explaining the failure.
  function validateEmailField(field) {
    var value = field.value.trim();
    var isInvalid = value.length > 0 && !EMAIL_PATTERN.test(value);
    field.closest('.booking-field').classList.toggle('has-error', isInvalid);
    field.title = isInvalid ? 'Formato esperado: utilizador@dominio.com' : '';
    return !isInvalid;
  }

  // Clears a previously-shown error the moment the user edits the field
  // again, rather than leaving a stale red border while they're actively
  // fixing it — the next submit attempt re-validates from scratch.
  function clearEmailError(field) {
    field.closest('.booking-field').classList.remove('has-error');
    field.title = '';
  }

  // Extra decorative shapes only show once the form feels "in use" — see
  // .has-open-accordion in style.css.
  function updateDecorState(form) {
    var hero = form.closest('.booking-hero');
    if (!hero) return;
    var anyOpen = !!form.querySelector('.booking-accordion.is-open');
    hero.classList.toggle('has-open-accordion', anyOpen);
  }

  function toggleAccordion(form, accordion) {
    var isOpen = accordion.classList.toggle('is-open');
    accordion.querySelector('.booking-accordion-header').setAttribute('aria-expanded', String(isOpen));
    updateDecorState(form);
  }

  // Radio-like single-select within one accordion group: clicking the
  // already-selected option deselects it (and re-enables its siblings),
  // clicking any other option selects it and disables the rest.
  function selectOption(accordion, option) {
    var options = accordion.querySelectorAll('.booking-option');
    var alreadySelected = option.classList.contains('is-selected');

    options.forEach(function (opt) {
      opt.classList.remove('is-selected', 'is-disabled');
      opt.setAttribute('aria-checked', 'false');
    });

    if (!alreadySelected) {
      option.classList.add('is-selected');
      option.setAttribute('aria-checked', 'true');
      options.forEach(function (opt) {
        if (opt !== option) opt.classList.add('is-disabled');
      });
    }

    accordion.dataset.value = alreadySelected ? '' : option.dataset.value;
  }

  // True once every required field/group has SOME value — gates the
  // submit button (see updateSubmitState). Neither phone's nor email's
  // FORMAT is checked here — both are only validated at the moment of
  // submission (see the submit handler), so neither field shows an error
  // before the user has tried to submit at least once.
  function isFormComplete(form) {
    var name = form.querySelector('#booking-name').value.trim();
    var phone = form.querySelector('#booking-phone').value.trim();
    var email = form.querySelector('#booking-email').value.trim();
    var consent = form.querySelector('#booking-consent').checked;

    var groupsComplete = true;
    form.querySelectorAll('.booking-accordion').forEach(function (acc) {
      if (!acc.dataset.value) groupsComplete = false;
    });

    return !!(name && phone && email && consent && groupsComplete);
  }

  // Enables/disables the submit button to match isFormComplete(). Called
  // after every field change so it's always in sync.
  function updateSubmitState(form) {
    var submit = form.querySelector('.booking-submit');
    submit.disabled = !isFormComplete(form);
  }

  // Assembles the JSON body Web3Forms expects (see marcar-consulta.html
  // for the access_key/botcheck fields). access_key/subject/from_name are
  // Web3Forms' own recognised fields; every other key just shows up as its
  // own labelled line in the notification email, in this order.
  function buildWeb3FormsPayload(form) {
    var name = form.querySelector('#booking-name').value.trim();
    // Re-derived from the field rather than trusting it was already
    // rewritten by normalizePhoneField (blur may never have fired — e.g.
    // the user submits via Enter without leaving the field), so the
    // output is always the validated E.164 form regardless.
    var phoneField = form.querySelector('#booking-phone');
    var parsedPhone = parsePhoneField(phoneField);
    var phone = (parsedPhone && parsedPhone.isValid()) ? parsedPhone.number : phoneField.value.trim();
    var email = form.querySelector('#booking-email').value.trim();
    var message = form.querySelector('#booking-message').value.trim();

    var tipo = form.querySelector('[data-group="tipo"]').dataset.value;
    var modalidade = form.querySelector('[data-group="modalidade"]').dataset.value;
    var contacto = form.querySelector('[data-group="contacto"]').dataset.value;

    return {
      access_key: form.querySelector('input[name="access_key"]').value,
      subject: 'Pedido de Marcação de Consulta',
      from_name: name,
      botcheck: form.querySelector('.booking-honeypot').checked ? 'yes' : '',
      Nome: name,
      Telemóvel: phone,
      email: email,
      'Tipo de consulta': tipo,
      'Modalidade preferencial': modalidade,
      'Preferência de contacto': contacto,
      Mensagem: message || '(sem mensagem)'
    };
  }

  Site.mountBookingForm = function () {
    var form = document.getElementById('booking-form');
    if (!form) return;

    form.querySelectorAll('.booking-accordion').forEach(function (accordion) {
      var header = accordion.querySelector('.booking-accordion-header');
      header.addEventListener('click', function () {
        toggleAccordion(form, accordion);
      });

      accordion.querySelectorAll('.booking-option').forEach(function (option) {
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('tabindex', '0');
        option.addEventListener('click', function () {
          selectOption(accordion, option);
          updateSubmitState(form);
        });
        option.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectOption(accordion, option);
            updateSubmitState(form);
          }
        });
      });
    });

    // Neither phone nor email is validated here on input/blur — only once,
    // at submit time (see below) — so neither field shows an error before
    // the user has actually tried to submit. Editing a field after a
    // failed attempt just clears that field's error instead of
    // re-validating eagerly. normalizePhoneField on blur is the one
    // exception: it silently reformats an already-VALID number to E.164,
    // which isn't showing an error, so it's fine to keep eager.
    var phoneField = form.querySelector('#booking-phone');
    phoneField.addEventListener('input', function () {
      sanitizePhoneField(phoneField);
      if (phoneField.closest('.booking-field').classList.contains('has-error')) {
        clearPhoneError(phoneField);
      }
      updateSubmitState(form);
    });
    phoneField.addEventListener('blur', function () {
      normalizePhoneField(phoneField);
    });

    var emailField = form.querySelector('#booking-email');
    emailField.addEventListener('input', function () {
      if (emailField.closest('.booking-field').classList.contains('has-error')) {
        clearEmailError(emailField);
      }
      updateSubmitState(form);
    });

    form.addEventListener('input', function () { updateSubmitState(form); });
    form.addEventListener('change', function () { updateSubmitState(form); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!isFormComplete(form)) return;

      normalizeEmailField(emailField);
      var emailOk = validateEmailField(emailField);
      var phoneOk = validatePhoneField(phoneField);
      if (!emailOk || !phoneOk) {
        // Scroll to (and focus) whichever invalid field comes first in
        // the form, so the failure is impossible to miss instead of
        // silently doing nothing — phone comes before email in the
        // markup, so it takes priority when both are invalid.
        var firstInvalid = !phoneOk ? phoneField : emailField;
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus({ preventScroll: true });
        return;
      }

      var submitBtn = form.querySelector('.booking-submit');
      // The arrow icon is a sibling of this label, not text inside the
      // button itself — swapping submitBtn.textContent directly would
      // wipe that <i> out along with the old label.
      var submitLabel = form.querySelector('.booking-submit-label');
      var DEFAULT_LABEL = 'Enviar pedido de marcação';
      var errorEl = form.querySelector('.booking-error');
      if (errorEl) errorEl.classList.remove('is-visible');
      submitBtn.disabled = true;
      submitLabel.textContent = 'A enviar…';

      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(buildWeb3FormsPayload(form))
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return res.ok && data.success;
          });
        })
        .then(function (sent) {
          if (sent) {
            // Leaving the page anyway, so no need to reset the form or
            // restore the button below — marcacao-confirmada.html is the
            // actual "thank you" state now.
            window.location.href = 'marcacao-confirmada.html';
            return;
          }
          if (errorEl) errorEl.classList.add('is-visible');
          submitLabel.textContent = DEFAULT_LABEL;
          updateSubmitState(form);
        })
        .catch(function () {
          if (errorEl) errorEl.classList.add('is-visible');
          submitLabel.textContent = DEFAULT_LABEL;
          updateSubmitState(form);
        });
    });

    updateSubmitState(form);
    updateDecorState(form);
  };
})();

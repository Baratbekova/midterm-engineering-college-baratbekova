(() => {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Interaction 1: content filters (programs, student life) ---------- */
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const items = document.querySelectorAll(group.dataset.filterGroup);
    const buttons = group.querySelectorAll('button[data-filter]');
    const status = document.getElementById(group.dataset.filterStatus || '');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        let shown = 0;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        items.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('d-none', !match);
          if (match) shown += 1;
        });
        if (status) status.textContent = `Showing ${shown} item${shown === 1 ? '' : 's'}.`;
      });
    });
  });

  /* ---------- Interaction 2: FAQ — one answer open at a time ---------- */
  document.querySelectorAll('.faq').forEach((faq) => {
    const all = faq.querySelectorAll('details');
    all.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (d.open) all.forEach((o) => { if (o !== d) o.open = false; });
      });
    });
  });

  /* ---------- Interaction 3: back-to-top button ---------- */
  const topBtn = document.getElementById('backToTop');
  if (topBtn) {
    const toggle = () => topBtn.classList.toggle('visible', window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0 });
      document.getElementById('main')?.focus({ preventScroll: true });
    });
  }

  /* ---------- Form validation helpers ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const getError = (field, form) => {
    const d = field.dataset;
    if (typeof field._check === 'function') {
      const custom = field._check();
      if (custom) return custom;
    }
    if (field.type === 'checkbox') return field.checked ? '' : d.msgRequired;
    const value = field.value.trim();
    if (field.required && !value) return d.msgRequired;
    if (!value) return '';
    if (field.type === 'email' && !EMAIL.test(value)) return d.msgInvalid;
    if (field.minLength > 0 && value.length < field.minLength) return d.msgInvalid;
    if (field.pattern && !new RegExp(`^(?:${field.pattern})$`).test(field.value)) return d.msgInvalid;
    if (field.type === 'date' && field.min && value < field.min) return d.msgInvalid;
    if (d.match) {
      const other = form.querySelector(d.match);
      if (other && other.value !== field.value) return d.msgMismatch;
    }
    return '';
  };

  const showState = (controls, errorEl, message, hasValue) => {
    controls.forEach((c) => {
      c.classList.toggle('is-invalid', Boolean(message));
      c.classList.toggle('is-valid', !message && hasValue);
      if (message) c.setAttribute('aria-invalid', 'true');
      else c.removeAttribute('aria-invalid');
    });
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.hidden = !message;
    }
  };

  const validateField = (field, form) => {
    const msg = getError(field, form);
    const errorEl = document.getElementById(`${field.id}-error`);
    const hasValue = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
    showState([field], errorEl, msg, hasValue);
    return msg;
  };

  const validateGroup = (group, form) => {
    const radios = group.querySelectorAll('input[type="radio"]');
    const checked = [...radios].some((r) => r.checked);
    const msg = checked ? '' : group.dataset.msgRequired;
    showState([...radios], document.getElementById(`${group.id}-error`), msg, false);
    return msg;
  };

  const setupForm = (form) => {
    form.setAttribute('novalidate', '');
    const fields = [...form.querySelectorAll('[data-validate]')];
    const groups = [...form.querySelectorAll('[data-group]')];
    const touched = new WeakSet();

    fields.forEach((f) => {
      const evt = f.type === 'checkbox' || f.tagName === 'SELECT' ? 'change' : 'input';
      f.addEventListener('blur', () => { touched.add(f); validateField(f, form); });
      f.addEventListener(evt, () => {
        if (touched.has(f) || f.classList.contains('is-invalid')) validateField(f, form);
        if (f.dataset.revalidate) {
          const dep = form.querySelector(f.dataset.revalidate);
          if (dep && dep.value) validateField(dep, form);
        }
      });
    });
    groups.forEach((g) => g.addEventListener('change', () => validateGroup(g, form)));

    const validateAll = () => {
      let firstInvalid = null;
      fields.forEach((f) => {
        touched.add(f);
        if (validateField(f, form) && !firstInvalid) firstInvalid = f;
      });
      groups.forEach((g) => {
        if (validateGroup(g, form) && !firstInvalid) firstInvalid = g.querySelector('input');
      });
      return firstInvalid;
    };

    const reset = () => {
      form.reset();
      fields.forEach((f) => showState([f], document.getElementById(`${f.id}-error`), '', false));
      groups.forEach((g) => showState([...g.querySelectorAll('input')], document.getElementById(`${g.id}-error`), '', false));
    };

    return { fields, validateAll, reset };
  };

  /* ---------- Registration form ---------- */
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    const api = setupForm(regForm);
    const intake = document.getElementById('intake');
    if (intake) {
      const now = new Date();
      const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      intake.min = iso;
    }
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstInvalid = api.validateAll();
      const summary = document.getElementById('formSummary');
      if (firstInvalid) {
        summary.hidden = false;
        firstInvalid.focus();
        return;
      }
      summary.hidden = true;
      // Static site: no server. Password is intentionally never stored or transmitted.
      const name = document.getElementById('fullName').value.trim();
      const program = document.getElementById('program');
      document.getElementById('confirmName').textContent = name;
      document.getElementById('confirmProgram').textContent = program.options[program.selectedIndex].text;
      regForm.hidden = true;
      const box = document.getElementById('confirmation');
      box.hidden = false;
      box.focus();
    });
    document.getElementById('registerAgain')?.addEventListener('click', () => {
      api.reset();
      document.getElementById('confirmation').hidden = true;
      regForm.hidden = false;
      document.getElementById('fullName').focus();
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const api = setupForm(contactForm);
    const captcha = document.getElementById('captcha');
    const question = document.getElementById('captchaQuestion');
    let expected = 0;
    const newChallenge = () => {
      const a = 2 + Math.floor(Math.random() * 8);
      const b = 2 + Math.floor(Math.random() * 8);
      expected = a + b;
      question.textContent = `${a} + ${b}`;
      captcha.value = '';
    };
    captcha._check = () => (captcha.value.trim() !== '' && Number(captcha.value) !== expected ? captcha.dataset.msgInvalid : '');
    newChallenge();

    const ok = document.getElementById('contactSuccess');
    const fail = document.getElementById('contactFailure');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      ok.hidden = true;
      fail.hidden = true;
      const firstInvalid = api.validateAll();
      if (firstInvalid) {
        fail.hidden = false;
        fail.focus();
        firstInvalid.focus();
        return;
      }
      if (document.getElementById('website').value !== '') {
        // Honeypot filled — treat as bot, fail silently-looking
        fail.hidden = false;
        return;
      }
      api.reset();
      newChallenge();
      ok.hidden = false;
      ok.focus();
    });
  }
})();

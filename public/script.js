const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

function closeMenu({ returnFocus = false } = {}) {
  if (!menuButton || !nav) return;
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton.focus();
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu({ returnFocus: true });
    }
  });
}

const contactForm = document.querySelector('[data-contact-form]');
const validateButton = document.querySelector('[data-validate-form]');

if (contactForm && validateButton) {
  const nameField = contactForm.querySelector('#name');
  const phoneField = contactForm.querySelector('#phone');
  const emailField = contactForm.querySelector('#email');
  const status = contactForm.querySelector('#form-status');

  const clearContactValidity = () => {
    phoneField?.setCustomValidity('');
    emailField?.setCustomValidity('');
  };

  [phoneField, emailField].forEach((field) => {
    field?.addEventListener('input', clearContactValidity);
  });

  validateButton.addEventListener('click', () => {
    clearContactValidity();

    const hasPhone = Boolean(phoneField?.value.trim());
    const hasEmail = Boolean(emailField?.value.trim());

    if (!hasPhone && !hasEmail) {
      const message = 'Enter at least a phone number or an email address.';
      phoneField?.setCustomValidity(message);
      emailField?.setCustomValidity(message);
    }

    const valid = contactForm.reportValidity();

    if (status) {
      status.textContent = valid
        ? 'Your details pass the local validation check. Online submission is still disabled on this staging site; please call Best Choice to request an estimate.'
        : 'Please correct the highlighted required or format fields. Enter your name and at least one contact method.';
    }

    if (!valid && nameField && !nameField.checkValidity()) {
      nameField.focus();
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

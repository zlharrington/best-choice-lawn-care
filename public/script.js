const siteStylesheets = ['/header-layout.css', '/typography.css', '/simple-pages.css'];
siteStylesheets.forEach((href) => {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
});

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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateScrollTo(targetY, duration = 360) {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (prefersReducedMotion.matches || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();
  const easeOutQuart = (progress) => 1 - Math.pow(1 - progress, 4);

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutQuart(progress));

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    closeMenu();

    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.getBoundingClientRect().height + 12 : 12;
    const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);

    animateScrollTo(targetY);
    history.replaceState(null, '', hash);
  });
});

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

    const phoneValue = phoneField?.value.trim() ?? '';
    const hasPhone = Boolean(phoneValue);
    const hasEmail = Boolean(emailField?.value.trim());
    const phoneDigitCount = (phoneValue.match(/[0-9]/g) || []).length;

    if (!hasPhone && !hasEmail) {
      const message = 'Enter at least a phone number or an email address.';
      phoneField?.setCustomValidity(message);
      emailField?.setCustomValidity(message);
    } else if (hasPhone && phoneDigitCount < 7) {
      phoneField?.setCustomValidity('Enter a phone number with at least 7 digits.');
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

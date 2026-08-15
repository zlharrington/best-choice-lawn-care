const THEME_STORAGE_KEY = 'bestChoiceTheme';
const themeOptions = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'earth', label: 'Earth' },
  { id: 'sage', label: 'Sage' },
  { id: 'professional', label: 'Professional' },
  { id: 'dark-professional', label: 'Dark Professional' }
];
const validThemes = new Set(themeOptions.map(({ id }) => id));

const professionalThemeStyles = document.createElement('link');
professionalThemeStyles.rel = 'stylesheet';
professionalThemeStyles.href = '/professional-theme.css';
document.head.appendChild(professionalThemeStyles);

const darkProfessionalThemeStyles = document.createElement('link');
darkProfessionalThemeStyles.rel = 'stylesheet';
darkProfessionalThemeStyles.href = '/dark-professional-theme.css';
document.head.appendChild(darkProfessionalThemeStyles);

function getStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return validThemes.has(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The theme still applies for this page if storage is unavailable.
  }
}

const initialTheme = getStoredTheme() || 'sage';
document.documentElement.dataset.theme = initialTheme;

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
let themeButtons = [];

function setTheme(theme, { persist = true } = {}) {
  if (!validThemes.has(theme)) return;

  document.documentElement.dataset.theme = theme;
  themeButtons.forEach((button) => {
    const selected = button.dataset.themeChoice === theme;
    button.setAttribute('aria-pressed', String(selected));
  });

  if (persist) storeTheme(theme);
}

if (nav) {
  const themeSwitcher = document.createElement('div');
  themeSwitcher.className = 'theme-switcher';
  themeSwitcher.setAttribute('role', 'group');
  themeSwitcher.setAttribute('aria-label', 'Color scheme');

  themeOptions.forEach(({ id, label }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-switcher-button';
    button.dataset.themeChoice = id;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(id === initialTheme));
    button.addEventListener('click', () => setTheme(id));
    themeSwitcher.appendChild(button);
    themeButtons.push(button);
  });

  nav.prepend(themeSwitcher);

  const callButton = nav.querySelector('.nav-cta[href^="tel:"]');
  if (callButton && !nav.querySelector('.nav-phone-link')) {
    const callGroup = document.createElement('span');
    callGroup.className = 'nav-call-group';
    callButton.before(callGroup);
    callGroup.appendChild(callButton);

    const phoneLink = document.createElement('a');
    phoneLink.className = 'nav-phone-link';
    phoneLink.href = callButton.getAttribute('href');
    phoneLink.textContent = '(541) 567-5558';
    phoneLink.setAttribute('aria-label', 'Call Best Choice Lawn Care at 541-567-5558');
    callGroup.appendChild(phoneLink);
  }
}

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

document.querySelectorAll('.staging-note').forEach((note) => {
  note.textContent = 'Website preview';
});

const contactForm = document.querySelector('[data-contact-form]');
const validateButton = document.querySelector('[data-validate-form]');

if (contactForm && validateButton) {
  const nameField = contactForm.querySelector('#name');
  const phoneField = contactForm.querySelector('#phone');
  const emailField = contactForm.querySelector('#email');
  const status = contactForm.querySelector('#form-status');

  if (status) {
    status.textContent = 'Online estimate requests will be enabled when the destination email is connected.';
  }

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
        ? 'Your details look complete. Online estimate requests will be enabled when the destination email is connected; please call Best Choice in the meantime.'
        : 'Please correct the highlighted required or format fields. Enter your name and at least one contact method.';
    }

    if (!valid && nameField && !nameField.checkValidity()) {
      nameField.focus();
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

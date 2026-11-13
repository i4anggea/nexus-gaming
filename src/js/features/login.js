import { signInDemo, validateLogin } from '../core/login.js';

function getValues(form) {
  return {
    username: form.elements.namedItem('username').value,
    password: form.elements.namedItem('password').value,
  };
}

function showFieldError(form, field, message = '') {
  const input = form.elements.namedItem(field);
  const error = form.querySelector(`#login-${field}-error`);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  error.textContent = message;
  error.hidden = !message;
}

export function handleLoginSubmit(form, onSuccess) {
  form.dataset.submitted = 'true';
  const result = signInDemo(getValues(form));
  for (const field of ['username', 'password']) {
    showFieldError(form, field, result.errors[field]);
  }
  const status = form.querySelector('#login-status');
  if (result.success) {
    form.elements.namedItem('password').value = '';
    onSuccess();
    return;
  }
  status.textContent = result.message || 'Revisa los campos indicados antes de continuar.';
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
}

export function handleLoginField(event) {
  const input = event.target;
  const form = input.closest('#login-form');
  if (!form || !['username', 'password'].includes(input.name)) return;
  if (event.type === 'focusout') input.dataset.touched = 'true';
  if (!input.dataset.touched && !form.dataset.submitted) return;
  const errors = validateLogin(getValues(form));
  showFieldError(form, input.name, errors[input.name]);
  if (event.type === 'input') form.querySelector('#login-status').textContent = '';
}

export function togglePassword() {
  const input = document.querySelector('#login-password');
  const button = document.querySelector('[data-action="toggle-password"]');
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(visible));
  button.textContent = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';
}

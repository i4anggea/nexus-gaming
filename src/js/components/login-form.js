import { demoCredentials, loginRules } from '../core/login.js';
import { escapeHTML } from '../core/utils.js';

export function renderLoginForm() {
  return `
    <h2>Entra a tu espacio.</h2>
    <p>Login de demostración para practicar la validación de formularios. Usa únicamente los datos ficticios indicados abajo.</p>
    <form id="login-form" class="login-form" novalidate>
      <div class="login-field">
        <label for="login-username">Usuario</label>
        <input id="login-username" name="username" type="text" required
          minlength="4" maxlength="20" pattern="${escapeHTML(loginRules.username.pattern)}"
          autocomplete="off" autocapitalize="none" spellcheck="false"
          aria-describedby="login-username-hint login-username-error" aria-invalid="false">
        <p id="login-username-hint" class="login-hint">${loginRules.username.message}</p>
        <p id="login-username-error" class="login-error" hidden></p>
      </div>
      <div class="login-field">
        <label for="login-password">Contraseña</label>
        <div class="password-control">
          <input id="login-password" name="password" type="password" required
            minlength="8" maxlength="32" pattern="${escapeHTML(loginRules.password.pattern)}"
            autocomplete="off" aria-describedby="login-password-hint login-password-error" aria-invalid="false">
          <button type="button" data-action="toggle-password" aria-controls="login-password" aria-pressed="false">Mostrar contraseña</button>
        </div>
        <p id="login-password-hint" class="login-hint">${loginRules.password.message}</p>
        <p id="login-password-error" class="login-error" hidden></p>
      </div>
      <p id="login-status" class="login-status" role="status" aria-live="polite"></p>
      <button type="submit" class="button primary">Iniciar sesión demo ↗</button>
    </form>
    <div class="login-example">
      <h3>Cuenta de ejemplo</h3>
      <dl>
        <dt>Usuario</dt><dd><code>${demoCredentials.username}</code></dd>
        <dt>Contraseña</dt><dd><code>${demoCredentials.password}</code></dd>
      </dl>
      <p>La sesión termina al recargar la página. Este formulario no autentica usuarios en un servidor.</p>
    </div>
  `;
}

/** Reglas didácticas de formato. Estas credenciales son públicas y ficticias. */
export const loginRules = {
  username: {
    pattern: '[A-Za-z][A-Za-z0-9_]{3,19}',
    message: 'Usa de 4 a 20 caracteres. Empieza con una letra y continúa con letras, números o guion bajo.',
  },
  password: {
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,32}',
    message: 'Usa de 8 a 32 caracteres, con una mayúscula, una minúscula y un número. Solo letras y números.',
  },
};

export const demoCredentials = { username: 'gamer_demo', password: 'Nexus2026' };
let demoUser = null;

export function validateLogin(values) {
  const errors = {};
  for (const [field, rule] of Object.entries(loginRules)) {
    const value = values[field];
    if (typeof value !== 'string' || value.length === 0) {
      errors[field] = field === 'username' ? 'Escribe tu usuario.' : 'Escribe tu contraseña.';
    } else if (!new RegExp(`^(?:${rule.pattern})$`).test(value)) {
      errors[field] = rule.message;
    }
  }
  return errors;
}

export function signInDemo(values) {
  const errors = validateLogin(values);
  if (Object.keys(errors).length) return { success: false, errors, message: '' };
  if (values.username !== demoCredentials.username || values.password !== demoCredentials.password) {
    return { success: false, errors: {}, message: 'Los datos no coinciden con la cuenta de ejemplo. Revisa las credenciales indicadas abajo.' };
  }
  // Solo se conserva el nombre en memoria. Nunca guardamos la contraseña.
  demoUser = demoCredentials.username;
  return { success: true, errors: {}, message: '' };
}

export function getDemoUser() {
  return demoUser;
}

export function signOutDemo() {
  demoUser = null;
}

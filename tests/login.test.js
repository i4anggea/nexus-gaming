import test from 'node:test';
import assert from 'node:assert/strict';
import { demoCredentials, validateLogin, signInDemo, signOutDemo, getDemoUser } from '../src/js/core/login.js';

test('Login vacío identifica ambos campos obligatorios', () => {
  const errors = validateLogin({ username: '', password: '' });
  assert.ok(errors.username);
  assert.ok(errors.password);
});

test('Usuario rechaza espacios, símbolos, inicio numérico y longitud fuera de rango', () => {
  for (const username of ['abc', '1gamer', 'gamer demo', 'gamer@demo', 'a'.repeat(21)]) {
    assert.ok(validateLogin({ username, password: demoCredentials.password }).username, username);
  }
  for (const username of ['abcd', 'Gamer_2026', 'a'.repeat(20)]) {
    assert.equal(validateLogin({ username, password: demoCredentials.password }).username, undefined);
  }
});

test('Contraseña exige longitud, mayúscula, minúscula y número', () => {
  for (const password of ['Nex2026', 'nexus2026', 'NEXUS2026', 'Nexusdemo', 'Nexus 2026', 'Nexus2026!','Aa1' + 'a'.repeat(30)]) {
    assert.ok(validateLogin({ username: demoCredentials.username, password }).password, password);
  }
  assert.deepEqual(validateLogin(demoCredentials), {});
});

test('Formato válido no implica credenciales correctas', () => {
  signOutDemo();
  const result = signInDemo({ username: 'otro_usuario', password: 'Otra2026' });
  assert.equal(result.success, false);
  assert.deepEqual(result.errors, {});
  assert.ok(result.message);
  assert.equal(getDemoUser(), null);
});

test('Credenciales ficticias abren sesión y cerrar sesión elimina el usuario', () => {
  signOutDemo();
  assert.equal(signInDemo(demoCredentials).success, true);
  assert.equal(getDemoUser(), 'gamer_demo');
  signOutDemo();
  assert.equal(getDemoUser(), null);
});

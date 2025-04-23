const fs = require('fs');
const crypto = require('crypto');
const USERS_FILE = './users.json';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '{}');
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return { salt, hash };
}

function registerUser(username, password) {
  const users = loadUsers();
  if (users[username]) return { success: false, message: 'Usuario ya existe' };
  const { salt, hash } = hashPassword(password);
  users[username] = { salt, hash };
  saveUsers(users);
  return { success: true, message: 'Usuario registrado' };
}

function authenticateUser(username, password) {
  const users = loadUsers();
  const user = users[username];
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  const { hash } = hashPassword(password, user.salt);
  if (hash === user.hash) {
    return { success: true, message: 'Autenticación exitosa' };
  } else {
    return { success: false, message: 'Contraseña incorrecta' };
  }
}

module.exports = { registerUser, authenticateUser };

// helpers
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUser(email, data) {
  const users = getUsers();
  users[email] = data;
  localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatBookTitle(title) {
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
}

function formatAuthorName(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// auth
function registerUser() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!validateName(name)) return alert('Name must not contain numbers or symbols.');
  if (!validateEmail(email)) return alert('Invalid email.');
  if (password.length < 6) return alert('Password must be at least 6 characters.');

  const users = getUsers();
  if (users[email]) return alert('User already exists.');

  const newUser = {
    name,
    email,
    password,
    readBooks: [],
    toReadBooks: []
  };

  saveUser(email, newUser);
  setCurrentUser(newUser);
  showApp();
}

function loginUser() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const users = getUsers();
  const user = users[email];

  if (!user || user.password !== password) return alert('Invalid email or password.');
  setCurrentUser(user);
  showApp();
}

function logoutUser() {
  clearCurrentUser();
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-container').classList.remove('hidden');
}

function toggleAuth(signUp) {
  document.getElementById('signup-form').classList.toggle('hidden', !signUp);
  document.getElementById('login-form').classList.toggle('hidden', signUp);
}

function showApp() {
  const user = getCurrentUser();
  if (!user) return;
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('username').innerText = user.name;
  renderTables();
}

// books
let addingToRead = true;

function toggleReadMode() {
  addingToRead = !addingToRead;
  document.getElementById('toggle-mode').innerText = addingToRead
    ? 'Add the book you want to read.'
    : 'Get back to your library books.';
}

function addBook() {
  const name = formatBookTitle(document.getElementById('book-name').value.trim());
  const author = formatAuthorName(document.getElementById('book-author').value.trim());
  if (!name || !author) return alert('Both fields are required.');

  const user = getCurrentUser();
  if (!user) return;

  const book = { name, author };
  if (addingToRead) user.readBooks.push(book);
  else user.toReadBooks.push(book);

  saveUser(user.email, user);
  setCurrentUser(user);
  document.getElementById('book-name').value = '';
  document.getElementById('book-author').value = '';
  renderTables();
}

function deleteBook(index, isRead) {
  const user = getCurrentUser();
  if (!user) return;
  if (isRead) user.readBooks.splice(index, 1);
  else user.toReadBooks.splice(index, 1);
  saveUser(user.email, user);
  setCurrentUser(user);
  renderTables();
}

function renderTables() {
  const user = getCurrentUser();
  const readTable = document.getElementById('read-books');
  const toReadTable = document.getElementById('to-read-books');

  readTable.innerHTML = '';
  toReadTable.innerHTML = '';

  [
    [user.readBooks, readTable, true],
    [user.toReadBooks, toReadTable, false]
  ].forEach(([books, table, isRead]) => {
    books.forEach((book, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td><button onclick="deleteBook(${i}, ${isRead})">🗑️</button></td>
      `;
      table.appendChild(row);
    });
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('dark-mode-toggle');
  icon.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

window.onload = () => {
  if (getCurrentUser()) showApp();
};

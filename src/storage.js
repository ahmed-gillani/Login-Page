import initialUsers from "./data/user.json"; // Seed (Admin only)

const KEY = "users_data_v1"; // localStorage key
const AUTH_KEY = "authUser"; // for login info

// --- Safe JSON parse ---
function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("safeParse: invalid JSON", err);
    return null;
  }
}

// --- Ensure admin user exists in localStorage ---
export function seedUsersIfMissing() {
  const raw = localStorage.getItem(KEY);
  if (!raw || raw === "[]" || raw === null) {
    localStorage.setItem(KEY, JSON.stringify(initialUsers));
  }
}

// --- Load users ---
export function loadUsers() {
  seedUsersIfMissing();
  const raw = localStorage.getItem(KEY);
  return safeParse(raw) || [];
}

// --- Save users ---
export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

// --- Add user ---
export function addUser(payload) {
  const users = loadUsers();
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: nextId, ...payload };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// --- Reset users to only Admin (used on logout or refresh) ---
export function resetToAdmin() {
  localStorage.setItem(KEY, JSON.stringify(initialUsers));
}

// --- Auth helpers ---
export function setAuthUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
export function clearAuthUser() {
  localStorage.removeItem(AUTH_KEY);
}
export function getAuthUser() {
  const raw = localStorage.getItem(AUTH_KEY);
  return safeParse(raw);
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "we-users";
const CURRENT_USER_KEY = "we-current-user";

export function getUsers(): IUser[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
}

export function register(name: string, email: string, password: string): IUser {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("E-postadressen är redan registrerad");
  }
  const user: IUser = { name, email, password };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function login(email: string, password: string): IUser {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Fel e-post eller lösenord");
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): IUser | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  return JSON.parse(data) as IUser;
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

const ADMIN_KEY = "we-admin-logged-in";
const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = "password";

export function adminLogin(email: string, password: string): void {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new Error("Fel adminuppgifter");
  }
  localStorage.setItem(ADMIN_KEY, "true");
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_KEY);
}

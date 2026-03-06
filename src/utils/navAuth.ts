import { getCurrentUser, logout, isLoggedIn } from "./auth.js";

export function setupNavAuth(): void {
  const loginLink = document.querySelector<HTMLAnchorElement>(
    '.nav-links a[href="pages/login.html"]',
  );
  if (!loginLink) return;

  if (isLoggedIn()) {
    const user = getCurrentUser()!;

    const span = document.createElement("span");
    span.className = "nav-user";
    span.textContent = user.name;

    const btn = document.createElement("button");
    btn.className = "nav-logout-btn";
    btn.textContent = "Logga ut";
    btn.addEventListener("click", () => {
      logout();
      window.location.href = "index.html";
    });

    loginLink.replaceWith(span, btn);
  }
}

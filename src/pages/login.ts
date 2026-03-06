import { register, login, getCurrentUser } from "../utils/auth.js";

export function setupLoginPage(): void {
  const loginForm = document.getElementById(
    "login-form",
  ) as HTMLFormElement | null;
  const registerForm = document.getElementById(
    "register-form",
  ) as HTMLFormElement | null;
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");

  const user = getCurrentUser();
  if (user) {
    window.location.href = "index.html";
    return;
  }

  showRegisterLink?.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection?.classList.add("hidden");
    registerSection?.classList.remove("hidden");
  });

  showLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection?.classList.add("hidden");
    loginSection?.classList.remove("hidden");
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    loginForm.querySelectorAll(".error").forEach((el) => el.remove());

    const email = (
      loginForm.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      loginForm.elements.namedItem("password") as HTMLInputElement
    ).value;

    let valid = true;
    const addError = (fieldName: string, msg: string) => {
      const field = loginForm.elements.namedItem(
        fieldName,
      ) as HTMLElement | null;
      if (field?.parentElement) {
        const err = document.createElement("div");
        err.className = "error";
        err.textContent = msg;
        field.parentElement.appendChild(err);
      }
    };

    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      valid = false;
      addError("email", "Giltig e-postadress krävs");
    }
    if (!password) {
      valid = false;
      addError("password", "Lösenord krävs");
    }

    if (valid) {
      try {
        login(email, password);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") ?? "index.html";
        window.location.href = redirect;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Inloggningen misslyckades";
        addError("password", msg);
      }
    }
  });

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    registerForm.querySelectorAll(".error").forEach((el) => el.remove());

    const name = (
      registerForm.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      registerForm.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      registerForm.elements.namedItem("password") as HTMLInputElement
    ).value;
    const confirmPassword = (
      registerForm.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    let valid = true;
    const addError = (fieldName: string, msg: string) => {
      const field = registerForm.elements.namedItem(
        fieldName,
      ) as HTMLElement | null;
      if (field?.parentElement) {
        const err = document.createElement("div");
        err.className = "error";
        err.textContent = msg;
        field.parentElement.appendChild(err);
      }
    };

    if (!name) {
      valid = false;
      addError("name", "Namn krävs");
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      valid = false;
      addError("email", "Giltig e-postadress krävs");
    }
    if (!password || password.length < 4) {
      valid = false;
      addError("password", "Lösenord måste vara minst 4 tecken");
    }
    if (password !== confirmPassword) {
      valid = false;
      addError("confirmPassword", "Lösenorden matchar inte");
    }

    if (valid) {
      try {
        register(name, email, password);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") ?? "index.html";
        window.location.href = redirect;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Registreringen misslyckades";
        addError("email", msg);
      }
    }
  });
}

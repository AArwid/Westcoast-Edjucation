import { setupLoginPage } from "./login";

describe("login page", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", window.location.pathname);
  });

  it("shows errors for empty login fields", () => {
    document.body.innerHTML = `
      <div id="login-section">
        <form id="login-form">
          <div><input name="email" /></div>
          <div><input name="password" type="password" /></div>
          <button type="submit">Logga in</button>
        </form>
      </div>
      <div id="register-section" class="hidden"></div>
    `;
    setupLoginPage();

    const form = document.getElementById("login-form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelectorAll(".error")).toHaveLength(2);
  });

  it("shows errors for empty register fields", () => {
    document.body.innerHTML = `
      <div id="login-section" class="hidden"></div>
      <div id="register-section">
        <form id="register-form">
          <div><input name="name" /></div>
          <div><input name="email" /></div>
          <div><input name="password" type="password" /></div>
          <div><input name="confirmPassword" type="password" /></div>
          <button type="submit">Skapa konto</button>
        </form>
      </div>
    `;
    setupLoginPage();

    const form = document.getElementById("register-form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelectorAll(".error").length).toBeGreaterThanOrEqual(
      3,
    );
  });

  it("shows error when passwords don't match", () => {
    document.body.innerHTML = `
      <div id="login-section" class="hidden"></div>
      <div id="register-section">
        <form id="register-form">
          <div><input name="name" /></div>
          <div><input name="email" /></div>
          <div><input name="password" type="password" /></div>
          <div><input name="confirmPassword" type="password" /></div>
          <button type="submit">Skapa konto</button>
        </form>
      </div>
    `;
    setupLoginPage();

    const form = document.getElementById("register-form") as HTMLFormElement;
    (form.elements.namedItem("name") as HTMLInputElement).value = "Test";
    (form.elements.namedItem("email") as HTMLInputElement).value = "t@t.se";
    (form.elements.namedItem("password") as HTMLInputElement).value = "1234";
    (form.elements.namedItem("confirmPassword") as HTMLInputElement).value =
      "5678";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    const errors = document.querySelectorAll(".error");
    const texts = Array.from(errors).map((e) => e.textContent);
    expect(texts.some((t) => t?.includes("matchar"))).toBe(true);
  });

  it("toggles between login and register sections", () => {
    document.body.innerHTML = `
      <div id="login-section">
        <form id="login-form">
          <div><input name="email" /></div>
          <div><input name="password" type="password" /></div>
          <button type="submit">Logga in</button>
        </form>
        <a id="show-register" href="#">Skapa konto</a>
      </div>
      <div id="register-section" class="hidden">
        <form id="register-form">
          <div><input name="name" /></div>
          <div><input name="email" /></div>
          <div><input name="password" type="password" /></div>
          <div><input name="confirmPassword" type="password" /></div>
          <button type="submit">Skapa konto</button>
        </form>
        <a id="show-login" href="#">Logga in</a>
      </div>
    `;
    setupLoginPage();

    const showReg = document.getElementById("show-register")!;
    showReg.click();

    expect(
      document.getElementById("login-section")?.classList.contains("hidden"),
    ).toBe(true);
    expect(
      document.getElementById("register-section")?.classList.contains("hidden"),
    ).toBe(false);

    const showLog = document.getElementById("show-login")!;
    showLog.click();

    expect(
      document.getElementById("register-section")?.classList.contains("hidden"),
    ).toBe(true);
    expect(
      document.getElementById("login-section")?.classList.contains("hidden"),
    ).toBe(false);
  });
});

import { setupContactForm } from "./contact";

describe("contact page", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form">
        <div><input name="name" /></div>
        <div><input name="email" /></div>
        <div><textarea name="message"></textarea></div>
        <button type="submit">Skicka</button>
      </form>
    `;
    setupContactForm();
  });

  it("shows errors for empty fields", () => {
    const form = document.getElementById("contact-form") as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelectorAll(".error")).toHaveLength(3);
  });

  it("shows error for invalid email", () => {
    const form = document.getElementById("contact-form") as HTMLFormElement;
    (form.elements.namedItem("name") as HTMLInputElement).value = "Foo";
    (form.elements.namedItem("email") as HTMLInputElement).value =
      "not-an-email";
    (form.elements.namedItem("message") as HTMLTextAreaElement).value = "Hello";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelector(".error")?.textContent).toMatch(/e-post/i);
  });

  it("clears form and shows success on valid submission", () => {
    const form = document.getElementById("contact-form") as HTMLFormElement;
    (form.elements.namedItem("name") as HTMLInputElement).value = "Foo";
    (form.elements.namedItem("email") as HTMLInputElement).value =
      "foo@example.com";
    (form.elements.namedItem("message") as HTMLTextAreaElement).value = "Hello";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(document.querySelector(".success")?.textContent).toContain(
      "skickats",
    );
    expect((form.elements.namedItem("name") as HTMLInputElement).value).toBe(
      "",
    );
  });
});

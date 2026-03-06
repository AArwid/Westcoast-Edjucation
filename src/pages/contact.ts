export function setupContactForm(formId = "contact-form"): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) {
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value.trim();

    form.querySelectorAll(".error").forEach((el) => el.remove());

    let valid = true;
    const addError = (fieldName: string, msg: string) => {
      const field = form.elements.namedItem(fieldName) as HTMLElement | null;
      if (field && field.parentElement) {
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

    if (!message) {
      valid = false;
      addError("message", "Meddelande krävs");
    }

    if (valid) {
      form.reset();
      const success = document.createElement("div");
      success.className = "success";
      success.textContent = "Ditt meddelande har skickats.";
      form.appendChild(success);
    }
  });
}

import { ICourse } from "../models/course.js";

export function setupCourseForm(
  formId: string,
  onCourseAdded: () => void = () => {},
): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = (
      form.elements.namedItem("title") as HTMLInputElement
    ).value.trim();
    const courseNumber = (
      form.elements.namedItem("courseNumber") as HTMLInputElement
    ).value.trim();
    const days = parseInt(
      (form.elements.namedItem("days") as HTMLInputElement).value,
    );
    const price = parseInt(
      (form.elements.namedItem("price") as HTMLInputElement).value,
    );
    const startDate = (form.elements.namedItem("startDate") as HTMLInputElement)
      .value;
    const imageUrl = (
      form.elements.namedItem("imageUrl") as HTMLInputElement
    ).value.trim();
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value.trim();
    const isClassroom = (
      form.elements.namedItem("isClassroom") as HTMLInputElement
    ).checked;
    const isDistance = (
      form.elements.namedItem("isDistance") as HTMLInputElement
    ).checked;

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

    if (!title) {
      valid = false;
      addError("title", "Kurstitel krävs");
    }
    if (!courseNumber) {
      valid = false;
      addError("courseNumber", "Kursnummer krävs");
    }
    if (!days || days < 1) {
      valid = false;
      addError("days", "Antal dagar måste vara minst 1");
    }
    if (!price || price < 0) {
      valid = false;
      addError("price", "Kostnad krävs");
    }

    if (valid) {
      const course: Partial<ICourse> = {
        id: Date.now(),
        title,
        courseNumber,
        days,
        price,
        startDate: startDate || "Ej angivet",
        imageUrl:
          imageUrl ||
          `https://picsum.photos/seed/${encodeURIComponent(title)}/400/200`,
        description: description || "",
        isClassroom,
        isDistance,
      };

      const stored: Partial<ICourse>[] = JSON.parse(
        localStorage.getItem("admin-courses") ?? "[]",
      );
      stored.push(course);
      localStorage.setItem("admin-courses", JSON.stringify(stored));

      form.reset();
      const success = document.createElement("div");
      success.className = "success";
      success.textContent = `Kurs "${title}" tillagd.`;
      form.appendChild(success);
      onCourseAdded();
    }
  });
}

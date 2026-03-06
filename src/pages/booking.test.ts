import { setupBookingForm } from "./booking";
import { register } from "../utils/auth";

describe("booking page", () => {
  beforeEach(() => {
    localStorage.clear();
    register("Test User", "test@test.se", "1234");

    window.history.pushState({}, "", "?courseId=1&courseTitle=Testkurs");
    document.body.innerHTML = `
      <p id="booking-course-info"></p>
      <form id="booking-form">
        <div><input name="customerName" /></div>
        <div><input name="billingAddress" /></div>
        <div><input name="email" /></div>
        <div><input name="mobile" /></div>
        <div>
          <select name="attendanceType">
            <option value="Classroom">Klassrum</option>
            <option value="Distance">Distans</option>
          </select>
        </div>
        <button type="submit">Boka</button>
      </form>
    `;
    setupBookingForm();
  });

  it("shows errors for empty fields", () => {
    const form = document.getElementById("booking-form") as HTMLFormElement;
    (form.elements.namedItem("customerName") as HTMLInputElement).value = "";
    (form.elements.namedItem("email") as HTMLInputElement).value = "";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelectorAll(".error")).toHaveLength(4);
  });

  it("shows error for invalid email", () => {
    const form = document.getElementById("booking-form") as HTMLFormElement;
    (form.elements.namedItem("customerName") as HTMLInputElement).value =
      "Test";
    (form.elements.namedItem("billingAddress") as HTMLInputElement).value =
      "Gatan 1";
    (form.elements.namedItem("email") as HTMLInputElement).value = "invalid";
    (form.elements.namedItem("mobile") as HTMLInputElement).value = "070123";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelector(".error")?.textContent).toMatch(/e-post/i);
  });

  it("clears form and shows success on valid submission", () => {
    const form = document.getElementById("booking-form") as HTMLFormElement;
    (form.elements.namedItem("customerName") as HTMLInputElement).value =
      "Anna";
    (form.elements.namedItem("billingAddress") as HTMLInputElement).value =
      "Gatan 1";
    (form.elements.namedItem("email") as HTMLInputElement).value =
      "anna@test.se";
    (form.elements.namedItem("mobile") as HTMLInputElement).value =
      "0701234567";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(document.querySelector(".success")?.textContent).toContain(
      "Bokning",
    );
    expect(
      (form.elements.namedItem("customerName") as HTMLInputElement).value,
    ).toBe("");
  });

  it("stores booking in localStorage", () => {
    const form = document.getElementById("booking-form") as HTMLFormElement;
    (form.elements.namedItem("customerName") as HTMLInputElement).value =
      "Anna";
    (form.elements.namedItem("billingAddress") as HTMLInputElement).value =
      "Gatan 1";
    (form.elements.namedItem("email") as HTMLInputElement).value =
      "anna@test.se";
    (form.elements.namedItem("mobile") as HTMLInputElement).value =
      "0701234567";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    const bookings = JSON.parse(localStorage.getItem("bookings") ?? "[]");
    expect(bookings).toHaveLength(1);
    expect(bookings[0].customerName).toBe("Anna");
    expect(bookings[0].courseId).toBe(1);
  });
});

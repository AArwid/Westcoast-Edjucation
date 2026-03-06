import { AttendanceType } from "../models/enums.js";
import { IBooking } from "../models/booking.js";
import { isLoggedIn, getCurrentUser } from "../utils/auth.js";

export function setupBookingForm(formId = "booking-form"): void {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("courseId");
  const courseTitle = params.get("courseTitle");

  if (!isLoggedIn()) {
    const redirectUrl = `pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;
    window.location.href = redirectUrl;
    return;
  }

  const user = getCurrentUser();
  if (user) {
    const nameField = document.querySelector<HTMLInputElement>(
      '[name="customerName"]',
    );
    const emailField =
      document.querySelector<HTMLInputElement>('[name="email"]');
    if (nameField && !nameField.value) nameField.value = user.name;
    if (emailField && !emailField.value) emailField.value = user.email;
  }

  const info = document.getElementById("booking-course-info");
  if (info && courseTitle) {
    info.textContent = `Bokar: ${courseTitle}`;
  }

  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) {
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const customerName = (
      form.elements.namedItem("customerName") as HTMLInputElement
    ).value.trim();
    const billingAddress = (
      form.elements.namedItem("billingAddress") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const mobile = (
      form.elements.namedItem("mobile") as HTMLInputElement
    ).value.trim();
    const attendanceType = (
      form.elements.namedItem("attendanceType") as HTMLSelectElement
    ).value as AttendanceType;

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

    if (!customerName) {
      valid = false;
      addError("customerName", "Kundnamn krävs");
    }
    if (!billingAddress) {
      valid = false;
      addError("billingAddress", "Faktureringsadress krävs");
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      valid = false;
      addError("email", "Giltig e-postadress krävs");
    }
    if (!mobile) {
      valid = false;
      addError("mobile", "Mobilnummer krävs");
    }

    if (valid) {
      const booking: IBooking = {
        id: Date.now(),
        courseId: courseId ? parseInt(courseId) : 0,
        courseTitle: courseTitle ?? "",
        customerName,
        billingAddress,
        email,
        mobile,
        attendanceType,
      };

      const stored: IBooking[] = JSON.parse(
        localStorage.getItem("bookings") ?? "[]",
      );
      stored.push(booking);
      localStorage.setItem("bookings", JSON.stringify(stored));

      form.reset();
      const success = document.createElement("div");
      success.className = "success";
      success.textContent =
        "Bokning bekräftad! En bekräftelse skickas till din e-post.";
      form.appendChild(success);
    }
  });
}

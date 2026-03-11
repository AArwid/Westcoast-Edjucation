import { adminLogin, isAdminLoggedIn, adminLogout } from "../utils/auth.js";
import { setupCourseForm } from "./adminCourseForm.js";
import {
  renderAdminCourseList,
  renderDeletedCourseList,
} from "./adminCourses.js";
import { renderBookingList } from "./adminBookings.js";

export function setupAdminPage(
  formId = "admin-course-form",
  listId = "booking-list",
  loginFormId = "admin-login-form",
): void {
  const loginSection = document.getElementById("admin-login-section");
  const adminContent = document.getElementById("admin-content");

  if (isAdminLoggedIn()) {
    loginSection?.classList.add("hidden");
    adminContent?.classList.remove("hidden");
    setupAdminLogout(loginSection, adminContent);
    setupCourseForm(formId, renderAdminCourseList);
    renderAdminCourseList();
    renderDeletedCourseList();
    renderBookingList(listId);
    return;
  }

  adminContent?.classList.add("hidden");
  loginSection?.classList.remove("hidden");

  const loginForm = document.getElementById(
    loginFormId,
  ) as HTMLFormElement | null;
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    loginForm.querySelectorAll(".error").forEach((el) => el.remove());

    const email = (
      loginForm.elements.namedItem("admin-user") as HTMLInputElement
    ).value.trim();
    const password = (
      loginForm.elements.namedItem("admin-pass") as HTMLInputElement
    ).value;

    try {
      adminLogin(email, password);
      loginSection?.classList.add("hidden");
      adminContent?.classList.remove("hidden");
      setupAdminLogout(loginSection, adminContent);
      setupCourseForm(formId, renderAdminCourseList);
      renderAdminCourseList();
      renderDeletedCourseList();
      renderBookingList(listId);
    } catch {
      const err = document.createElement("div");
      err.className = "error";
      err.textContent = "Fel användarnamn eller lösenord";
      loginForm.appendChild(err);
    }
  });
}

function setupAdminLogout(
  loginSection: HTMLElement | null,
  adminContent: HTMLElement | null,
): void {
  const btn = document.getElementById("admin-logout-btn");
  btn?.addEventListener("click", () => {
    adminLogout();
    adminContent?.classList.add("hidden");
    loginSection?.classList.remove("hidden");
  });
}

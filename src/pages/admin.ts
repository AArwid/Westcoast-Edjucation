import { ICourse } from "../models/course.js";
import { IBooking } from "../models/booking.js";
import { adminLogin, isAdminLoggedIn, adminLogout } from "../utils/auth.js";
import { HttpClient } from "../utils/httpClient.js";

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
    setupCourseForm(formId);
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
      setupCourseForm(formId);
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

function setupCourseForm(formId: string): void {
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
      renderAdminCourseList();
    }
  });
}

function renderAdminCourseList(containerId = "admin-course-list"): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  const client = new HttpClient();
  client.get<ICourse[]>("courses.json").then((staticCourses) => {
    const deletedIds: number[] = JSON.parse(
      localStorage.getItem("deleted-courses") ?? "[]",
    );
    const permanentlyDeletedIds: number[] = JSON.parse(
      localStorage.getItem("permanently-deleted-courses") ?? "[]",
    );
    const hiddenStaticIds = [...deletedIds, ...permanentlyDeletedIds];
    const visibleStatic = staticCourses.filter(
      (c) => !hiddenStaticIds.includes(c.id),
    );

    const adminCourses: Partial<ICourse>[] = JSON.parse(
      localStorage.getItem("admin-courses") ?? "[]",
    );

    const allCourses = [
      ...visibleStatic.map((c) => ({ ...c, isStatic: true })),
      ...adminCourses.map((c) => ({ ...c, isStatic: false })),
    ];

    if (allCourses.length === 0) {
      container.innerHTML = "<p>Inga kurser.</p>";
      return;
    }

    container.innerHTML = "";
    allCourses.forEach((course) => {
      const row = document.createElement("div");
      row.className = "admin-course-row";
      row.innerHTML = `
        <span><strong>${course.title}</strong> (${course.courseNumber}) \u2013 ${course.price} SEK</span>
        <button class="btn btn-delete" data-course-id="${course.id}" data-static="${course.isStatic}">Ta bort</button>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const el = e.currentTarget as HTMLElement;
        const id = Number(el.dataset.courseId);
        const isStatic = el.dataset.static === "true";
        if (isStatic) {
          deleteStaticCourse(id);
        } else {
          deleteAdminCourse(id);
        }
        renderAdminCourseList(containerId);
        renderDeletedCourseList();
      });
    });
  });
}

function deleteAdminCourse(id: number): void {
  const courses: Partial<ICourse>[] = JSON.parse(
    localStorage.getItem("admin-courses") ?? "[]",
  );
  const removed = courses.find((c) => c.id === id);
  const updated = courses.filter((c) => c.id !== id);
  localStorage.setItem("admin-courses", JSON.stringify(updated));

  if (removed) {
    const deletedAdmin: Partial<ICourse>[] = JSON.parse(
      localStorage.getItem("deleted-admin-courses") ?? "[]",
    );
    deletedAdmin.push(removed);
    localStorage.setItem("deleted-admin-courses", JSON.stringify(deletedAdmin));
  }
}

function deleteStaticCourse(id: number): void {
  const deleted: number[] = JSON.parse(
    localStorage.getItem("deleted-courses") ?? "[]",
  );
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem("deleted-courses", JSON.stringify(deleted));
  }
}

function renderDeletedCourseList(containerId = "deleted-course-list"): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  const client = new HttpClient();
  client.get<ICourse[]>("courses.json").then((staticCourses) => {
    const deletedIds: number[] = JSON.parse(
      localStorage.getItem("deleted-courses") ?? "[]",
    );
    const permanentlyDeletedIds: number[] = JSON.parse(
      localStorage.getItem("permanently-deleted-courses") ?? "[]",
    );
    const deletedStatic = staticCourses
      .filter(
        (c) =>
          deletedIds.includes(c.id) && !permanentlyDeletedIds.includes(c.id),
      )
      .map((c) => ({ ...c, isStatic: true }));

    const deletedAdmin: (Partial<ICourse> & { isStatic?: boolean })[] =
      JSON.parse(localStorage.getItem("deleted-admin-courses") ?? "[]").map(
        (c: Partial<ICourse>) => ({ ...c, isStatic: false }),
      );

    const allDeleted = [...deletedStatic, ...deletedAdmin];

    if (allDeleted.length === 0) {
      container.innerHTML = "<p>Inga borttagna kurser.</p>";
      return;
    }

    container.innerHTML = "";
    allDeleted.forEach((course) => {
      const row = document.createElement("div");
      row.className = "admin-course-row deleted-course-row";
      row.innerHTML = `
        <span><strong>${course.title}</strong> (${course.courseNumber}) \u2013 ${course.price} SEK</span>
        <div>
          <button class="btn btn-restore" data-course-id="${course.id}" data-static="${course.isStatic}">\u00C5terst\u00E4ll</button>
          <button class="btn btn-delete btn-permanent-delete" data-course-id="${course.id}" data-static="${course.isStatic}">Ta bort permanent</button>
        </div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll(".btn-restore").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const el = e.currentTarget as HTMLElement;
        const id = Number(el.dataset.courseId);
        const isStatic = el.dataset.static === "true";
        if (isStatic) {
          restoreStaticCourse(id);
        } else {
          restoreAdminCourse(id);
        }
        renderAdminCourseList();
        renderDeletedCourseList(containerId);
      });
    });

    container.querySelectorAll(".btn-permanent-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const el = e.currentTarget as HTMLElement;
        const id = Number(el.dataset.courseId);
        const isStatic = el.dataset.static === "true";

        if (isStatic) {
          permanentlyDeleteStaticCourse(id);
        } else {
          permanentlyDeleteAdminCourse(id);
        }

        renderAdminCourseList();
        renderDeletedCourseList(containerId);
      });
    });
  });
}

function restoreStaticCourse(id: number): void {
  const deleted: number[] = JSON.parse(
    localStorage.getItem("deleted-courses") ?? "[]",
  );
  const updated = deleted.filter((did) => did !== id);
  localStorage.setItem("deleted-courses", JSON.stringify(updated));

  const permanentlyDeleted: number[] = JSON.parse(
    localStorage.getItem("permanently-deleted-courses") ?? "[]",
  );
  if (permanentlyDeleted.includes(id)) {
    const updatedPermanent = permanentlyDeleted.filter((pid) => pid !== id);
    localStorage.setItem(
      "permanently-deleted-courses",
      JSON.stringify(updatedPermanent),
    );
  }
}

function restoreAdminCourse(id: number): void {
  const deletedAdmin: Partial<ICourse>[] = JSON.parse(
    localStorage.getItem("deleted-admin-courses") ?? "[]",
  );
  const restored = deletedAdmin.find((c) => c.id === id);
  const remaining = deletedAdmin.filter((c) => c.id !== id);
  localStorage.setItem("deleted-admin-courses", JSON.stringify(remaining));

  if (restored) {
    const courses: Partial<ICourse>[] = JSON.parse(
      localStorage.getItem("admin-courses") ?? "[]",
    );
    courses.push(restored);
    localStorage.setItem("admin-courses", JSON.stringify(courses));
  }
}

function permanentlyDeleteStaticCourse(id: number): void {
  const deleted: number[] = JSON.parse(
    localStorage.getItem("deleted-courses") ?? "[]",
  );
  const updatedDeleted = deleted.filter((did) => did !== id);
  localStorage.setItem("deleted-courses", JSON.stringify(updatedDeleted));

  const permanentlyDeleted: number[] = JSON.parse(
    localStorage.getItem("permanently-deleted-courses") ?? "[]",
  );
  if (!permanentlyDeleted.includes(id)) {
    permanentlyDeleted.push(id);
    localStorage.setItem(
      "permanently-deleted-courses",
      JSON.stringify(permanentlyDeleted),
    );
  }
}

function permanentlyDeleteAdminCourse(id: number): void {
  const deletedAdmin: Partial<ICourse>[] = JSON.parse(
    localStorage.getItem("deleted-admin-courses") ?? "[]",
  );
  const remaining = deletedAdmin.filter((c) => c.id !== id);
  localStorage.setItem("deleted-admin-courses", JSON.stringify(remaining));
}

function removeBooking(id: number, listId: string): void {
  const bookings: IBooking[] = JSON.parse(
    localStorage.getItem("bookings") ?? "[]",
  );
  const updated = bookings.filter((b) => b.id !== id);
  localStorage.setItem("bookings", JSON.stringify(updated));
  renderBookingList(listId);
}

function renderBookingList(listId: string): void {
  const container = document.getElementById(listId);
  if (!container) return;

  const bookings: IBooking[] = JSON.parse(
    localStorage.getItem("bookings") ?? "[]",
  );

  if (bookings.length === 0) {
    container.innerHTML = "<p>Inga bokningar ännu.</p>";
    return;
  }

  const grouped = new Map<number, IBooking[]>();
  bookings.forEach((b) => {
    const list = grouped.get(b.courseId) ?? [];
    list.push(b);
    grouped.set(b.courseId, list);
  });

  container.innerHTML = "";
  grouped.forEach((courseBookings, courseId) => {
    const courseTitle = courseBookings[0]?.courseTitle ?? `Kurs #${courseId}`;
    const heading = document.createElement("h3");
    heading.textContent = courseTitle;
    container.appendChild(heading);

    const ul = document.createElement("ul");
    courseBookings.forEach((b) => {
      const li = document.createElement("li");
      li.className = "booking-item";
      li.innerHTML = `
        <span>${b.customerName} – ${b.email} (${b.attendanceType})</span>
        <button class="btn btn-delete btn-remove-booking" data-booking-id="${b.id}">Ta bort</button>
      `;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  });

  container.querySelectorAll(".btn-remove-booking").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const el = e.currentTarget as HTMLElement;
      const id = Number(el.dataset.bookingId);
      removeBooking(id, listId);
    });
  });
}

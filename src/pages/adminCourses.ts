import { ICourse } from "../models/course.js";
import { HttpClient } from "../utils/httpClient.js";

export function renderAdminCourseList(containerId = "admin-course-list"): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  const client = new HttpClient();
  client.get<ICourse[]>("courses").then((staticCourses) => {
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

export function renderDeletedCourseList(
  containerId = "deleted-course-list",
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  const client = new HttpClient();
  client.get<ICourse[]>("courses").then((staticCourses) => {
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

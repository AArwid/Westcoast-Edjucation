import { setupAdminPage } from "./admin";
import { adminLogin } from "../utils/auth";

describe("admin page", () => {
  beforeEach(() => {
    localStorage.clear();
    adminLogin("admin", "password");

    document.body.innerHTML = `
      <div id="admin-login-section" class="hidden"></div>
      <div id="admin-content">
      <form id="admin-course-form">
        <div><input name="title" /></div>
        <div><input name="courseNumber" /></div>
        <div><input name="days" type="number" /></div>
        <div><input name="price" type="number" /></div>
        <div><input name="startDate" type="date" /></div>
        <div><input name="imageUrl" /></div>
        <div><textarea name="description"></textarea></div>
        <div><input name="isClassroom" type="checkbox" /></div>
        <div><input name="isDistance" type="checkbox" /></div>
        <button type="submit">Lägg till</button>
      </form>
      <div id="booking-list"></div>
      </div>
    `;
    setupAdminPage();
  });

  it("shows errors for empty fields", () => {
    const form = document.getElementById(
      "admin-course-form",
    ) as HTMLFormElement;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(document.querySelectorAll(".error").length).toBeGreaterThanOrEqual(
      4,
    );
  });

  it("adds a course to localStorage on valid submission", () => {
    const form = document.getElementById(
      "admin-course-form",
    ) as HTMLFormElement;
    (form.elements.namedItem("title") as HTMLInputElement).value = "Ny kurs";
    (form.elements.namedItem("courseNumber") as HTMLInputElement).value =
      "NK-1";
    (form.elements.namedItem("days") as HTMLInputElement).value = "10";
    (form.elements.namedItem("price") as HTMLInputElement).value = "5000";
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(document.querySelector(".success")?.textContent).toContain(
      "Ny kurs",
    );
    const courses = JSON.parse(localStorage.getItem("admin-courses") ?? "[]");
    expect(courses).toHaveLength(1);
    expect(courses[0].title).toBe("Ny kurs");
  });

  it("renders bookings per course", () => {
    localStorage.setItem(
      "bookings",
      JSON.stringify([
        {
          id: 1,
          courseId: 10,
          courseTitle: "React",
          customerName: "Anna",
          email: "a@b.se",
          attendanceType: "Classroom",
        },
        {
          id: 2,
          courseId: 10,
          courseTitle: "React",
          customerName: "Erik",
          email: "e@b.se",
          attendanceType: "Distance",
        },
      ]),
    );

    document.body.innerHTML = `
      <div id="admin-login-section" class="hidden"></div>
      <div id="admin-content">
      <form id="admin-course-form">
        <div><input name="title" /></div>
        <div><input name="courseNumber" /></div>
        <div><input name="days" type="number" /></div>
        <div><input name="price" type="number" /></div>
        <div><input name="startDate" type="date" /></div>
        <div><input name="imageUrl" /></div>
        <div><textarea name="description"></textarea></div>
        <div><input name="isClassroom" type="checkbox" /></div>
        <div><input name="isDistance" type="checkbox" /></div>
        <button type="submit">Lägg till</button>
      </form>
      <div id="booking-list"></div>
      </div>
    `;
    setupAdminPage();

    const list = document.getElementById("booking-list")!;
    expect(list.textContent).toContain("Anna");
    expect(list.textContent).toContain("Erik");
    expect(list.textContent).toContain("React");
  });

  it("renders a remove button per booking and removes booking on click", () => {
    localStorage.setItem(
      "bookings",
      JSON.stringify([
        {
          id: 1,
          courseId: 10,
          courseTitle: "React",
          customerName: "Anna",
          email: "a@b.se",
          attendanceType: "Classroom",
          billingAddress: "Gatan 1",
          mobile: "0701234567",
        },
        {
          id: 2,
          courseId: 10,
          courseTitle: "React",
          customerName: "Erik",
          email: "e@b.se",
          attendanceType: "Distance",
          billingAddress: "Vägen 2",
          mobile: "0707654321",
        },
      ]),
    );

    document.body.innerHTML = `
      <div id="admin-login-section" class="hidden"></div>
      <div id="admin-content">
      <form id="admin-course-form">
        <div><input name="title" /></div>
        <div><input name="courseNumber" /></div>
        <div><input name="days" type="number" /></div>
        <div><input name="price" type="number" /></div>
        <div><input name="startDate" type="date" /></div>
        <div><input name="imageUrl" /></div>
        <div><textarea name="description"></textarea></div>
        <div><input name="isClassroom" type="checkbox" /></div>
        <div><input name="isDistance" type="checkbox" /></div>
        <button type="submit">Lägg till</button>
      </form>
      <div id="booking-list"></div>
      </div>
    `;
    setupAdminPage();

    const list = document.getElementById("booking-list")!;
    const removeButtons = list.querySelectorAll(".btn-remove-booking");
    expect(removeButtons.length).toBe(2);

    (removeButtons[0] as HTMLButtonElement).click();

    const remaining: any[] = JSON.parse(
      localStorage.getItem("bookings") ?? "[]",
    );
    expect(remaining).toHaveLength(1);
    expect(remaining[0].customerName).toBe("Erik");

    expect(list.textContent).not.toContain("Anna");
    expect(list.textContent).toContain("Erik");
  });

  it("moves deleted admin course to deleted-admin-courses and restores it", () => {
    const course = {
      id: 99,
      title: "Temp",
      courseNumber: "T-1",
      days: 5,
      price: 1000,
    };
    localStorage.setItem("admin-courses", JSON.stringify([course]));

    const { deleteAdminCourse, restoreAdminCourse } = require("./admin") as any;
    const courses = JSON.parse(localStorage.getItem("admin-courses") ?? "[]");
    const removed = courses.find((c: any) => c.id === 99);
    const updated = courses.filter((c: any) => c.id !== 99);
    localStorage.setItem("admin-courses", JSON.stringify(updated));
    const deletedAdmin = JSON.parse(
      localStorage.getItem("deleted-admin-courses") ?? "[]",
    );
    deletedAdmin.push(removed);
    localStorage.setItem("deleted-admin-courses", JSON.stringify(deletedAdmin));

    expect(JSON.parse(localStorage.getItem("admin-courses")!)).toHaveLength(0);
    expect(
      JSON.parse(localStorage.getItem("deleted-admin-courses")!),
    ).toHaveLength(1);

    const delAdmin = JSON.parse(
      localStorage.getItem("deleted-admin-courses") ?? "[]",
    );
    const restored = delAdmin.find((c: any) => c.id === 99);
    const remaining = delAdmin.filter((c: any) => c.id !== 99);
    localStorage.setItem("deleted-admin-courses", JSON.stringify(remaining));
    const active = JSON.parse(localStorage.getItem("admin-courses") ?? "[]");
    active.push(restored);
    localStorage.setItem("admin-courses", JSON.stringify(active));

    expect(JSON.parse(localStorage.getItem("admin-courses")!)).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("admin-courses")!)[0].title).toBe(
      "Temp",
    );
    expect(
      JSON.parse(localStorage.getItem("deleted-admin-courses")!),
    ).toHaveLength(0);
  });

  it("permanently deletes a removed admin course from deleted list", async () => {
    localStorage.setItem(
      "deleted-admin-courses",
      JSON.stringify([
        {
          id: 501,
          title: "Arkiverad kurs",
          courseNumber: "AK-501",
          days: 2,
          price: 1200,
        },
      ]),
    );

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    document.body.innerHTML = `
      <div id="admin-login-section" class="hidden"></div>
      <div id="admin-content">
      <button id="admin-logout-btn"></button>
      <form id="admin-course-form">
        <div><input name="title" /></div>
        <div><input name="courseNumber" /></div>
        <div><input name="days" type="number" /></div>
        <div><input name="price" type="number" /></div>
        <div><input name="startDate" type="date" /></div>
        <div><input name="imageUrl" /></div>
        <div><textarea name="description"></textarea></div>
        <div><input name="isClassroom" type="checkbox" /></div>
        <div><input name="isDistance" type="checkbox" /></div>
        <button type="submit">Lägg till</button>
      </form>
      <div id="admin-course-list"></div>
      <div id="deleted-course-list"></div>
      <div id="booking-list"></div>
      </div>
    `;

    setupAdminPage();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const deletedList = document.getElementById("deleted-course-list");
    expect(deletedList?.textContent).toContain("Arkiverad kurs");

    const button = document.querySelector(
      ".btn-permanent-delete[data-course-id='501']",
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    button?.click();

    const deletedAdminCourses = JSON.parse(
      localStorage.getItem("deleted-admin-courses") ?? "[]",
    );
    expect(deletedAdminCourses).toHaveLength(0);
  });
});

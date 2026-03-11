import { loadCourseDetails } from "../pages/details";

describe("course details page", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="course-details"></div>';
    window.history.pushState({}, "", "?id=42");
    localStorage.clear();
    (global.fetch as jest.Mock).mockReset();
  });

  it("shows error if no id in query string", async () => {
    window.history.pushState({}, "", window.location.pathname);

    await loadCourseDetails();

    const container = document.getElementById("course-details");
    expect(container!.textContent).toContain("Ingen kurs vald");
  });

  it("shows spinner during fetch and removes it afterwards", async () => {
    const fake = {
      id: 42,
      title: "Testkurs",
      courseNumber: "T-1",
      days: 5,
      price: 5000,
      isClassroom: true,
      isDistance: false,
      imageUrl: "",
      startDate: "2026-01-01",
      description: "Beskrivning",
    };

    let resolveFetch: any;
    const fetchPromise = new Promise((res) => {
      resolveFetch = res;
    });
    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    const loadP = loadCourseDetails();
    expect(document.querySelector(".spinner")).not.toBeNull();

    resolveFetch({ ok: true, json: async () => [fake] });
    await loadP;

    expect(document.querySelector(".spinner")).toBeNull();
  });

  it("fetches the correct course and renders details", async () => {
    const fake = {
      id: 42,
      title: "Testkurs",
      courseNumber: "T-1",
      days: 5,
      price: 5000,
      isClassroom: true,
      isDistance: false,
      imageUrl: "",
      startDate: "2026-01-01",
      description: "Beskrivning",
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [fake],
    });

    await loadCourseDetails();

    const container = document.getElementById("course-details");
    expect(container?.classList.contains("details")).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("courses"),
    );
    expect(container!.textContent).toContain("Testkurs");
    expect(container!.textContent).toContain("T-1");
    expect(container!.textContent).toContain("5000");
  });

  it("renders admin-created course from localStorage", async () => {
    const staticCourse = {
      id: 1,
      title: "Static course",
      courseNumber: "S-1",
      days: 3,
      price: 1000,
      isClassroom: true,
      isDistance: false,
      imageUrl: "",
      startDate: "2026-01-01",
      description: "",
    };

    localStorage.setItem(
      "admin-courses",
      JSON.stringify([
        {
          id: 42,
          title: "Admin course",
          courseNumber: "A-42",
          days: 7,
          price: 9000,
          isClassroom: true,
          isDistance: true,
          imageUrl: "admin.jpg",
          startDate: "2026-06-01",
          description: "Admin beskrivning",
        },
      ]),
    );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [staticCourse],
    });

    await loadCourseDetails();

    const container = document.getElementById("course-details");
    expect(container!.textContent).toContain("Admin course");
    expect(container!.textContent).toContain("A-42");
    expect(container!.textContent).toContain("9000");
  });

  it("shows error if course does not exist", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await loadCourseDetails();

    const container = document.getElementById("course-details");
    expect(container!.textContent).toContain("Kursen kunde inte hittas");
  });
});

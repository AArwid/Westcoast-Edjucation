import { loadGallery } from "../pages/gallery";

describe("gallery page", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="gallery"></div>';
    (global.fetch as jest.Mock).mockReset();
  });

  it("renders a card for each course returned by the API", async () => {
    const fakeCourses = [
      {
        id: 1,
        title: "Webbutveckling",
        courseNumber: "WE-101",
        days: 30,
        price: 15000,
        isClassroom: true,
        isDistance: true,
        imageUrl: "img1.jpg",
        startDate: "2026-09-01",
        description: "Kurs A",
      },
      {
        id: 2,
        title: "React",
        courseNumber: "WE-202",
        days: 15,
        price: 12000,
        isClassroom: true,
        isDistance: false,
        imageUrl: "img2.jpg",
        startDate: "2026-10-15",
        description: "Kurs B",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => fakeCourses,
    });

    await loadGallery();
    const container = document.getElementById("gallery");
    expect(container?.classList.contains("gallery")).toBe(true);

    const cards = document.querySelectorAll(".course-card");
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toContain("Webbutveckling");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("courses.json"),
    );
  });

  it("shows a loading spinner until the API responds", async () => {
    let resolveFetch: any;
    const fetchPromise = new Promise((res) => {
      resolveFetch = res;
    });

    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    const loadPromise = loadGallery();
    expect(document.querySelector(".spinner")).not.toBeNull();

    resolveFetch({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Test",
          courseNumber: "T-1",
          days: 5,
          price: 1000,
          isClassroom: true,
          isDistance: false,
          imageUrl: "",
          startDate: "2026-01-01",
          description: "",
        },
      ],
    });
    await loadPromise;

    expect(document.querySelector(".spinner")).toBeNull();
  });
});

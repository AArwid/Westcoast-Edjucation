import { setupClassroomsPage } from "./classrooms";
import { register } from "../utils/auth";

const mockClassrooms = [
  { id: 1, name: "Sal A1", building: "Hus A", capacity: 30 },
  { id: 2, name: "Sal B1", building: "Hus B", capacity: 20 },
];

beforeEach(() => {
  localStorage.clear();
  register("Test", "test@test.se", "1234");
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockClassrooms,
  });
});

describe("classrooms page", () => {
  it("renders classroom cards with time slots", async () => {
    document.body.innerHTML = '<div id="classrooms-container"></div>';
    await setupClassroomsPage();

    const cards = document.querySelectorAll(".classroom-card");
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector("h2")?.textContent).toContain("Sal A1");

    const slots = cards[0].querySelectorAll(".time-slot");
    expect(slots).toHaveLength(9);
    expect(slots[0].textContent).toBe("8:00–9:00");
    expect(slots[8].textContent).toBe("16:00–17:00");
  });

  it("marks slot as booked after click", async () => {
    document.body.innerHTML = '<div id="classrooms-container"></div>';
    await setupClassroomsPage();

    const slot = document.querySelector(".time-slot") as HTMLButtonElement;
    expect(slot.disabled).toBe(false);

    slot.click();

    expect(slot.disabled).toBe(true);
    expect(slot.classList.contains("booked")).toBe(true);

    const bookings = JSON.parse(
      localStorage.getItem("classroom-bookings") ?? "[]",
    );
    expect(bookings).toHaveLength(1);
    expect(bookings[0].classroomName).toBe("Sal A1");
    expect(bookings[0].hour).toBe(8);
  });

  it("shows already-booked slots as disabled", async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    localStorage.setItem(
      "classroom-bookings",
      JSON.stringify([
        {
          id: 99,
          classroomId: 1,
          classroomName: "Sal A1",
          date: dateStr,
          hour: 10,
          studentName: "Other",
          studentEmail: "o@t.se",
        },
      ]),
    );

    document.body.innerHTML = '<div id="classrooms-container"></div>';
    await setupClassroomsPage();

    const slots = document
      .querySelectorAll(".classroom-card")[0]
      .querySelectorAll(".time-slot");
    expect((slots[2] as HTMLButtonElement).disabled).toBe(true);
    expect(slots[2].classList.contains("booked")).toBe(true);
    expect((slots[0] as HTMLButtonElement).disabled).toBe(false);
  });
});

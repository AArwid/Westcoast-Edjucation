import {
  getClassroomBookings,
  saveClassroomBooking,
  isSlotBooked,
  IClassroomBooking,
} from "../models/classroom";

describe("classroom model", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no bookings", () => {
    expect(getClassroomBookings()).toEqual([]);
  });

  it("saves and retrieves a booking", () => {
    const booking: IClassroomBooking = {
      id: 1,
      classroomId: 1,
      classroomName: "Sal A1",
      date: "2026-03-05",
      hour: 10,
      studentName: "Anna",
      studentEmail: "anna@test.se",
    };
    saveClassroomBooking(booking);

    const all = getClassroomBookings();
    expect(all).toHaveLength(1);
    expect(all[0].classroomName).toBe("Sal A1");
    expect(all[0].hour).toBe(10);
  });

  it("isSlotBooked returns true for booked slot", () => {
    saveClassroomBooking({
      id: 1,
      classroomId: 2,
      classroomName: "Sal A2",
      date: "2026-03-05",
      hour: 14,
      studentName: "Erik",
      studentEmail: "erik@test.se",
    });

    expect(isSlotBooked(2, "2026-03-05", 14)).toBe(true);
    expect(isSlotBooked(2, "2026-03-05", 15)).toBe(false);
    expect(isSlotBooked(1, "2026-03-05", 14)).toBe(false);
  });
});

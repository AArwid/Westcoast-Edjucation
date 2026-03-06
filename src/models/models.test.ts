import { createCourse, ICourse } from "./course";
import { createBooking, IBooking } from "./booking";
import { AttendanceType } from "./enums";

describe("data models", () => {
  test("createCourse returns a complete ICourse", () => {
    const c = createCourse({
      id: 1,
      title: "Webbutveckling",
      courseNumber: "WE-101",
      days: 30,
      price: 15000,
      isClassroom: true,
      isDistance: true,
      imageUrl: "img.jpg",
      startDate: "2026-09-01",
      description: "En kurs i webbutveckling",
    });

    expect(c).toMatchObject<ICourse>({
      id: 1,
      title: "Webbutveckling",
      courseNumber: "WE-101",
      days: 30,
      price: 15000,
      isClassroom: true,
      isDistance: true,
      imageUrl: "img.jpg",
      startDate: "2026-09-01",
      description: "En kurs i webbutveckling",
    });
  });

  test("createBooking returns a complete IBooking", () => {
    const b = createBooking({
      id: 1,
      courseId: 10,
      courseTitle: "React",
      customerName: "Anna Svensson",
      billingAddress: "Storgatan 1, Göteborg",
      email: "anna@example.com",
      mobile: "0701234567",
      attendanceType: AttendanceType.Distance,
    });

    expect(b).toMatchObject<IBooking>({
      id: 1,
      courseId: 10,
      courseTitle: "React",
      customerName: "Anna Svensson",
      billingAddress: "Storgatan 1, Göteborg",
      email: "anna@example.com",
      mobile: "0701234567",
      attendanceType: AttendanceType.Distance,
    });
  });
});

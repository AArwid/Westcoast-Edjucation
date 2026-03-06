export interface IClassroom {
  id: number;
  name: string;
  building: string;
  capacity: number;
}

export interface IClassroomBooking {
  id: number;
  classroomId: number;
  classroomName: string;
  date: string;
  hour: number;
  studentName: string;
  studentEmail: string;
}

const CLASSROOM_BOOKINGS_KEY = "classroom-bookings";

export function getClassroomBookings(): IClassroomBooking[] {
  return JSON.parse(localStorage.getItem(CLASSROOM_BOOKINGS_KEY) ?? "[]");
}

export function saveClassroomBooking(booking: IClassroomBooking): void {
  const bookings = getClassroomBookings();
  bookings.push(booking);
  localStorage.setItem(CLASSROOM_BOOKINGS_KEY, JSON.stringify(bookings));
}

export function isSlotBooked(
  classroomId: number,
  date: string,
  hour: number,
): boolean {
  const bookings = getClassroomBookings();
  return bookings.some(
    (b) => b.classroomId === classroomId && b.date === date && b.hour === hour,
  );
}

export function getBookingForSlot(
  classroomId: number,
  date: string,
  hour: number,
): IClassroomBooking | undefined {
  return getClassroomBookings().find(
    (b) => b.classroomId === classroomId && b.date === date && b.hour === hour,
  );
}

export function removeClassroomBooking(bookingId: number): void {
  const bookings = getClassroomBookings().filter((b) => b.id !== bookingId);
  localStorage.setItem(CLASSROOM_BOOKINGS_KEY, JSON.stringify(bookings));
}

export function getStudentBookingCount(
  studentEmail: string,
  classroomId: number,
  date: string,
): number {
  return getClassroomBookings().filter(
    (b) =>
      b.studentEmail === studentEmail &&
      b.classroomId === classroomId &&
      b.date === date,
  ).length;
}

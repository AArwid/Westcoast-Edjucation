import { AttendanceType } from "./course.js";

export interface IBooking {
  id: number;
  courseId: number;
  courseTitle: string;
  customerName: string;
  billingAddress: string;
  email: string;
  mobile: number;
  attendanceType: AttendanceType;
}

export function createBooking(data: Partial<IBooking>): IBooking {
  return {
    id: data.id ?? 0,
    courseId: data.courseId ?? 0,
    courseTitle: data.courseTitle ?? "",
    customerName: data.customerName ?? "",
    billingAddress: data.billingAddress ?? "",
    email: data.email ?? "",
    mobile: data.mobile ?? 0,
    attendanceType: data.attendanceType ?? AttendanceType.Classroom,
    ...data,
  } as IBooking;
}

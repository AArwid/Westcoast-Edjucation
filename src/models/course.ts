export interface ICourse {
  id: number;
  title: string;
  courseNumber: string;
  days: number;
  price: number;
  isClassroom: boolean;
  isDistance: boolean;
  imageUrl: string;
  startDate: string;
  description: string;
}
// write comments for this
export function createCourse(data: Partial<ICourse>): ICourse {
  return {
    id: data.id ?? 0,
    title: data.title ?? "",
    courseNumber: data.courseNumber ?? "",
    days: data.days ?? 0,
    price: data.price ?? 0,
    isClassroom: data.isClassroom ?? true,
    isDistance: data.isDistance ?? false,
    imageUrl: data.imageUrl ?? "",
    startDate: data.startDate ?? "",
    description: data.description ?? "",
    ...data,
  } as ICourse;
}

export enum AttendanceType {
  Classroom = "Classroom",
  Distance = "Distance",
}

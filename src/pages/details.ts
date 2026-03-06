import { HttpClient } from "../utils/httpClient.js";
import { ICourse } from "../models/course.js";

export async function loadCourseDetails(
  containerId = "course-details",
): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container #${containerId} not found`);
  }

  container.classList.add("details");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    container.innerHTML = '<p class="error">Ingen kurs vald.</p>';
    return;
  }

  const client = new HttpClient();
  container.innerHTML = `<div class="spinner"></div>`;

  const staticCourses = await client.get<ICourse[]>("courses.json");
  const adminCourses: Partial<ICourse>[] = JSON.parse(
    localStorage.getItem("admin-courses") ?? "[]",
  );

  const allCourses: ICourse[] = [
    ...staticCourses,
    ...adminCourses.map((c) => ({
      id: c.id ?? 0,
      title: c.title ?? "",
      courseNumber: c.courseNumber ?? "",
      days: c.days ?? 0,
      price: c.price ?? 0,
      isClassroom: c.isClassroom ?? true,
      isDistance: c.isDistance ?? false,
      imageUrl: c.imageUrl ?? "",
      startDate: c.startDate ?? "",
      description: c.description ?? "",
    })),
  ];

  const course = allCourses.find((c) => c.id === parseInt(id));
  if (!course) {
    container.innerHTML = '<p class="error">Kursen kunde inte hittas.</p>';
    return;
  }

  const availability: string[] = [];
  if (course.isClassroom) availability.push("Klassrum");
  if (course.isDistance) availability.push("Distans");

  container.innerHTML = `
    <img src="${encodeURI(course.imageUrl)}" alt="${course.title}" class="details-img" />
    <h2>${course.title}</h2>
    <p><strong>Kursnummer:</strong> ${course.courseNumber}</p>
    <p><strong>Antal dagar:</strong> ${course.days}</p>
    <p><strong>Pris:</strong> ${course.price} SEK</p>
    <p><strong>Startdatum:</strong> ${course.startDate}</p>
    <p><strong>Tillgänglig som:</strong> ${availability.join(", ")}</p>
    <p>${course.description}</p>
    <a href="booking.html?courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}" class="btn">Boka kurs</a>
  `;
}

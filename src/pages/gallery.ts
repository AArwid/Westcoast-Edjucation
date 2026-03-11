import { HttpClient } from "../utils/httpClient.js";
import { ICourse } from "../models/course.js";

export async function loadGallery(containerId = "gallery"): Promise<void> {
  const client = new HttpClient();

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container #${containerId} not found`);
  }

  container.classList.add("gallery");
  container.innerHTML = `<div class="spinner"></div>`;

  const courses = await client.get<ICourse[]>("courses");

  const deletedIds: number[] = JSON.parse(
    localStorage.getItem("deleted-courses") ?? "[]",
  );
  const permanentlyDeletedIds: number[] = JSON.parse(
    localStorage.getItem("permanently-deleted-courses") ?? "[]",
  );
  const hiddenStaticIds = [...deletedIds, ...permanentlyDeletedIds];
  const visibleCourses = courses.filter((c) => !hiddenStaticIds.includes(c.id));

  const adminCourses: Partial<ICourse>[] = JSON.parse(
    localStorage.getItem("admin-courses") ?? "[]",
  );
  adminCourses.forEach((c) => visibleCourses.push(c as ICourse));

  container.innerHTML = "";
  visibleCourses.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card";
    const availability: string[] = [];
    if (course.isClassroom) availability.push("Klassrum");
    if (course.isDistance) availability.push("Distans");

    card.innerHTML = `
      <img src="${encodeURI(course.imageUrl)}" alt="${course.title}" />
      <h3>${course.title}</h3>
      <p class="course-number">${course.courseNumber}</p>
      <p>${course.days} dagar</p>
      <p>${course.price} SEK</p>
      <p>Start: ${course.startDate}</p>
      <p>${availability.join(" / ")}</p>
      <a href="pages/details.html?id=${course.id}" class="btn">Visa detaljer</a>
    `;
    container.appendChild(card);
  });
}

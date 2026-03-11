import { IBooking } from "../models/booking.js";

export function renderBookingList(listId: string): void {
  const container = document.getElementById(listId);
  if (!container) return;

  const bookings: IBooking[] = JSON.parse(
    localStorage.getItem("bookings") ?? "[]",
  );

  if (bookings.length === 0) {
    container.innerHTML = "<p>Inga bokningar ännu.</p>";
    return;
  }

  const grouped = new Map<number, IBooking[]>();
  bookings.forEach((b) => {
    const list = grouped.get(b.courseId) ?? [];
    list.push(b);
    grouped.set(b.courseId, list);
  });

  container.innerHTML = "";
  grouped.forEach((courseBookings, courseId) => {
    const courseTitle = courseBookings[0]?.courseTitle ?? `Kurs #${courseId}`;
    const heading = document.createElement("h3");
    heading.textContent = courseTitle;
    container.appendChild(heading);

    const ul = document.createElement("ul");
    courseBookings.forEach((b) => {
      const li = document.createElement("li");
      li.className = "booking-item";
      li.innerHTML = `
        <span>${b.customerName} \u2013 ${b.email} (${b.attendanceType})</span>
        <button class="btn btn-delete btn-remove-booking" data-booking-id="${b.id}">Ta bort</button>
      `;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  });

  container.querySelectorAll(".btn-remove-booking").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const el = e.currentTarget as HTMLElement;
      const id = Number(el.dataset.bookingId);
      removeBooking(id, listId);
    });
  });
}

function removeBooking(id: number, listId: string): void {
  const bookings: IBooking[] = JSON.parse(
    localStorage.getItem("bookings") ?? "[]",
  );
  const updated = bookings.filter((b) => b.id !== id);
  localStorage.setItem("bookings", JSON.stringify(updated));
  renderBookingList(listId);
}

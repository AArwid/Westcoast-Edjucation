import {
  IClassroom,
  IClassroomBooking,
  saveClassroomBooking,
  getBookingForSlot,
  removeClassroomBooking,
  getStudentBookingCount,
} from "../models/classroom.js";
import { isLoggedIn, getCurrentUser, IUser } from "../utils/auth.js";
import { HttpClient } from "../utils/httpClient.js";

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const MAX_HOURS_PER_CLASSROOM = 2;

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function setupClassroomsPage(): Promise<void> {
  const container = document.getElementById("classrooms-container");
  if (!container) return;

  if (!isLoggedIn()) {
    const redirectUrl = `pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;
    window.location.href = redirectUrl;
    return;
  }

  const client = new HttpClient();
  let classrooms: IClassroom[];

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    classrooms = await client.get<IClassroom[]>("classrooms");
  } catch {
    container.innerHTML = '<p class="error">Kunde inte ladda klassrum.</p>';
    return;
  }

  const date = todayString();
  const user = getCurrentUser()!;

  container.innerHTML = "";

  for (const room of classrooms) {
    const card = document.createElement("div");
    card.className = "classroom-card";

    const header = document.createElement("h2");
    header.textContent = `${room.name} — ${room.building}`;
    card.appendChild(header);

    const cap = document.createElement("p");
    cap.className = "classroom-capacity";
    cap.textContent = `Kapacitet: ${room.capacity} platser`;
    card.appendChild(cap);

    const grid = document.createElement("div");
    grid.className = "time-grid";

    for (const hour of HOURS) {
      const slot = document.createElement("button");
      slot.className = "time-slot";
      slot.textContent = `${hour}:00–${hour + 1}:00`;
      slot.dataset.classroomId = String(room.id);
      slot.dataset.hour = String(hour);

      const existing = getBookingForSlot(room.id, date, hour);

      if (existing && existing.studentEmail === user.email) {
        slot.classList.add("booked-own");
        slot.title = "Din bokning – klicka för att avboka";
        slot.addEventListener("click", () => {
          removeClassroomBooking(existing.id);
          refreshClassroom(card, room, date, user);
          const msg = document.createElement("div");
          msg.className = "success";
          msg.textContent = `Avbokad: ${room.name} kl ${hour}:00–${hour + 1}:00`;
          card.appendChild(msg);
          // setTimeout(() => msg.remove());
        });
      } else if (existing) {
        slot.classList.add("booked");
        slot.disabled = true;
        slot.title = "Upptagen";
      } else {
        slot.addEventListener("click", () => {
          const count = getStudentBookingCount(user.email, room.id, date);
          if (count >= MAX_HOURS_PER_CLASSROOM) {
            const warn = document.createElement("div");
            warn.className = "error";
            warn.textContent = `Max ${MAX_HOURS_PER_CLASSROOM} timmar per klassrum och dag.`;
            card.appendChild(warn);
            // setTimeout(() => warn.remove(), 3000);
            return;
          }

          const booking: IClassroomBooking = {
            id: Date.now(),
            classroomId: room.id,
            classroomName: room.name,
            date,
            hour,
            studentName: user.name,
            studentEmail: user.email,
          };
          saveClassroomBooking(booking);
          refreshClassroom(card, room, date, user);

          const msg = document.createElement("div");
          msg.className = "success";
          msg.textContent = `Bokad: ${room.name} kl ${hour}:00–${hour + 1}:00`;
          card.appendChild(msg);
          // setTimeout(() => msg.remove(), 3000);
        });
      }

      grid.appendChild(slot);
    }

    card.appendChild(grid);
    container.appendChild(card);
  }
}

function refreshClassroom(
  card: HTMLElement,
  room: IClassroom,
  date: string,
  user: IUser,
): void {
  const oldGrid = card.querySelector(".time-grid");
  if (oldGrid) oldGrid.remove();

  const grid = document.createElement("div");
  grid.className = "time-grid";

  for (const hour of HOURS) {
    const slot = document.createElement("button");
    slot.className = "time-slot";
    slot.textContent = `${hour}:00–${hour + 1}:00`;
    slot.dataset.classroomId = String(room.id);
    slot.dataset.hour = String(hour);

    const existing = getBookingForSlot(room.id, date, hour);

    if (existing && existing.studentEmail === user.email) {
      slot.classList.add("booked-own");
      slot.title = "Din bokning – klicka för att avboka";
      slot.addEventListener("click", () => {
        removeClassroomBooking(existing.id);
        refreshClassroom(card, room, date, user);
        const msg = document.createElement("div");
        msg.className = "success";
        msg.textContent = `Avbokad: ${room.name} kl ${hour}:00–${hour + 1}:00`;
        card.appendChild(msg);
        // setTimeout(() => msg.remove(), 3000);
      });
    } else if (existing) {
      slot.classList.add("booked");
      slot.disabled = true;
      slot.title = "Upptagen";
    } else {
      slot.addEventListener("click", () => {
        const count = getStudentBookingCount(user.email, room.id, date);
        if (count >= MAX_HOURS_PER_CLASSROOM) {
          const warn = document.createElement("div");
          warn.className = "error";
          warn.textContent = `Max ${MAX_HOURS_PER_CLASSROOM} timmar per klassrum och dag.`;
          card.appendChild(warn);
          // setTimeout(() => warn.remove(), 3000);
          return;
        }

        const booking: IClassroomBooking = {
          id: Date.now(),
          classroomId: room.id,
          classroomName: room.name,
          date,
          hour,
          studentName: user.name,
          studentEmail: user.email,
        };
        saveClassroomBooking(booking);
        refreshClassroom(card, room, date, user);

        const msg = document.createElement("div");
        msg.className = "success";
        msg.textContent = `Bokad: ${room.name} kl ${hour}:00–${hour + 1}:00`;
        card.appendChild(msg);
        // setTimeout(() => msg.remove(), 3000);
      });
    }

    grid.appendChild(slot);
  }

  card.appendChild(grid);
}

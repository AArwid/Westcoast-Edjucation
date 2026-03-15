# Westcoast Education

Westcoast Education is a TypeScript web application for browsing IT courses, booking courses, and managing classroom time slots. It includes user authentication, an admin panel for course management, and a local JSON API powered by json-server.

The project is built with plain HTML, TypeScript, and CSS (no frontend framework), and compiles TypeScript from `src/` into browser-ready JavaScript in `dist/`.

## What the application does

The app simulates a training company website where users can:

- Browse all available courses.
- Open a details page for each course.
- Log in or register to book courses.
- Book classroom time slots for specific rooms.
- Contact the company through a validated contact form.

Administrators can:

- Log in to the admin area.
- Add new courses.
- Soft-delete and restore courses.
- Permanently delete courses.
- View and remove bookings grouped by course.

## Main features

### 1. Course gallery and details

- Gallery page loads courses from `GET /courses` via `HttpClient`.
- Course cards display title, course number, days, price, start date, and format (Classroom/Distance).
- Details page is selected by query parameter (`?id=`) and combines static courses with admin-created courses stored in localStorage.

### 2. Course booking flow

- Booking page requires a logged-in user.
- If user is not logged in, they are redirected to login and then returned to the original page.
- Booking form validates:
  - Customer name
  - Billing address
  - Email format
  - Mobile number
- Bookings are saved to localStorage under `bookings`.

### 3. User authentication

- User registration and login are handled locally in browser storage.
- Registered users are stored in localStorage key `we-users`.
- Active session user is stored in `we-current-user`.
- Navigation updates automatically to show username + logout when logged in.

### 4. Classroom booking

- Classroom page requires login.
- Loads classroom list from `GET /classrooms`.
- Shows bookable hourly slots for current day (`08:00` to `17:00`).
- Business rule: max 2 booked hours per classroom per day per student.
- Users can click their own slots to cancel booking.
- Classroom bookings are saved in localStorage key `classroom-bookings`.

### 5. Admin management

- Admin login is separate from regular user login.
- Default credentials are configured in `src/config/env.ts`:
  - Username: `admin`
  - Password: `password`
- Admin can:
  - Add courses (stored in `admin-courses`)
  - Delete/restore static courses (`deleted-courses`, `permanently-deleted-courses`)
  - Delete/restore admin courses (`deleted-admin-courses`)
  - View and remove customer bookings

## Tech stack

- TypeScript (strict mode)
- HTML5 modules
- CSS
- Fetch API
- json-server (mock REST API)
- Jest + ts-jest + jsdom (tests)

## Project structure

```text
.
|- index.html
|- pages/
|  |- about.html
|  |- admin.html
|  |- booking.html
|  |- classrooms.html
|  |- contact.html
|  |- details.html
|  |- login.html
|- src/
|  |- config/
|  |  |- env.ts
|  |- interfaces/
|  |  |- IHttpClient.ts
|  |- models/
|  |  |- booking.ts
|  |  |- classroom.ts
|  |  |- course.ts
|  |- pages/
|  |  |- about.ts
|  |  |- admin.ts
|  |  |- adminBookings.ts
|  |  |- adminCourseForm.ts
|  |  |- adminCourses.ts
|  |  |- booking.ts
|  |  |- classrooms.ts
|  |  |- contact.ts
|  |  |- details.ts
|  |  |- gallery.ts
|  |  |- login.ts
|  |- utils/
|  |  |- auth.ts
|  |  |- httpClient.ts
|  |  |- navAuth.ts
|  |- tests/
|- data/
|  |- courses.json
|- dist/ (generated)
```

## Page map

| Route                    | Purpose                  | Script entry               |
| ------------------------ | ------------------------ | -------------------------- |
| `/index.html`            | Course gallery           | `dist/pages/gallery.js`    |
| `/pages/details.html`    | Course details           | `dist/pages/details.js`    |
| `/pages/booking.html`    | Course booking form      | `dist/pages/booking.js`    |
| `/pages/classrooms.html` | Classroom booking        | `dist/pages/classrooms.js` |
| `/pages/login.html`      | User login/registration  | `dist/pages/login.js`      |
| `/pages/admin.html`      | Admin panel and bookings | `dist/pages/admin.js`      |
| `/pages/about.html`      | About information        | `dist/pages/about.js`      |
| `/pages/contact.html`    | Contact form             | `dist/pages/contact.js`    |

All pages also load `dist/utils/navAuth.js` to handle authenticated navigation state.

## API and data

The application expects json-server at:

- `http://localhost:3000/`

Defined in:

- `src/config/env.ts` as `API_BASE_URL`

Endpoints (from `data/courses.json`):

- `GET /courses`
- `GET /classrooms`

## LocalStorage keys used

- `we-users` - registered users
- `we-current-user` - current logged-in user
- `we-admin-logged-in` - admin session flag
- `bookings` - course bookings
- `classroom-bookings` - classroom time-slot bookings
- `admin-courses` - admin-created courses
- `deleted-courses` - soft-deleted static course ids
- `permanently-deleted-courses` - permanently hidden static course ids
- `deleted-admin-courses` - soft-deleted admin-created courses

## Setup and run

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the API server

```bash
npm run server
```

This starts json-server and exposes `courses` and `classrooms` from `data/courses.json`.

### Build TypeScript (watch mode)

```bash
npm run build
```

This compiles `src/` to `dist/` continuously.

### Serve static files

Open the project with a static server (for example VS Code Live Server) and start from `index.html`.

Important: Do not open HTML files directly with `file://` because module imports and API calls require an HTTP server.

## Scripts

- `npm run build` - TypeScript compiler in watch mode (`tsc --watch`)
- `npm run server` - json-server on `http://localhost:3000`
- `npm run test` - run Jest tests
- `npm run lint` - type-check only (`tsc --noEmit`)

## Testing

Tests are located in `src/tests/` and run with Jest in a jsdom environment.

Coverage includes:

- Models
- HTTP client
- Gallery page rendering
- Details page behavior
- Booking form behavior
- Contact form validation
- Login/auth logic
- Admin workflows
- Classroom logic

Run tests:

```bash
npm test
```

## Notes and limitations

- This is a frontend-focused project with mock API and localStorage persistence.
- Data is not shared between browsers/devices because most mutable state is localStorage-based.
- `npm run build` currently runs in watch mode and does not exit automatically.

## Image credits

Course images referenced in `data/courses.json` are from Pexels:

- Fullstack Webbutveckling: https://www.pexels.com/photo/3861969/
- React and TypeScript: https://www.pexels.com/photo/574071/
- Node.js Backend-utveckling: https://www.pexels.com/photo/1181671/
- Mobilutveckling med React Native: https://www.pexels.com/photo/546819/
- DevOps and CI/CD: https://www.pexels.com/photo/1181263/
- Python for Dataanalys: https://www.pexels.com/photo/1181359/
- UX/UI Design for Utvecklare: https://www.pexels.com/photo/196644/
- Databaser and SQL: https://www.pexels.com/photo/577585/

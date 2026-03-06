# Westcoast Education

TypeScript single-page application for **WestCoast Education** — an IT education
company offering classroom, distance, and on-demand courses.

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+

## Getting Started

```bash
npm install
```

## Available Scripts

- `npm run lint` — Type-check without generating output
- `npm run build` — Compile TypeScript to `dist/`
- `npm test` — Run Jest unit tests (jsdom environment)

## Running the App

1. `npm run build`
2. Open `index.html` in a browser (or serve with any static server)

## Architecture

### Pages

| Page           | File                                    | Description                                 |
| -------------- | --------------------------------------- | ------------------------------------------- |
| Course gallery | `index.html` + `src/pages/gallery.ts`   | Lists all courses with cards                |
| Course details | `details.html` + `src/pages/details.ts` | Shows full course info, booking link        |
| Booking        | `booking.html` + `src/pages/booking.ts` | Booking form (name, address, email, mobile) |
| About          | `about.html` + `src/pages/about.ts`     | Company information                         |
| Contact        | `contact.html` + `src/pages/contact.ts` | Contact form with validation                |
| Admin          | `admin.html` + `src/pages/admin.ts`     | Add courses, view bookings per course       |

### Core Layers

- `src/models/` — `course.ts`, `booking.ts`, `enums.ts` (domain types)
- `src/interfaces/` — `IHttpClient.ts` (HTTP contract)
- `src/utils/` — `httpClient.ts` (fetch-based HTTP client)
- `src/config/` — `env.ts` (API base URL)
- `src/assets/` — `styles.css` (responsive CSS)
- `data/courses.json` — sample course data

### Data Flow

1. Page modules fetch data through `HttpClient`
2. `HttpClient` resolves URLs via `API_BASE_URL` from `env.ts`
3. JSON responses are typed with model interfaces
4. Page modules render HTML into containers
5. Bookings are stored in `localStorage`

### Testing

Tests live alongside source files and run with Jest + jsdom:

- Model factories (`models.test.ts`)
- HTTP client (`httpClient.test.ts`)
- Gallery rendering (`gallery.test.ts`)
- Details page (`details.test.ts`)
- Contact form (`contact.test.ts`)
- Booking form (`booking.test.ts`)
- Admin page (`admin.test.ts`)
- `rootDir: src`
- `outDir: dist`

## Notes

- App data is static and served from `./data/` by default.
- Build artifacts are generated into `dist/`.
- The spec source is available in `Westcoast_Education.pdf`.

## Bildkallor (Courses)

Foljande bilder i `data/courses.json` kommer fran Pexels:

- Fullstack Webbutveckling: `https://www.pexels.com/photo/3861969/`
- React & TypeScript: `https://www.pexels.com/photo/574071/`
- Node.js Backend-utveckling: `https://www.pexels.com/photo/1181671/`
- Mobilutveckling med React Native: `https://www.pexels.com/photo/546819/`
- DevOps & CI/CD: `https://www.pexels.com/photo/1181263/`
- Python for Dataanalys: `https://www.pexels.com/photo/1181359/`
- UX/UI Design for Utvecklare: `https://www.pexels.com/photo/196644/`
- Databaser & SQL: `https://www.pexels.com/photo/577585/`

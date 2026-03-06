# Westcoast-Edjucation

This repository contains a simple TypeScript single-page application called **WestCoast Cars**. The app is built to satisfy the Westcoast Education specification.

## Structure

- `src/models` – data models such as `Vehicle`, `Post`, and supporting enums.
- `src/utils` – utility functions including an HTTP client and related tests.
- `src/config` – environment configuration stubbed for API base url.
- `src/interfaces` – shared interfaces such as `IHttpClient`.

Additional pages and assets are expected to live alongside these modules according to the specification. A global stylesheet (`src/assets/styles.css`) defines layout helpers (grid, navigation, spinner, responsive rules) and should be linked from the HTML entry point.

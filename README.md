# TIE calmly

A Russian language guide to preparing for a TIE appointment in Spain. It provides official resources, a document checklist, a personal log of appointment checks, and a Spanish message template. Checklist items and log entries are stored in the browser on the user's device. The application does not search for or book appointments.

## Technology

The interface uses React, TypeScript, Vite, and Tailwind CSS. The project also includes an Express server and tRPC, Drizzle, and MySQL integration scaffolding.

## Development

The project uses pnpm 10.18.0 and Node.js 22 as specified in the Dockerfile.

- `pnpm install`: install dependencies.
- `pnpm dev`: start the development server on port 3000 by default.
- `pnpm build`: build the client and server.
- `pnpm start`: start the production server.
- `pnpm check`: check TypeScript types.
- `pnpm test`: run the test suite.

## Author

Aleksey Savchenko, https://github.com/alejoas1981.

This is an independent informational prototype, not an official Spanish government service or legal advice. Check current requirements with the relevant authorities.

## Analytics configuration

Set `VITE_GA_MEASUREMENT_ID` to the Google Analytics measurement ID before building the application. Vite embeds this public identifier during the build. Leave it empty to disable analytics. For Docker builds, pass it as the `VITE_GA_MEASUREMENT_ID` build argument. Rebuild and redeploy after changing the value.

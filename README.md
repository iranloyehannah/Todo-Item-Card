# Stage 0 Frontend: Testable Todo Item Card

A single-card productivity UI built with React and Vite. The component uses semantic HTML, supports the required `data-testid` hooks, and updates the time remaining every 30 seconds so due-date hints stay accurate against the browser's current time.

## Live URL

Add your deployed URL here after publishing:

- Vercel: `https://your-project-name.vercel.app`
- Netlify: `https://your-project-name.netlify.app`

## GitHub Repo

Add your repository URL here after pushing:

- `https://github.com/your-username/your-repository-name`

## Repo Notes

This repository contains:

- A high-fidelity task card with semantic roles and accessible controls
- Accurate due date formatting like `Due Apr 16, 2026` and relative hints like `Due in 3 days`
- A real checkbox for task completion
- Optional bonus test coverage with React Testing Library and Vitest

## How to Run Locally

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Open the local Vite URL shown in your terminal

## Deployment Notes

1. Push this project to a GitHub repository
2. Import the repository into Vercel or Netlify
3. Build command: `npm run build`
4. Output directory: `dist`
5. Copy the generated deployment URL into the `Live URL` section above

## Decisions Made

- Used React + Vite for a lightweight single-page deliverable that is easy to test and deploy
- Used semantic elements such as `article`, `h2`, `p`, `time`, `ul`, `li`, `button`, and a real checkbox input
- Kept the card state local because Stage 0 only needs a polished presentational core UI element
- Refreshed the relative time every 30 seconds to keep automated checks and visual hints in sync with real time
- Used a yellow, black, and teal visual system to give the card a stronger identity while keeping contrast high

## Trade-offs

- The `Edit` and `Delete` actions are UI-ready but non-persistent because the brief focuses on the card component itself
- The demo ships with one sample task instead of a full task list to keep the implementation tightly aligned with the acceptance criteria
- Live deployment and GitHub remote setup require your own hosting/account credentials, so the codebase is prepared for deployment but the final URLs must be added after publishing

## Testing

- Run `npm test` to execute the Vitest suite
- The included test verifies the required test IDs and checks completion-state behavior

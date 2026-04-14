# Stage 1 Frontend: Advanced Todo Card

A single-card productivity UI built with React and Vite. Stage 1 extends the original Stage 0 card into a stateful component with editable content, synchronized status controls, collapsible long-form detail, and richer due-date feedback.

## Live URL

Add your deployed URL here after publishing:

- Vercel: `https://your-project-name.vercel.app`
- Netlify: `https://your-project-name.netlify.app`

## GitHub Repo

Add your repository URL here after pushing:

- `https://github.com/your-username/your-repository-name`

## What Changed From Stage 0

- Added edit mode with labeled fields for title, description, priority, and due date
- Added save/cancel flows with local state restoration on cancel
- Replaced passive status display with an interactive status control
- Synchronized checkbox state and task status so `Done` always maps to a checked card
- Added a dedicated priority indicator with stronger visual treatment for `High`
- Added expand/collapse behavior for long descriptions using accessible `aria-expanded` and `aria-controls`
- Added explicit overdue handling and more granular relative time labels
- Kept the time display live with a 30-second refresh cadence until the task is marked complete

## New Design Decisions

- Kept the card state local because the brief still targets a single advanced card rather than a multi-item app
- Used explicit `status` plus synchronized `completed` state to keep the checkbox, badge, and status control visually aligned
- Defaulted long descriptions to collapsed so the card remains compact on 320px layouts
- Preserved all Stage 0 `data-testid` hooks and layered the new Stage 1 hooks on top of the same component structure
- Used left-border accents, badges, and a small priority dot so state changes remain visible without changing the overall layout

## Accessibility Notes

- Edit form controls use explicit `<label htmlFor="">` associations
- The status select exposes the accessible name `Task status`
- The expand/collapse button uses `aria-expanded` and `aria-controls` linked to the collapsible region
- Relative time uses `aria-live="polite"` so changes can be announced without interrupting the user
- Keyboard order is preserved across the main interactive controls and edit actions
- Focus returns to the `Edit` button when edit mode closes

## Known Limitations

- Delete is still a demo action and does not remove the card from the page
- Focus trapping inside the edit form is not implemented; focus return is implemented instead
- Live URL and GitHub URL still need your deployment and repository details

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

## Testing

- Run `npm test` to execute the Vitest suite
- The test suite covers Stage 0 hooks plus Stage 1 edit flows, status synchronization, collapse accessibility, and time-state behavior

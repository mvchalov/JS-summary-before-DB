# Full Stack readiness checklist

Student checklist for the core lesson topics in Developers Institute Full Stack Week 3 Day 1 through Week 6 Day 4. Mini-projects and hackathons are excluded from the app.

## Run locally

```bash
npm install
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001/api/topics

Progress is stored only in the browser with `localStorage`. The Express server stores nothing.

## Verify

```bash
npm run check
```

## Production-style local run

```bash
npm run build
npm start
```

Then open http://localhost:3001.

## Deploy on Vercel

This project is ready for one Vercel project: Vite builds to the root `public/` directory and Express runs as one Node.js Function.

1. Push this folder to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel.
3. Set the project root to this folder. If this folder is inside a larger repository, choose `JS-summary-before-DB` as the Root Directory.
4. Deploy. `vercel.json` supplies the Vite preset, build command, output directory, API rewrite, and SPA fallback.

The expected Vercel settings are:

- Root Directory: the folder containing this README and `vercel.json`
- Build Command: `npm run build:vercel`
- Output Directory: `public`

Repository configuration should be used unless a dashboard override is required. If Vercel reports that `public` is missing, confirm the Root Directory is not set to `client`.

No environment variables are required. Run the same deployment build locally before pushing:

```bash
npm run build:vercel
npm test
```

Optional CLI preview from this folder:

```bash
npx vercel@latest
```

Progress remains in `localStorage`. It is tied to the deployment origin, so preview and production URLs keep separate progress.

## Included

- TypeScript + React frontend
- TypeScript + Express backend
- Search, week filter, readiness filter
- Export current progress as a structured Markdown report
- Topic selection
- Print selected topics
- Export selected topics as Markdown
- Interactive PDF checklist in `output/pdf/`

The app contains 13 topics across 14 core lesson days. The existing PDF keeps the complete 19-day checklist. Curriculum source links point to authenticated Developers Institute Octopus pages.

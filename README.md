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

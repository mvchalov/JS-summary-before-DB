import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Filter,
  Printer,
  RotateCcw,
  Search,
  Sparkles
} from "lucide-react";
import type { Topic } from "../../shared/curriculum";
import { overallProgress, topicProgress, topicReadiness, type ProgressMap, type Readiness } from "./progress";
import { buildProgressMarkdown, formatExportDate } from "./progressExport";

type ApiResponse = {
  meta: {
    title: string;
    range: string;
    topics: number;
    days: number;
  };
  topics: Topic[];
};

const STORAGE_KEY = "di-full-stack-readiness-v1";

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]!);

const toMarkdown = (topics: Topic[], progress: ProgressMap) => {
  const lines = ["# Full Stack readiness", "", "Week 3 Day 1 → Week 6 Day 4", ""];

  topics.forEach((topic) => {
    lines.push(`## ${topic.number}. ${topic.title}`, "", topic.summary, "", "### Checklist", "");
    topic.checklist.forEach((entry) => lines.push(`- [${progress[entry.id] ? "x" : " "}] ${entry.text}`));
    lines.push("", "### Practice", "");
    topic.practice.forEach((entry) => lines.push(`- ${entry}`));
    lines.push("", "### Common mistakes", "");
    topic.mistakes.forEach((entry) => lines.push(`- ${entry}`));
    lines.push("", "### Sources", "");
    topic.sources.forEach((day) => lines.push(`- [W${day.week} D${day.day} · ${day.title}](${day.url})`));
    lines.push("");
  });

  return lines.join("\n");
};

const printSelected = (topics: Topic[], progress: ProgressMap) => {
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) return;

  const body = topics.map((topic) => `
    <section>
      <p class="eyebrow">Topic ${topic.number} · ${escapeHtml(topic.eyebrow)}</p>
      <h2>${escapeHtml(topic.title)}</h2>
      <p>${escapeHtml(topic.summary)}</p>
      <ul>${topic.checklist.map((entry) => `<li>${progress[entry.id] ? "☑" : "☐"} ${escapeHtml(entry.text)}</li>`).join("")}</ul>
      <h3>Practice</h3>
      <ul>${topic.practice.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>
      <p class="sources">${topic.sources.map((day) => `W${day.week} D${day.day}: ${escapeHtml(day.title)}`).join(" · ")}</p>
    </section>`).join("");

  popup.document.write(`<!doctype html><html><head><title>Selected Full Stack topics</title><style>
    body{font-family:Poppins,Arial,sans-serif;color:#111;margin:36px;line-height:1.5}header{border-bottom:4px solid #e52821;margin-bottom:24px}h1{font-size:28px}h2{font-size:20px;margin:4px 0}h3{font-size:13px;text-transform:uppercase}section{break-inside:avoid;border-bottom:1px solid #ddd;padding:0 0 20px;margin:0 0 20px}.eyebrow,.sources{font-size:11px;color:#666}.eyebrow{text-transform:uppercase;font-weight:700;letter-spacing:.08em}ul{padding-left:20px}li{margin:5px 0}@media print{body{margin:18mm}}</style></head><body><header><h1>Full Stack readiness</h1><p>Selected topics · Week 3 Day 1 → Week 6 Day 4</p></header>${body}<script>window.onload=()=>window.print()</script></body></html>`);
  popup.document.close();
};

const downloadMarkdown = (markdown: string, filename: string) => {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState("all");
  const [readiness, setReadiness] = useState<Readiness | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    fetch("/api/topics")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the checklist.");
        return response.json();
      })
      .then(setData)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const filteredTopics = useMemo(() => {
    if (!data) return [];
    const needle = query.trim().toLowerCase();
    return data.topics.filter((topic) => {
      const searchable = [
        topic.title,
        topic.eyebrow,
        topic.summary,
        ...topic.checklist.map((entry) => entry.text),
        ...topic.practice,
        ...topic.mistakes
      ].join(" ").toLowerCase();
      const matchesQuery = !needle || searchable.includes(needle);
      const matchesWeek = week === "all" || topic.sources.some((day) => day.week === Number(week));
      const matchesReadiness = readiness === "all" || topicReadiness(topic, progress) === readiness;
      return matchesQuery && matchesWeek && matchesReadiness;
    });
  }, [data, progress, query, readiness, week]);

  const selectedTopics = data?.topics.filter((topic) => selected.has(topic.id)) ?? [];
  const overall = overallProgress(data?.topics ?? [], progress);

  const toggleItem = (id: string) => setProgress((current) => ({ ...current, [id]: !current[id] }));
  const toggleTopic = (id: string) => setSelected((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const reset = () => {
    if (window.confirm("Clear every checked skill on this browser?")) setProgress({});
  };
  const exportMarkdown = () => {
    if (!selectedTopics.length) return;
    downloadMarkdown(toMarkdown(selectedTopics, progress), "selected-full-stack-topics.md");
  };
  const exportCurrentProgress = () => {
    const now = new Date();
    const markdown = buildProgressMarkdown(data?.topics ?? [], progress, {
      title: data?.meta.title ?? "Full Stack readiness",
      range: data?.meta.range ?? "Week 3 Day 1 → Week 6 Day 4",
      generatedAt: now
    });
    downloadMarkdown(markdown, `full-stack-progress-${formatExportDate(now)}.md`);
  };

  if (error) return <main className="status-page"><h1>Checklist unavailable</h1><p>{error}</p></main>;
  if (!data) return <main className="status-page"><div className="loader" /><p>Loading readiness map…</p></main>;

  return (
    <>
      <header className="topbar">
        <a className="brand" href="https://developers.institute/" target="_blank" rel="noreferrer" aria-label="Developers Institute website">
          <img src="/di-logo.png" alt="Developers Institute" />
        </a>
        <p>Student checklist</p>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker"><Sparkles size={15} /> Before databases</p>
            <h1>Know what you know.<br /><span>Find the gaps.</span></h1>
            <p className="lede">A condensed readiness map for the core lesson days from Week 3 Day 1 to Week 6 Day 4. Mini-projects and hackathons excluded.</p>
            <div className="hero-meta">
              <span>{data.meta.topics} topics</span><i />
              <span>{data.meta.days} course days</span><i />
              <span>{overall.total} checks</span>
            </div>
          </div>
          <div className="progress-card" aria-label={`Overall progress ${overall.percent}%`}>
            <div className="progress-ring" style={{ "--progress": `${overall.percent * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{overall.percent}%</strong><span>ready</span></div>
            </div>
            <div>
              <p>Overall progress</p>
              <strong>{overall.done} / {overall.total}</strong>
              <span>skills checked</span>
            </div>
          </div>
        </section>

        <section className="controls" aria-label="Checklist filters">
          <label className="search-field">
            <Search size={18} />
            <span className="sr-only">Search topics</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search concepts, tasks, mistakes…" />
          </label>
          <label>
            <Filter size={16} />
            <span className="sr-only">Filter by week</span>
            <select value={week} onChange={(event) => setWeek(event.target.value)}>
              <option value="all">All weeks</option>
              {[3, 4, 5, 6].map((value) => <option key={value} value={value}>Week {value}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by readiness</span>
            <select value={readiness} onChange={(event) => setReadiness(event.target.value as Readiness | "all")}>
              <option value="all">Any status</option>
              <option value="not-started">Not started</option>
              <option value="in-progress">In progress</option>
              <option value="complete">Complete</option>
            </select>
          </label>
          <button className="icon-button export-progress-button" onClick={exportCurrentProgress}><Download size={17} /> Export current progress</button>
          <button className="icon-button" onClick={reset} title="Reset checks"><RotateCcw size={17} /> Reset</button>
        </section>

        <div className="results-line">
          <p><strong>{filteredTopics.length}</strong> topics shown</p>
          <p>Select topics to print or export as study notes</p>
        </div>

        <section className="topic-grid" aria-label="Readiness topics">
          {filteredTopics.map((topic) => {
            const topicState = topicProgress(topic, progress);
            const status = topicReadiness(topic, progress);
            const isSelected = selected.has(topic.id);
            return (
              <article className={`topic-card ${status}`} key={topic.id}>
                <div className="card-head">
                  <label className="select-topic" title="Select topic for print or export">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleTopic(topic.id)} />
                    <span className="custom-check"><Check size={13} /></span>
                    Select
                  </label>
                  <span className={`status-pill ${status}`}>{status.replace("-", " ")}</span>
                </div>
                <p className="topic-number">{String(topic.number).padStart(2, "0")}</p>
                <p className="eyebrow">{topic.eyebrow}</p>
                <h2>{topic.title}</h2>
                <p className="summary">{topic.summary}</p>
                <div className="mini-progress"><span style={{ width: `${topicState.percent}%` }} /></div>
                <p className="mini-progress-label">{topicState.done} of {topicState.total} understood</p>

                <div className="checklist">
                  {topic.checklist.map((entry) => (
                    <label key={entry.id} className={progress[entry.id] ? "checked" : ""}>
                      <input type="checkbox" checked={Boolean(progress[entry.id])} onChange={() => toggleItem(entry.id)} />
                      <span className="skill-check"><Check size={14} /></span>
                      <span>{entry.text}</span>
                    </label>
                  ))}
                </div>

                <details>
                  <summary>Review details <ChevronDown size={16} /></summary>
                  <div className="details-body">
                    <div>
                      <h3>Example</h3>
                      <pre><code>{topic.example}</code></pre>
                    </div>
                    <div className="detail-list">
                      <h3>Practice</h3>
                      <ul>{topic.practice.map((entry) => <li key={entry}>{entry}</li>)}</ul>
                    </div>
                    <div className="detail-list warning">
                      <h3>Common mistakes</h3>
                      <ul>{topic.mistakes.map((entry) => <li key={entry}>{entry}</li>)}</ul>
                    </div>
                    <div className="sources">
                      <h3>Official sources</h3>
                      {topic.sources.map((day) => (
                        <a key={`${day.week}-${day.day}`} href={day.url} target="_blank" rel="noreferrer">
                          W{day.week} D{day.day} · {day.title} <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </section>

        {!filteredTopics.length && <section className="empty"><h2>No matching topic</h2><p>Try another search or remove a filter.</p></section>}
      </main>

      <aside className={`action-dock ${selectedTopics.length ? "visible" : ""}`} aria-live="polite">
        <div><strong>{selectedTopics.length}</strong><span>selected</span></div>
        <button onClick={() => printSelected(selectedTopics, progress)}><Printer size={17} /> Print</button>
        <button className="primary" onClick={exportMarkdown}><Download size={17} /> Export .md</button>
      </aside>

      <footer>
        <p>Built for focused review. Progress stays in this browser.</p>
        <a href="https://developers.institute/" target="_blank" rel="noreferrer">developers.institute <ExternalLink size={13} /></a>
      </footer>
    </>
  );
}

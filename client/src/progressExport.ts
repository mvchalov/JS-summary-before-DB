import type { Topic } from "../../shared/curriculum";
import { overallProgress, topicProgress, topicReadiness, type ProgressMap, type Readiness } from "./progress";

type ProgressExportOptions = {
  title: string;
  range: string;
  generatedAt?: Date;
};

const statusLabels: Record<Readiness, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete"
};

const escapeTableCell = (value: string) => value.replace(/\|/g, "\\|");

export const formatExportDate = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0")
].join("-");

export const buildProgressMarkdown = (
  topics: Topic[],
  progress: ProgressMap,
  { title, range, generatedAt = new Date() }: ProgressExportOptions
) => {
  const overall = overallProgress(topics, progress);
  const counts = topics.reduce<Record<Readiness, number>>((result, topic) => {
    result[topicReadiness(topic, progress)] += 1;
    return result;
  }, { "not-started": 0, "in-progress": 0, complete: 0 });
  const lines = [
    `# ${title} — Current progress`,
    "",
    `> Exported: ${formatExportDate(generatedAt)}`,
    `> Scope: ${range}`,
    "> Progress source: this browser",
    "",
    "## Summary",
    "",
    `- Overall progress: **${overall.done} of ${overall.total} checks (${overall.percent}%)**`,
    `- Topics complete: **${counts.complete} of ${topics.length}**`,
    `- Topics in progress: **${counts["in-progress"]}**`,
    `- Topics not started: **${counts["not-started"]}**`,
    "",
    "## Topic overview",
    "",
    "| # | Topic | Course day(s) | Status | Progress |",
    "|---:|---|---|---|---:|"
  ];

  topics.forEach((topic) => {
    const current = topicProgress(topic, progress);
    const days = topic.sources.map((source) => `W${source.week} D${source.day}`).join(", ");
    lines.push(`| ${topic.number} | ${escapeTableCell(topic.title)} | ${days} | ${statusLabels[topicReadiness(topic, progress)]} | ${current.done}/${current.total} (${current.percent}%) |`);
  });

  lines.push("", "## Detailed checklist", "");

  topics.forEach((topic) => {
    const current = topicProgress(topic, progress);
    const status = statusLabels[topicReadiness(topic, progress)];
    lines.push(
      `### ${String(topic.number).padStart(2, "0")}. ${topic.title}`,
      "",
      `**Status:** ${status}  `,
      `**Progress:** ${current.done} of ${current.total} checks (${current.percent}%)`,
      "",
      topic.summary,
      "",
      "#### Skills",
      ""
    );
    topic.checklist.forEach((entry) => lines.push(`- [${progress[entry.id] ? "x" : " "}] ${entry.text}`));
    lines.push("", "#### Official sources", "");
    topic.sources.forEach((source) => lines.push(`- [W${source.week} D${source.day} · ${source.title}](${source.url})`));
    lines.push("");
  });

  return `${lines.join("\n").trimEnd()}\n`;
};

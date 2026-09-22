import { describe, expect, it } from "vitest";
import type { Topic } from "../../shared/curriculum";
import { buildProgressMarkdown } from "./progressExport";

const topics = [
  {
    id: "topic-one",
    number: 1,
    eyebrow: "Basics",
    title: "Topic one",
    summary: "First topic summary.",
    example: "const ready = true;",
    practice: [],
    mistakes: [],
    checklist: [
      { id: "one-a", text: "I understand A." },
      { id: "one-b", text: "I understand B." }
    ],
    sources: [{ week: 3, day: 1, title: "Topic one", url: "https://example.com/one" }]
  },
  {
    id: "topic-two",
    number: 2,
    eyebrow: "Next",
    title: "Topic two",
    summary: "Second topic summary.",
    example: "const next = true;",
    practice: [],
    mistakes: [],
    checklist: [{ id: "two-a", text: "I understand C." }],
    sources: [{ week: 3, day: 2, title: "Topic two", url: "https://example.com/two" }]
  }
] as Topic[];

describe("progress Markdown export", () => {
  it("exports a summary, topic overview, and detailed checklist", () => {
    const markdown = buildProgressMarkdown(topics, { "one-a": true }, {
      title: "Full Stack readiness",
      range: "Week 3 Day 1 → Week 6 Day 4",
      generatedAt: new Date(2026, 8, 22)
    });

    expect(markdown).toContain("# Full Stack readiness — Current progress");
    expect(markdown).toContain("> Exported: 2026-09-22");
    expect(markdown).toContain("Overall progress: **1 of 3 checks (33%)**");
    expect(markdown).toContain("| 1 | Topic one | W3 D1 | In progress | 1/2 (50%) |");
    expect(markdown).toContain("### 01. Topic one");
    expect(markdown).toContain("- [x] I understand A.");
    expect(markdown).toContain("- [ ] I understand B.");
    expect(markdown).toContain("[W3 D1 · Topic one](https://example.com/one)");
  });
});

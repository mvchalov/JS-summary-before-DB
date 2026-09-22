import { describe, expect, it } from "vitest";
import type { Topic } from "../../shared/curriculum";
import { overallProgress, topicProgress, topicReadiness } from "./progress";

const topic = {
  checklist: [
    { id: "a", text: "A" },
    { id: "b", text: "B" }
  ]
} as Topic;

describe("progress helpers", () => {
  it("calculates topic progress", () => {
    expect(topicProgress(topic, { a: true })).toEqual({ done: 1, total: 2, percent: 50 });
  });

  it("labels readiness", () => {
    expect(topicReadiness(topic, {})).toBe("not-started");
    expect(topicReadiness(topic, { a: true })).toBe("in-progress");
    expect(topicReadiness(topic, { a: true, b: true })).toBe("complete");
  });

  it("calculates overall progress", () => {
    expect(overallProgress([topic, topic], { a: true })).toEqual({ done: 2, total: 4, percent: 50 });
  });
});

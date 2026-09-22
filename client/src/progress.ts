import type { Topic } from "../../shared/curriculum";

export type ProgressMap = Record<string, boolean>;
export type Readiness = "not-started" | "in-progress" | "complete";

export const topicProgress = (topic: Topic, progress: ProgressMap) => {
  const done = topic.checklist.filter((entry) => progress[entry.id]).length;
  const total = topic.checklist.length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
};

export const topicReadiness = (topic: Topic, progress: ProgressMap): Readiness => {
  const { done, total } = topicProgress(topic, progress);
  if (done === 0) return "not-started";
  if (done === total) return "complete";
  return "in-progress";
};

export const overallProgress = (topics: Topic[], progress: ProgressMap) => {
  const items = topics.flatMap((topic) => topic.checklist);
  const done = items.filter((entry) => progress[entry.id]).length;
  return { done, total: items.length, percent: items.length ? Math.round((done / items.length) * 100) : 0 };
};

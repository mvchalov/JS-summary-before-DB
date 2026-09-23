import request from "supertest";
import { describe, expect, it } from "vitest";
import vercelApp from "../../api/index.js";
import { createApp } from "../src/app.js";

describe("curriculum API", () => {
  it("returns core lesson topics without mini-projects or hackathons", async () => {
    const response = await request(createApp()).get("/api/topics");
    const days = response.body.topics.flatMap((topic: { sources: unknown[] }) => topic.sources);
    const topicIds = response.body.topics.map((topic: { id: string }) => topic.id);

    expect(response.status).toBe(200);
    expect(response.body.meta.topics).toBe(13);
    expect(days).toHaveLength(14);
    expect(topicIds).not.toEqual(expect.arrayContaining([
      "dom-project",
      "browser-project",
      "async-project",
      "hackathon"
    ]));
  });

  it("returns one topic", async () => {
    const response = await request(createApp()).get("/api/topics/js-foundations");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("JavaScript foundations");
  });

  it("returns 404 for an unknown topic", async () => {
    const response = await request(createApp()).get("/api/topics/not-real");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Topic not found");
  });

  it("exports the Express API through the Vercel entrypoint", async () => {
    const response = await request(vercelApp).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

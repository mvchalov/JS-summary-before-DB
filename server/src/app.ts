import cors from "cors";
import express from "express";
import path from "node:path";
import { appCurriculumMeta, appTopics } from "../../shared/curriculum.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/api/topics", (_request, response) => {
    response.json({ meta: appCurriculumMeta, topics: appTopics });
  });

  app.get("/api/topics/:id", (request, response) => {
    const topic = appTopics.find((candidate) => candidate.id === request.params.id);

    if (!topic) {
      response.status(404).json({ error: "Topic not found" });
      return;
    }

    response.json(topic);
  });

  const clientDist = path.resolve(process.cwd(), "../client/dist");
  app.use(express.static(clientDist));
  app.get("/{*path}", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }
    response.sendFile(path.join(clientDist, "index.html"), (error) => {
      if (error) next(error);
    });
  });

  app.use((request, response) => {
    response.status(404).json({ error: `No route for ${request.method} ${request.path}` });
  });

  return app;
};

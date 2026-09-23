import path from "node:path";
import express from "express";
import { createApiRouter } from "./api.js";

export const createApp = () => {
  const app = createApiRouter();

  const siteOutput = path.resolve(process.cwd(), "../public");
  app.use(express.static(siteOutput));
  app.get("/{*path}", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }
    response.sendFile(path.join(siteOutput, "index.html"), (error) => {
      if (error) next(error);
    });
  });

  app.use((request, response) => {
    response.status(404).json({ error: `No route for ${request.method} ${request.path}` });
  });

  return app;
};

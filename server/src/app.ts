import path from "node:path";
import express from "express";
import { createApiRouter } from "./api.js";

export const createApp = () => {
  const app = createApiRouter();

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

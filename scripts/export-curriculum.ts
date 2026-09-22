import { writeFile } from "node:fs/promises";
import { curriculumMeta, topics } from "../shared/curriculum.js";

await writeFile(
  new URL("../tmp/pdfs/curriculum.json", import.meta.url),
  JSON.stringify({ meta: curriculumMeta, topics }, null, 2),
  "utf8"
);

export type SourceDay = {
  week: number;
  day: number;
  title: string;
  url: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
};

export type Topic = {
  id: string;
  number: number;
  title: string;
  eyebrow: string;
  summary: string;
  example: string;
  practice: string[];
  mistakes: string[];
  checklist: ChecklistItem[];
  sources: SourceDay[];
};

const source = (week: number, day: number, title: string, url: string): SourceDay => ({
  week,
  day,
  title,
  url,
});

const item = (topic: string, index: number, text: string): ChecklistItem => ({
  id: `${topic}-${index}`,
  text,
});

export const topics: Topic[] = [
  {
    id: "js-foundations",
    number: 1,
    title: "JavaScript foundations",
    eyebrow: "Values → decisions → repetition",
    summary: "Use JavaScript in a browser. Store values, inspect types, compare safely, choose a path, and repeat work.",
    example: "const score = 82;\nconst passed = score >= 70;\nif (passed) console.log('Ready');",
    practice: [
      "Convert a temperature and print a clear result.",
      "Loop through five scores and count passes.",
      "Predict each comparison before running it."
    ],
    mistakes: [
      "Using == when strict equality === is clearer.",
      "Changing a const value or forgetting let for reassignment.",
      "Creating an infinite loop because the counter never changes."
    ],
    checklist: [
      item("js-foundations", 1, "I can link a JavaScript file to HTML and use the console."),
      item("js-foundations", 2, "I can explain string, number, boolean, null and undefined."),
      item("js-foundations", 3, "I can choose const or let and use clear variable names."),
      item("js-foundations", 4, "I can use strict comparisons and logical operators."),
      item("js-foundations", 5, "I can write if / else and for / while loops.")
    ],
    sources: [source(3, 1, "Introduction to JavaScript", "https://octopus.developers.institute/courses/collection/228/course/845/section/725")]
  },
  {
    id: "functions-dom",
    number: 2,
    title: "Functions and DOM basics",
    eyebrow: "Reusable logic + page updates",
    summary: "Put repeated logic in functions. Read and change the page through DOM nodes, attributes, styles, and created elements.",
    example: "function label(name) { return `Hello ${name}`; }\ndocument.querySelector('h1')!.textContent = label('Ada');",
    practice: [
      "Write a function with parameters and a returned value.",
      "Select an element and change its text, class, and attribute.",
      "Create a list item and append it to a list."
    ],
    mistakes: [
      "Logging a result instead of returning it.",
      "Calling a function before required data exists.",
      "Assuming querySelector always finds an element."
    ],
    checklist: [
      item("functions-dom", 1, "I can define, call, and return from a function."),
      item("functions-dom", 2, "I can explain parameters, arguments, and local scope."),
      item("functions-dom", 3, "I can select one or many DOM elements."),
      item("functions-dom", 4, "I can change text, classes, styles, and attributes."),
      item("functions-dom", 5, "I can create, append, and remove DOM nodes.")
    ],
    sources: [source(3, 2, "Functions & DOM introduction", "https://octopus.developers.institute/courses/collection/228/course/845/section/717")]
  },
  {
    id: "dom-events-forms",
    number: 3,
    title: "DOM events and forms",
    eyebrow: "User action → event → update",
    summary: "React to clicks, input, submit, and keyboard events. Read form data and understand propagation.",
    example: "form.addEventListener('submit', (event) => {\n  event.preventDefault();\n  console.log(new FormData(form));\n});",
    practice: [
      "Build a form that adds a card without reloading.",
      "Use one parent listener for several child buttons.",
      "Start and stop a small timer-driven animation."
    ],
    mistakes: [
      "Calling the handler while registering it.",
      "Forgetting preventDefault on a handled form submit.",
      "Ignoring bubbling and triggering parent behavior by accident."
    ],
    checklist: [
      item("dom-events-forms", 1, "I can register and remove an event listener."),
      item("dom-events-forms", 2, "I can use event.target and event.currentTarget correctly."),
      item("dom-events-forms", 3, "I can read and validate form values."),
      item("dom-events-forms", 4, "I can explain bubbling and use event delegation."),
      item("dom-events-forms", 5, "I can use timers for a controlled UI update.")
    ],
    sources: [source(3, 3, "Learning DOM Events", "https://octopus.developers.institute/courses/collection/228/course/845/section/718")]
  },
  {
    id: "dom-project",
    number: 4,
    title: "DOM mini-project workflow",
    eyebrow: "Plan → build → test → refine",
    summary: "Combine functions, DOM updates, events, and form data in one browser project.",
    example: "state.push(nextItem);\nrender(state); // one render path keeps UI and data aligned",
    practice: [
      "Split the project into data, render, and event functions.",
      "Test empty input, repeated actions, and reset behavior.",
      "Explain the event-to-screen data flow."
    ],
    mistakes: [
      "Mixing all logic inside one event handler.",
      "Updating HTML but not the underlying data.",
      "Testing only the happy path."
    ],
    checklist: [
      item("dom-project", 1, "I can break a UI task into small functions."),
      item("dom-project", 2, "I can keep data and rendered DOM in sync."),
      item("dom-project", 3, "I can handle empty and invalid user input."),
      item("dom-project", 4, "I can debug with DevTools and focused console output."),
      item("dom-project", 5, "I can describe my project without reading the code line by line.")
    ],
    sources: [source(3, 4, "Mini-Project Day", "https://octopus.developers.institute/courses/collection/228/course/845/section/1280")]
  },
  {
    id: "advanced-functions",
    number: 5,
    title: "Advanced functions",
    eyebrow: "Scope, callbacks, closures, composition",
    summary: "Treat functions as values. Pass them, return them, preserve lexical state, and build focused reusable behavior.",
    example: "const multiply = (a: number) => (b: number) => a * b;\nconst double = multiply(2);",
    practice: [
      "Write a callback and pass it to another function.",
      "Create a closure that keeps a private counter.",
      "Convert a multi-argument function to a curried form."
    ],
    mistakes: [
      "Confusing a function reference with a function call.",
      "Expecting var to have block scope.",
      "Using this inside an arrow function as if it were a method."
    ],
    checklist: [
      item("advanced-functions", 1, "I can use function declarations, expressions, and arrow functions."),
      item("advanced-functions", 2, "I can pass a callback and explain when it runs."),
      item("advanced-functions", 3, "I can explain lexical scope and closure."),
      item("advanced-functions", 4, "I can use rest parameters and spread arguments."),
      item("advanced-functions", 5, "I can recognize currying and partial application.")
    ],
    sources: [source(3, 5, "Advanced JavaScript Functions", "https://octopus.developers.institute/courses/collection/228/course/845/section/719")]
  },
  {
    id: "array-methods",
    number: 6,
    title: "Advanced array methods",
    eyebrow: "Transform collections clearly",
    summary: "Choose an array method from the result you need: side effect, transformed array, subset, one item, boolean, or accumulated value.",
    example: "const total = orders\n  .filter(order => order.paid)\n  .reduce((sum, order) => sum + order.total, 0);",
    practice: [
      "Map users to display names.",
      "Filter active records and find one matching ID.",
      "Reduce cart items to a total."
    ],
    mistakes: [
      "Forgetting return inside a block-bodied callback.",
      "Using map when no transformed array is needed.",
      "Mutating the original array unexpectedly."
    ],
    checklist: [
      item("array-methods", 1, "I can choose between forEach, map, filter, and reduce."),
      item("array-methods", 2, "I can use find, some, and every."),
      item("array-methods", 3, "I can write readable callback functions."),
      item("array-methods", 4, "I can avoid accidental mutation with spread and non-mutating methods."),
      item("array-methods", 5, "I can chain methods and explain every intermediate result.")
    ],
    sources: [source(4, 1, "Advanced Array methods", "https://octopus.developers.institute/courses/collection/228/course/846/section/814")]
  },
  {
    id: "objects-classes-dates",
    number: 7,
    title: "Objects, classes, inheritance, and dates",
    eyebrow: "Model structured data and behavior",
    summary: "Read and rebuild objects, use destructuring and shallow copies, model instances with classes, and calculate with Date values.",
    example: "class Dog extends Animal {\n  constructor(name: string) { super(name); }\n  speak() { return `${this.name} barks`; }\n}",
    practice: [
      "Turn Object.entries output back into an object.",
      "Build a parent class and a child class with super.",
      "Calculate days between two Date values."
    ],
    mistakes: [
      "Treating a spread copy as a deep copy.",
      "Using this before super in a child constructor.",
      "Forgetting that getMonth returns 0–11."
    ],
    checklist: [
      item("objects-classes-dates", 1, "I can use Object.keys, values, entries, and fromEntries."),
      item("objects-classes-dates", 2, "I can destructure, rename, default, and shallow-clone properties."),
      item("objects-classes-dates", 3, "I can explain object identity and this."),
      item("objects-classes-dates", 4, "I can create classes, instances, methods, getters, and setters."),
      item("objects-classes-dates", 5, "I can use extends and super correctly."),
      item("objects-classes-dates", 6, "I can read dates and calculate a time difference.")
    ],
    sources: [source(4, 2, "Advanced Object Methods", "https://octopus.developers.institute/courses/collection/228/course/846/section/102")]
  },
  {
    id: "http-forms",
    number: 8,
    title: "HTTP and form methods",
    eyebrow: "Browser request → server response",
    summary: "Understand request structure and choose GET or POST based on intent. Encode, send, inspect, and validate form data.",
    example: "GET /search?q=javascript HTTP/1.1\n\nPOST /signup HTTP/1.1\nContent-Type: application/json",
    practice: [
      "Inspect request method, URL, headers, and response in DevTools.",
      "Build equivalent GET and POST forms.",
      "Explain which data belongs in a URL and which does not."
    ],
    mistakes: [
      "Using GET for a state-changing action.",
      "Assuming hidden form fields are secure.",
      "Forgetting that network requests can fail or return non-2xx status."
    ],
    checklist: [
      item("http-forms", 1, "I can explain request, response, method, URL, headers, body, and status."),
      item("http-forms", 2, "I can choose GET for retrieval and POST for submitted data."),
      item("http-forms", 3, "I can read query parameters and encoded form data."),
      item("http-forms", 4, "I can inspect a request in the browser Network panel."),
      item("http-forms", 5, "I can validate input on the client while still expecting server validation.")
    ],
    sources: [source(4, 3, "HTTP & Form method GET and POST", "https://octopus.developers.institute/courses/collection/228/course/846/section/319")]
  },
  {
    id: "browser-project",
    number: 9,
    title: "Browser mini-project integration",
    eyebrow: "State + DOM + network thinking",
    summary: "Build a small feature by separating data, UI rendering, events, validation, and request boundaries.",
    example: "async function submit(data: FormData) {\n  setBusy(true);\n  try { /* request */ } finally { setBusy(false); }\n}",
    practice: [
      "Draw the user flow before coding.",
      "Add empty, loading, success, and error states.",
      "Test the project after a full page reload."
    ],
    mistakes: [
      "No visible feedback after a user action.",
      "Duplicate event listeners after re-rendering.",
      "Treating a console success message as a complete UI."
    ],
    checklist: [
      item("browser-project", 1, "I can define a small state model before editing the DOM."),
      item("browser-project", 2, "I can keep rendering separate from event wiring."),
      item("browser-project", 3, "I can show clear loading, success, empty, and error states."),
      item("browser-project", 4, "I can test repeated actions and refresh behavior."),
      item("browser-project", 5, "I can remove duplication before submission.")
    ],
    sources: [source(4, 4, "Mini-Project day", "https://octopus.developers.institute/courses/collection/228/course/846/section/103")]
  },
  {
    id: "async-javascript",
    number: 10,
    title: "Asynchronous JavaScript",
    eyebrow: "Schedule work without blocking",
    summary: "Understand the call stack, task queues, timers, callbacks, and Promise states. Control success and failure paths.",
    example: "Promise.resolve('data')\n  .then(value => value.toUpperCase())\n  .catch(error => console.error(error));",
    practice: [
      "Predict timer and Promise output order before running it.",
      "Wrap delayed work in a Promise.",
      "Chain a transformation and one shared catch."
    ],
    mistakes: [
      "Expecting a timer delay to be an exact execution time.",
      "Forgetting to return a Promise from a then callback.",
      "Leaving a rejected Promise unhandled."
    ],
    checklist: [
      item("async-javascript", 1, "I can explain synchronous code, the call stack, and queued work."),
      item("async-javascript", 2, "I can use setTimeout and setInterval safely."),
      item("async-javascript", 3, "I can explain pending, fulfilled, and rejected Promises."),
      item("async-javascript", 4, "I can chain then, catch, and finally."),
      item("async-javascript", 5, "I can predict basic event-loop output order.")
    ],
    sources: [source(4, 5, "Asynchronous JavaScript", "https://octopus.developers.institute/courses/collection/228/course/846/section/720")]
  },
  {
    id: "fetch-async-await",
    number: 11,
    title: "Fetch and async / await",
    eyebrow: "Request → validate → parse → use",
    summary: "Fetch remote data with explicit status checks. Await each asynchronous step and handle failures near the user-facing boundary.",
    example: "const response = await fetch('/api/items');\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst items = await response.json();",
    practice: [
      "Fetch JSON and render a small list.",
      "Handle a non-2xx response and invalid data.",
      "Run independent requests with Promise.all."
    ],
    mistakes: [
      "Assuming fetch rejects for every HTTP error status.",
      "Forgetting await before response.json().",
      "Running independent requests sequentially without a reason."
    ],
    checklist: [
      item("fetch-async-await", 1, "I can send a fetch request and inspect its response."),
      item("fetch-async-await", 2, "I can check response.ok before parsing JSON."),
      item("fetch-async-await", 3, "I can write and call an async function."),
      item("fetch-async-await", 4, "I can use try / catch / finally for UI-safe errors."),
      item("fetch-async-await", 5, "I can use Promise.all for independent work.")
    ],
    sources: [source(5, 1, "Fetch & Async/Await", "https://octopus.developers.institute/courses/collection/228/course/847/section/721")]
  },
  {
    id: "async-project",
    number: 12,
    title: "Async mini-project workflow",
    eyebrow: "Reliable remote-data UI",
    summary: "Turn an API task into a predictable interface with explicit states, cancellation awareness, and recoverable errors.",
    example: "type ViewState<T> =\n  | { kind: 'loading' }\n  | { kind: 'ready'; data: T }\n  | { kind: 'error'; message: string };",
    practice: [
      "Build search with loading and no-results feedback.",
      "Disable duplicate submission while a request runs.",
      "Retry after a simulated failure."
    ],
    mistakes: [
      "Rendering stale results from an older request.",
      "Leaving controls active during duplicate submission.",
      "Showing raw technical errors to the user."
    ],
    checklist: [
      item("async-project", 1, "I can model idle, loading, ready, empty, and error states."),
      item("async-project", 2, "I can prevent duplicate requests."),
      item("async-project", 3, "I can render API data without unsafe HTML injection."),
      item("async-project", 4, "I can recover from failure without reloading the page."),
      item("async-project", 5, "I can trace one request from event to rendered result.")
    ],
    sources: [source(5, 2, "Mini-Project Day - Asynchronous JavaScript", "https://octopus.developers.institute/courses/collection/228/course/847/section/1223")]
  },
  {
    id: "typescript-foundations",
    number: 13,
    title: "TypeScript foundations",
    eyebrow: "Make expected shapes explicit",
    summary: "Use static types to describe values, function contracts, object shapes, and safe alternatives before runtime.",
    example: "type User = { id: number; name: string; active?: boolean };\nconst label = (user: User): string => user.name;",
    practice: [
      "Type variables, arrays, object parameters, and return values.",
      "Replace any with unknown and narrow it safely.",
      "Create a union for a small UI state."
    ],
    mistakes: [
      "Adding types everywhere when inference is already clear.",
      "Using any to silence a useful error.",
      "Confusing compile-time types with runtime validation."
    ],
    checklist: [
      item("typescript-foundations", 1, "I can explain inference and add an annotation when useful."),
      item("typescript-foundations", 2, "I can type arrays, tuples, objects, and functions."),
      item("typescript-foundations", 3, "I can use unions, literals, aliases, and interfaces."),
      item("typescript-foundations", 4, "I can use optional and readonly properties."),
      item("typescript-foundations", 5, "I can choose unknown over any and narrow before use.")
    ],
    sources: [source(5, 3, "Introduction To TypeScript And Key Concepts", "https://octopus.developers.institute/courses/collection/228/course/847/section/1224")]
  },
  {
    id: "advanced-typescript",
    number: 14,
    title: "Advanced TypeScript",
    eyebrow: "Narrow, reuse, and compose types",
    summary: "Use generics, guards, utility types, classes, and typed modules to keep larger code precise without duplicating shapes.",
    example: "function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconst isError = (value: unknown): value is Error => value instanceof Error;",
    practice: [
      "Write a generic function and a generic API response type.",
      "Narrow a discriminated union with a switch.",
      "Use Pick or Omit to derive a form type."
    ],
    mistakes: [
      "Using a type assertion instead of proving the type.",
      "Making a generic that adds no relationship between values.",
      "Forgetting exhaustive handling when a union grows."
    ],
    checklist: [
      item("advanced-typescript", 1, "I can narrow with typeof, in, instanceof, and custom guards."),
      item("advanced-typescript", 2, "I can use a discriminated union and exhaustive switch."),
      item("advanced-typescript", 3, "I can write a useful generic function or interface."),
      item("advanced-typescript", 4, "I can use Partial, Pick, Omit, Record, and Readonly."),
      item("advanced-typescript", 5, "I can type a class, DOM element, module, and API result."),
      item("advanced-typescript", 6, "I can read a compiler error and fix the data contract.")
    ],
    sources: [
      source(5, 4, "Advanced TypeScript Concepts and Applications", "https://octopus.developers.institute/courses/collection/228/course/847/section/1225"),
      source(5, 5, "Advanced TypeScript Concepts and Applications", "https://octopus.developers.institute/courses/collection/228/course/847/section/1226")
    ]
  },
  {
    id: "hackathon",
    number: 15,
    title: "Hackathon integration",
    eyebrow: "Scope small. Ship a working flow.",
    summary: "Use the JavaScript, DOM, async, and TypeScript toolkit under a time limit. Prioritize one complete user flow over many unfinished features.",
    example: "Must have: input → validation → result\nNice to have: polish, extra filters, animation",
    practice: [
      "Write a must-have list before coding.",
      "Build a vertical slice that works end to end.",
      "Prepare a two-minute demo and one technical explanation."
    ],
    mistakes: [
      "Starting with styling before the main flow works.",
      "Adding dependencies without checking the cost.",
      "Merging large changes without testing the shared branch."
    ],
    checklist: [
      item("hackathon", 1, "I can reduce an idea to one testable user flow."),
      item("hackathon", 2, "I can split work into small owned tasks."),
      item("hackathon", 3, "I can use Git commits and merge without losing working code."),
      item("hackathon", 4, "I can handle loading, empty, invalid, and failure paths."),
      item("hackathon", 5, "I can demo the result and explain one important decision.")
    ],
    sources: [
      source(6, 1, "Hackathon #1", "https://octopus.developers.institute/courses/collection/228/course/997/section/1583"),
      source(6, 2, "Hackathon #1", "https://octopus.developers.institute/courses/collection/228/course/997/section/1583")
    ]
  },
  {
    id: "node-fundamentals",
    number: 16,
    title: "Node.js fundamentals",
    eyebrow: "JavaScript outside the browser",
    summary: "Run JavaScript in Node, use modules and npm, read environment values, and work with files and JSON asynchronously.",
    example: "import { readFile } from 'node:fs/promises';\nconst text = await readFile('data.json', 'utf8');\nconst data = JSON.parse(text);",
    practice: [
      "Create an npm project with a start script.",
      "Export and import one function.",
      "Read a JSON file and handle a missing-file error."
    ],
    mistakes: [
      "Using browser globals such as document in Node.",
      "Mixing CommonJS and ES module syntax without configuration.",
      "Blocking the event loop with synchronous file work in a server path."
    ],
    checklist: [
      item("node-fundamentals", 1, "I can explain how Node differs from browser JavaScript."),
      item("node-fundamentals", 2, "I can create package.json and use npm scripts."),
      item("node-fundamentals", 3, "I can import and export ES modules."),
      item("node-fundamentals", 4, "I can use process arguments and environment variables."),
      item("node-fundamentals", 5, "I can read, write, parse, and stringify JSON safely.")
    ],
    sources: [source(6, 3, "Node.js Introduction", "https://octopus.developers.institute/courses/collection/228/course/997/section/840")]
  },
  {
    id: "web-server-express",
    number: 17,
    title: "Web servers and Express",
    eyebrow: "Route a request. Return a response.",
    summary: "Create a Node web server, define Express middleware and routes, validate input, return JSON, and handle missing routes and errors.",
    example: "app.get('/api/items/:id', (req, res) => {\n  res.json({ id: req.params.id });\n});",
    practice: [
      "Create GET and POST JSON routes.",
      "Read params, query values, and a JSON body.",
      "Return 404 and centralized error responses."
    ],
    mistakes: [
      "Sending more than one response for one request.",
      "Forgetting express.json before reading req.body.",
      "Trusting request data without validation."
    ],
    checklist: [
      item("web-server-express", 1, "I can explain request, middleware, route handler, and response order."),
      item("web-server-express", 2, "I can start an Express server on a configured port."),
      item("web-server-express", 3, "I can build GET and POST routes that return JSON."),
      item("web-server-express", 4, "I can read route params, query values, and request bodies."),
      item("web-server-express", 5, "I can choose a useful status code."),
      item("web-server-express", 6, "I can add 404 and error-handling middleware.")
    ],
    sources: [source(6, 4, "Node.js Web Server", "https://octopus.developers.institute/courses/collection/228/course/997/section/842")]
  }
];

export const curriculumMeta = {
  title: "Full Stack readiness",
  range: "Week 3 Day 1 → Week 6 Day 4",
  topics: topics.length,
  days: 19,
  brandSource: "https://developers.institute/",
  curriculumSource: "Developers Institute Octopus"
};

const appExcludedTopicIds = new Set([
  "dom-project",
  "browser-project",
  "async-project",
  "hackathon"
]);

export const appTopics = topics.filter((topic) => !appExcludedTopicIds.has(topic.id));

export const appCurriculumMeta = {
  ...curriculumMeta,
  topics: appTopics.length,
  days: appTopics.reduce((total, topic) => total + topic.sources.length, 0)
};

import { createCookie, createFileSessionStorage } from "@remix-run/node";

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: "none",
  httpOnly: true,
});

const { getSession, commitSession, destroySession } = createFileSessionStorage({
  // The root directory where you want to store the files.
  // Make sure it's writable!
  dir: "./__sessionData",
  cookie: sessionCookie,
});

export { getSession, commitSession, destroySession };

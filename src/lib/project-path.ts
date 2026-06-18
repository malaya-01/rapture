import { join } from "path";

/** Resolve paths under the project root without Turbopack tracing the whole repo. */
export function projectPath(...segments: string[]) {
  return join(/*turbopackIgnore: true*/ process.cwd(), ...segments);
}

export function projectRoot() {
  return /*turbopackIgnore: true*/ process.cwd();
}

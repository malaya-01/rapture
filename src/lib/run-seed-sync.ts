import { spawnSync, type SpawnSyncReturns } from "child_process";
import { projectPath, projectRoot } from "@/lib/project-path";

export function runSeedSync(): SpawnSyncReturns<string> {
  return spawnSync(
    "node",
    [projectPath("seed", "scripts", "sync-app-data.mjs")],
    {
      cwd: projectRoot(),
      encoding: "utf8",
      timeout: 120_000,
    }
  );
}

import pkg from "../../package.json";

export const APP_VERSION = `v${pkg.version}`;

export function getFullVersion(): string {
  const commitSha =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "";
  const shortSha = commitSha ? commitSha.slice(0, 7) : "dev";
  return `VroomDealer ${APP_VERSION} (${shortSha})`;
}

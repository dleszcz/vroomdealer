<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Build Check Before Push
ALWAYS run `npm run build` locally and ensure it passes successfully BEFORE executing `git push`. Never push code to the repository without confirming that the build is green.

# QA & Testing
ALWAYS thoroughly verify changes and manually test the UI before declaring a task as 'done' or pushing to the repo. Never show the user an unfinished product with dummy text or styling errors.

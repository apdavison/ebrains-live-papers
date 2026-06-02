# Contributing to EBRAINS Live Papers

This document describes the development workflow, coding standards, and contribution conditions for this project.

## Contribution conditions

This project is licensed under the [Apache Licence 2.0](LICENSE). By submitting a merge request or patch you agree that your contribution will be licensed under the same terms. No contributor licence agreement (CLA) or copyright assignment is required.

## Code of conduct

All contributors are expected to follow the project's [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Versioning scheme

Releases use **date-based versioning**: the release date formatted as `YYYY-MM-DD`.
There are no major/minor/patch numbers. A new tag is created whenever a meaningful set of changes is ready for production.

---

## Branch workflow

| Branch | Purpose |
|---|---|
| `main` | Production — reflects the current production deployment |
| `staging` | Integration — changes are assembled and tested here before release |

**Workflow for contributors:**

1. Branch off `staging` for your work.
2. Open a merge request targeting `staging`.
3. CI will build and run tests on the MR.
4. Once reviewed and passing, merge to `staging`.
5. When `staging` is ready for a production release, it is merged to `main` and a date-based tag is created.

Direct pushes to `main` are reserved for release merges from `staging`.

---

## Development setup

See the [README](README.md) for prerequisites, per-app dependency installation, environment variables, and how to run the apps locally.

---

## Running tests

Tests for `live-paper-builder` live in `apps/live-paper-builder/__tests__/` and use [vitest](https://vitest.dev/) with jsdom and `@testing-library/react`.

```bash
cd apps/live-paper-builder
npm run test          # watch mode
npm run coverage      # single run with v8 coverage
```

When adding features to the builder, add corresponding tests. Tests for utility functions go in `utils.test.js`; component tests follow the pattern in `home.test.jsx`.

---

## Coding conventions

- Follow the ESLint configuration in each app's `eslint.config.js` (or the `eslintConfig` key in `package.json`).
- Run `npm run lint` before pushing. The lint step uses `--max-warnings 0` — no warnings are allowed.
- Use functional React components and hooks; avoid class components in new code.
- Keep components focused. Extract reusable logic into utility functions in `utils.js`.

---

## Code documentation standard

- **Exported functions and hooks**: add a [JSDoc](https://jsdoc.app/) block describing parameters, return value, and any non-obvious behaviour.
- **Inline comments**: use sparingly. Comment the *why*, not the *what*. A comment explaining a non-obvious constraint or a workaround for a known bug is useful; a comment restating what the code does is not.
- Do not write multi-paragraph docstrings or block comments explaining implementation steps.

---

## CI/CD pipeline

The pipeline is defined in `.gitlab-ci.yml` at the repository root and has two stages:

| Stage | Jobs | Trigger |
|---|---|---|
| `build` | `build_production` | push to `main` — builds and pushes `:prod` Docker image |
| `build` | `build_staging` | push to `staging` — builds and pushes `:staging` Docker image |
| `build` | `build_merge_request` | MR targeting `staging` — build check only, no push |
| `test` | `run_tests` | every pipeline — runs `live-paper-builder` test suite |

The `run_tests` job runs on a Docker runner using `docker-registry.ebrains.eu/live-papers/node:22-alpine`. The build jobs require a shell runner with Docker available and the `DOCKER_REGISTRY_USER` / `DOCKER_REGISTRY_SECRET` CI variables set.

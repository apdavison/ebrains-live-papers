# Changelog

All notable changes to the EBRAINS Live Papers app are documented here. Releases use date-based version tags (`YYYY-MM-DD`).

---

## [2026-05-20]

- Added NGL loading indicator for molecular dynamics simulations
- Fixed NGL `loadFile` wrapper race condition against late script loads
- Replaced NAR API with direct EBRAINS Knowledge Graph queries
- Published `ebrains-kg-query` as a standalone npm package and adopted it in the builder
- Added local JSON cache to platform to reduce API calls during development
- Added local CORS proxy in Vite dev server for development without a running proxy service
- Fixed ModelDB links
- Added type-ahead (autocomplete) select for brain region filters

## [2025-10-07]

- Migrated `live-paper-platform` and `live-paper-docs` from Create React App to Vite
- Added CI test stage to GitLab pipeline (`vitest`, `node:22-alpine` runner)
- Added MR build job to CI pipeline (build check without push)
- Added `codemeta.json`
- Updated `object.cscs.ch` URLs following migration to the Data Proxy service
- Assorted fixes following the Vite/MUI v6 migration

## [2025-05-19]

- Upgraded to MUI v6 and React 18
- Removed jQuery and Materialize CSS from the platform `index.html`
- Added vitest test framework and initial unit tests to `live-paper-builder`
- Added ESLint configuration to `live-paper-builder`
- Replaced date picker with a simple text field
- Various builder UI fixes (button standardisation, morphology database fixes)

## [2025-02-25]

- Migrated `live-paper-builder` from Create React App to Vite
- Updated deployment to Kubernetes (SSL no longer handled within the container)
- Separated the Live Papers API from the Model Validation API in the builder

## [2023-01-30]

- Initial tagged release of the EBRAINS Live Papers platform, builder, and documentation apps

# EBRAINS Live Papers app

EBRAINS Live Papers are structured, interactive online documents that complement published scientific articles by presenting the underlying data, code, model files, and interactive visualisations within a narrative structure. Readers can download or directly run the associated resources, view embedded interactive plots, or launch neuronal simulations without leaving the browser.

The web app consists of three Vite/React applications:

| App | Purpose | Path |
|---|---|---|
| **live-paper-platform** | Viewer — browse and read published live papers | `/` |
| **live-paper-builder** | Authoring tool — create and edit live papers (requires EBRAINS account) | `/builder/` |
| **live-paper-docs** | User documentation and tutorials | `/docs/` |

All three apps are built into a single Docker image served by nginx.

#### Production server

| | |
|---|---|
| Platform | https://live-papers.apps.ebrains.eu/ |
| Builder  | https://live-papers.apps.ebrains.eu/builder/ |
| Docs     | https://live-papers.apps.ebrains.eu/docs/ |

#### Staging server

| | |
|---|---|
| Platform | https://live-papers-dev.apps.ebrains.eu/ |
| Builder  | https://live-papers-dev.apps.ebrains.eu/builder/ |
| Docs     | https://live-papers-dev.apps.ebrains.eu/docs/ |

---

## Architecture

The three apps interact with:

- **Live Papers REST API** (`https://live-papers-api.apps.ebrains.eu/`) — stores and retrieves live paper content
- **EBRAINS Knowledge Graph** — queried for neuroscience data (models, traces, morphologies)
- **EBRAINS IAM** (Keycloak) — handles authentication for the builder; the platform and docs are publicly accessible without login
- **External databases** — ModelDB, NeuroMorpho, BioModels, Allen Brain Atlas (accessed via a CORS proxy)

In production, all three apps are served by a single nginx container. nginx routes requests to the appropriate app by path prefix (see `apps/deployment/nginx-app.conf`). A JSON cache (`/mnt/json_cache`) and example resources directory (`/mnt/example_res`) are mounted into the container.

Authentication and all identity data are handled by EBRAINS IAM. This app does not store user PII directly.

---

## Developer setup

### Prerequisites

- Node.js v22 or later (earlier versions cause `ERR_OSSL_EVP_UNSUPPORTED` build errors)
- npm

### Install dependencies

Each app has its own `package.json`. Install dependencies separately:

```bash
cd apps/live-paper-platform && npm install
cd apps/live-paper-builder  && npm install
cd apps/live-paper-docs     && npm install
```

### Environment variables

**live-paper-builder** — create `apps/live-paper-builder/.env.local`:

```
VITE_DEV_TOKEN=Bearer <your-ebrains-iam-access-token>
```

Obtain a token by logging in at https://iam.ebrains.eu. Without this token the builder will start but authenticated API calls will fail.

**live-paper-platform** — by default the platform uses a local JSON cache to avoid hitting the API on every page load during development. To disable it:

```
VITE_LOCAL_CACHE=false
```

### Running the apps locally

Each app is a Vite dev server. Run them independently:

```bash
# Viewer (http://localhost:5173/)
cd apps/live-paper-platform && npm run dev

# Builder (http://localhost:5173/builder/)
cd apps/live-paper-builder && npm run dev

# Docs (http://localhost:5173/docs/)
cd apps/live-paper-docs && npm run dev
```

### Running tests

Tests exist for `live-paper-builder` only:

```bash
cd apps/live-paper-builder
npm run test          # watch mode
npm run coverage      # single run with coverage report
```

### Linting

```bash
npm run lint          # from within any app directory
```

---

## Building and deployment

### Docker build

Production and staging images are built by the CI pipeline on push to `main` or `staging` respectively. To build locally:

```bash
cd apps
sh deployment/write_build_info.sh          # generates live-paper-builder/src/buildInfo.js
docker build -f deployment/Dockerfile.prod -t live-papers-apps .
```

### CI/CD pipeline

See `.gitlab-ci.yml` and the [Contributing guide](CONTRIBUTING.md) for the branch and release workflow.

### Running the production image locally

```bash
docker run -p 80:80 live-papers-apps
```

The full `docker-compose.yml` (in `apps/deployment/`) mounts the cache and resource volumes required in production:

```bash
cd apps/deployment
docker compose up
```

### Required volumes and secrets

| Volume | Purpose |
|---|---|
| `/mnt/json_cache` | JSON response cache for KG/API queries |
| `/mnt/example_res` | Static example resource files |

CI secrets required as GitLab CI/CD variables: `DOCKER_REGISTRY_USER`, `DOCKER_REGISTRY_SECRET`.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, coding conventions, and contribution conditions.

---

## Licence

[Apache Licence 2.0](LICENSE)

---

## Acknowledgements

<img src="https://raw.githubusercontent.com/appukuttan-shailesh/ebrains-live-papers/master/eu_logo.jpg" alt="EU Logo" width="15%" align="right">

This open source software code was developed in part or in whole in the Human Brain Project, funded from the European Union's Horizon 2020 Framework Programme for Research and Innovation under Specific Grant Agreements No. 785907 and No. 945539 (Human Brain Project SGA2 and SGA3).

# CodeMetrics - Developer Performance Analyzer

A full-stack, enterprise-grade developer evaluation platform designed to analyze, benchmark, and catalog public engineering profiles from the GitHub ecosystem. Built with a high-performance decoupled architecture, the platform couples a Node.js/Express REST API core with persistent MySQL storage and a minimalist, high-speed React dashboard.

The system automates profile aggregation, applies a custom multi-factor evaluation algorithm to assess developer impact, supports side-by-side comparative metrics via an interactive Versus Mode, and implements self-provisioning database models.

---

## Key Features

* **High-Concurrency Data Aggregation**: Queries profile records and deep repository metrics from the public GitHub REST API in parallel. Features automated fallbacks for empty or dormant repositories, API rate-limit protection, and client-side skeleton state loading.
* **Weighted Evaluation Algorithm**: Evaluates overall developer impact by weighing qualitative social reach against quantitative repository outputs using a standardized score formula:
  $$\text{Score} = \text{Followers} + (\text{Public Repos} \times 5) + (\text{Total Stars} \times 2) + \text{Total Forks}$$
* **Tier-Based Classification**: Maps developer performance to standardized professional expertise brackets:
  * **Grandmaster**: $1000+$ points
  * **Elite Developer**: $400 - 999$ points
  * **Senior Expert**: $150 - 399$ points
  * **Professional**: $50 - 149$ points
  * **Rising Star**: $0 - 49$ points
* **Interactive Versus Mode**: Enables side-by-side comparative analyses of multiple developers loaded from local storage, dynamically identifying metric leaders and declaring an overall match winner.
* **Self-Provisioning Storage**: Automatically bootstraps the requisite MySQL databases and structural schemas during backend initialization, eliminating the need for manual migrations.
* **Enterprise Security & Performance**: Hardened with Helmet HTTP header injection, Express rate limiting, Gzip compression, parameter validation to prevent SQL injection, and optimized GPU transitions for lag-free performance.

---

## Platform Architecture

The system utilizes a decoupled MVC (Model-View-Controller) structure optimized for high throughput and rapid load times:

```
[GitHub API] <---(HTTPS)--- [Express Controller] <---> [MySQL Storage]
                                   |
                                 (REST)
                                   |
                             [React SPA]
```

### Backend (`/backend`)
* **Framework**: Express.js with a modular MVC directory design.
* **Database Interface**: `mysql2/promise` utilizing managed connection pools.
* **API Documentation**: Automated Swagger OpenAPI 3.0 specs served directly at `/api-docs`.
* **Middlewares**: Helmet (security), compression (gzip), morgan (development logging), express-rate-limit (DDOS defense).

### Frontend (`/frontend`)
* **Framework**: React 18 powered by Vite.
* **Styling**: Structured custom CSS design system optimized for GPU-accelerated transitions and responsive displays.
* **State & Icons**: React hooks and Lucide UI icons.

---

## Database Design

The application utilizes a single persistent schema (`github_profiles`) containing the following properties:

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `INT (PK)` | Auto-incrementing identifier |
| `username` | `VARCHAR(100)` | Unique GitHub username |
| `name` | `VARCHAR(150)` | Display name of the user |
| `bio` | `TEXT` | Public developer biography |
| `location` | `VARCHAR(100)` | Profile geographical location |
| `followers` | `INT` | Total followers count |
| `following` | `INT` | Total following count |
| `public_repos` | `INT` | Public repositories count |
| `public_gists` | `INT` | Public gists count |
| `total_stars` | `INT` | Sum of stars across all owned repositories |
| `total_forks` | `INT` | Sum of forks across all owned repositories |
| `most_starred_repo` | `VARCHAR(255)` | Name of the primary repository |
| `most_starred_repo_stars` | `INT` | Star count of the primary repository |
| `developer_score` | `INT` | Evaluated multi-metric ranking |
| `profile_url` | `VARCHAR(255)` | Original GitHub HTML profile link |
| `avatar_url` | `VARCHAR(255)` | Linked user avatar image |
| `created_at` | `TIMESTAMP` | Record initialization timestamp |
| `updated_at` | `TIMESTAMP` | Record last-updated timestamp |

---

## Configuration & Environment

Configuration is managed via environment variables in a `.env` file within the `backend/` directory:

```env
PORT=5000
NODE_ENV=production

# Database Credentials
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=github_profile_analyzer

# Optional: GitHub Authentication (Highly recommended to increase API rate limit to 5000 req/hour)
GITHUB_TOKEN=your_personal_access_token
```

---

## Local Development & Installation

### Prerequisite Setup
* Ensure Node.js (v18+) is installed.
* Ensure a local MySQL service is active and listening on port `3306`.

### 1. Launch Backend API Server
```bash
cd backend
npm install
npm run dev
```
* **API Entrypoint**: [http://localhost:5000](http://localhost:5000)
* **Swagger OpenAPI Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### 2. Launch Frontend Application
```bash
cd frontend
npm install
npm run dev
```
* **Development Client**: [http://localhost:5173](http://localhost:5173)
* *Vite is pre-configured to proxy all `/api` routes directly to the backend to bypass CORS constraints.*

---

## API Specifications

Detailed schema payload structures are automatically served on `/api-docs`. Below is a summary of the core REST service contracts:

### Post Profile for Analysis
* **Endpoint**: `POST /api/analyze/:username`
* **Response Status**: `201 Created`
* **Payload Structure**:
  ```json
  {
    "success": true,
    "message": "Profile analyzed and saved successfully.",
    "data": {
      "username": "torvalds",
      "name": "Linus Torvalds",
      "followers": 204900,
      "public_repos": 7,
      "total_stars": 230,
      "total_forks": 150000,
      "developer_score": 355395
    }
  }
  ```

### Fetch Paginated Stored Profiles
* **Endpoint**: `GET /api/profiles`
* **Query Parameters**:
  * `page` (Default: `1`)
  * `limit` (Default: `10`)
  * `sortBy` (`developer_score`, `total_stars`, `created_at`, `username`)
  * `order` (`ASC` or `DESC`)
  * `search` (Filters against `username`, `name`, or `location`)
* **Response Status**: `200 OK`
* **Payload Structure**:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "totalCount": 12,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 10
    }
  }
  ```

### Purge Profile
* **Endpoint**: `DELETE /api/profiles/:username`
* **Response Status**: `200 OK`

---

## Integration Testing

An automated Postman Collection (`github_profile_analyzer.postman_collection.json`) is packaged at the root level of this repository. Import this collection into Postman to execute structured unit testing against all active REST routes.

---

## Production Deployment Strategies

### Option A: Fully Managed Deployment (Railway)
1. Provision a new **MySQL Database** on the Railway dashboard.
2. Link the repository to Railway.
3. Configure the `backend` service folder to run automatically on push. Map environmental database keys to the provisioned database container variables (`${{MySQL.MYSQLHOST}}`, etc.).
4. Deploy the static `frontend` folder or serve the static web files directly from the Express app.

### Option B: Monolithic Linux VPS (DigitalOcean / AWS / Linode)
For standard corporate deployments utilizing a Linux virtual private server:

1. **Serve React Static Files via Express**:
   Add static delivery routing at the end of the Express middleware stack in `backend/app.js`:
   ```javascript
   const path = require('path');
   app.use(express.static(path.join(__dirname, '../frontend/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
   ```
2. **Setup Server System Environment**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm mysql-server nginx -y
   ```
3. **Execute Backend Background Service**:
   Use PM2 to run the Express backend:
   ```bash
   sudo npm install pm2 -g
   cd backend && npm install
   pm2 start server.js --name "github-analyzer-api"
   ```
4. **Nginx Reverse Proxy**:
   Configure Nginx at `/etc/nginx/sites-available/default` to forward standard HTTP traffic to port `5000`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
   Run `sudo systemctl restart nginx` to deploy changes.

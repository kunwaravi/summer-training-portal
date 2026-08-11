# 🚀 EduNexus Pro — Deployment Runbook

**Generated:** 2026-05-30 · **Target:** `edunexus.kibm.in` · **Server:** Hostinger VPS `187.127.156.138`

> ⚠️ **CONFIDENTIAL — DO NOT SHARE PUBLICLY.**
> Yeh file me **SSH private key** aur **Hostinger API token** dono hain. Iska matlab — jisko bhi yeh file mile, woh:
> - Server pe root SSH le sakta hai
> - Hostinger account ke saare VPS / domains / billing access kar sakta hai
>
> Share karne ke baad: token + PEM **rotate karwa do** as soon as deployment done.

---

## 📋 Table of Contents

1. [Inventory snapshot](#1-inventory-snapshot)
2. [Current VPS state (important!)](#2-current-vps-state-important)
3. [Set up SSH access on your Mac](#3-set-up-ssh-access-on-your-mac)
4. [Set up Hostinger MCP in Claude Code](#4-set-up-hostinger-mcp-in-claude-code)
5. [Add DNS A record for edunexus.kibm.in](#5-add-dns-a-record-for-edunexuskibmin)
6. [Fix the seed.ts bug (crash root cause)](#6-fix-the-seedts-bug-crash-root-cause)
7. [Configure backend env file](#7-configure-backend-env-file)
8. [Rewrite docker-compose for co-tenancy](#8-rewrite-docker-compose-for-co-tenancy)
9. [Bring up the stack](#9-bring-up-the-stack)
10. [Nginx site + Let's Encrypt SSL](#10-nginx-site--lets-encrypt-ssl)
11. [Smoke test](#11-smoke-test)
12. [Troubleshooting & rollback](#12-troubleshooting--rollback)
13. [Co-tenancy promises (don't break KIBM)](#13-co-tenancy-promises-dont-break-kibm)
14. [Post-deploy hardening (next sprint)](#14-post-deploy-hardening-next-sprint)

---

## 1. Inventory snapshot

| Resource | Value |
|---|---|
| **Hosting provider** | Hostinger VPS |
| **VM ID** | `1616850` (`srv1616850.hstgr.cloud`) |
| **Public IPv4** | `187.127.156.138` |
| **Public IPv6** | `2a02:4780:63:e033::1` |
| **Plan / OS** | KVM 2 — 2 vCPU, 8 GB RAM, 100 GB disk, Ubuntu 24.04 LTS |
| **SSH user** | `root` |
| **Domain (existing)** | `kibm.in` (active, expires 2027-04-24) |
| **Target subdomain** | `edunexus.kibm.in` (new, to be created) |
| **Repo** | `git@github.com:kunwaravi/edunexuspro.git` |
| **Deploy path on VPS** | `/docker/edunexuspro/` (already exists, partial) |
| **Co-tenants on VPS** | KIBM (`kibm.in`, `marketplace.kibm.in`, `dashboard.kibm.in`), Nexus Marketplace (`nexus.kibm.in`), Atlas, Openclaw |

---

## 2. Current VPS state (important!)

Yeh server **already 4 cheezein chala raha hai**. Hum pichli deployment ko fix karke complete kar rahe hain, fresh nahi.

**Already running:**
```
edunexuspro-frontend-1   Up (healthy)   0.0.0.0:8080->80/tcp   ← exposes port 8080 PUBLIC
edunexuspro-db-1         Up (healthy)   5432/tcp               ← Postgres, internal only
edunexuspro-backend-1    Exited (1)     ← CRASHED 17 min ago
atlas_postgres              Up 3 days      127.0.0.1:5432->5432/tcp
```

**Backend crash root cause** (from `docker logs edunexuspro-backend-1`):
```
prisma/seed.ts(89,19): error TS2322:
  Type 'string[]' is not assignable to type 'string'.
```
Schema me `QuizQuestion.options` is `String` but seed.ts woh as `string[]` pass kar raha hai. Fix in §6.

**Other services running on this VPS** (don't touch):
- nginx on `:80, :443` serving `kibm.in`, `marketplace.kibm.in`, `dashboard.kibm.in`, `nexus.kibm.in`
- atlas (port 4243, 4244, 4245), openclaw (18789, 18791), nexus-api (3005), redis (6379)

**Ports we MUST NOT take:** `80, 443, 4243-4245, 3005, 3032, 6379, 8080 (already by frontend), 18789, 18791`

**Ports we WILL take** (loopback-only, fronted by nginx):
- Backend → `127.0.0.1:5050` (changed from public 5000)
- Frontend → `127.0.0.1:8090` (changed from public 8080)

---

## 3. Set up SSH access on your Mac

### 3.1 Save the PEM

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/hostinger_edunexus.pem
# paste the block below (including BEGIN/END lines)
chmod 600 ~/.ssh/hostinger_edunexus.pem
```

**PEM content** (OpenSSH format):

```
# [REDACTED: PRIVATE KEY REMOVED FOR SECURITY]
```

### 3.2 Verify SSH works

```bash
ssh -i ~/.ssh/hostinger_edunexus.pem root@187.127.156.138 "hostnamectl"
```
Expected: prints `srv1616850` hostname info.

### 3.3 Add to SSH config (optional, recommended)

```bash
cat >> ~/.ssh/config <<'EOF'

Host edunexus
  HostName 187.127.156.138
  User root
  IdentityFile ~/.ssh/hostinger_edunexus.pem
  ServerAliveInterval 60
EOF
chmod 600 ~/.ssh/config
```
Ab `ssh edunexus` se direct connect ho jayega.

---

## 4. Set up Hostinger MCP in Claude Code

Hostinger MCP se Claude Code DNS records add kar sakta hai, VPS restart kar sakta hai, billing dekh sakta hai — all without leaving the chat.

### 4.1 Add MCP server

Open Claude Code's settings file (`~/.claude/settings.json` or use `claude mcp add`) and add:

```json
{
  "mcpServers": {
    "hostinger": {
      "command": "npx",
      "args": ["-y", "hostinger-api-mcp"],
      "env": {
        "APITOKEN": "REDACTED"
      }
    }
  }
}
```

Or via CLI:
```bash
claude mcp add hostinger \
  --env APITOKEN=REDACTED \
  -- npx -y hostinger-api-mcp
```

### 4.2 Restart Claude Code

After restart, ask Claude: *"list my hostinger VPS"* — agar `srv1616850.hstgr.cloud` dikha, MCP active hai.

> 🔐 **Rotate this token after deployment** at hpanel.hostinger.com → API tokens.

---

## 5. Add DNS A record for edunexus.kibm.in

### Option A — via Hostinger MCP (one-liner with Claude)

Ask Claude: *"add A record edunexus → 187.127.156.138 in kibm.in zone, TTL 3600"*

The MCP call is `mcp__hostinger__DNS_updateDNSRecordsV1` against domain `kibm.in`:

```jsonc
{
  "domain": "kibm.in",
  "overwrite": false,
  "zone": [
    { "name": "edunexus", "type": "A", "ttl": 3600,
      "records": [{ "content": "187.127.156.138" }] }
  ]
}
```

### Option B — via hPanel UI

hpanel.hostinger.com → Domains → `kibm.in` → DNS / Nameservers → Add record:
- Type: `A` · Name: `edunexus` · Points to: `187.127.156.138` · TTL: `3600`

### Verify propagation
```bash
dig edunexus.kibm.in A +short
# expected: 187.127.156.138 (usually within 1-5 min for Hostinger)
```

---

## 6. Fix the seed.ts bug (crash root cause)

`backend/prisma/seed.ts` line ~89 me `question.options` (type `string[]`) ko Prisma column `options: String` me pass kiya ja raha hai. JSON-stringify karna padega.

**On your local Mac** (in repo clone):

```bash
cd ~/edunexuspro
# find the broken line
grep -n "options: question.options" backend/prisma/seed.ts
```

Edit `backend/prisma/seed.ts` — locate this block (~line 86):

```ts
// BEFORE (broken):
await prisma.quizQuestion.create({
  data: {
    moduleId: module.id,
    text: question.text,
    options: question.options,         // ❌ string[] → String mismatch
    correctAnswer: question.correctAnswer
  }
});

// AFTER (fixed):
await prisma.quizQuestion.create({
  data: {
    moduleId: module.id,
    text: question.text,
    options: JSON.stringify(question.options),   // ✅ serialize array
    correctAnswer: question.correctAnswer
  }
});
```

Commit + push:
```bash
git add backend/prisma/seed.ts
git commit -m "fix(seed): serialize quiz question options array to JSON string"
git push origin main
```

---

## 7. Configure backend env file

**On VPS:**

```bash
ssh edunexus      # or: ssh -i ~/.ssh/hostinger_edunexus.pem root@187.127.156.138
cd /docker/edunexuspro
```

Generate strong secrets locally:
```bash
openssl rand -hex 32   # use output for JWT_SECRET
openssl rand -hex 32   # use output for PAYMENT_WEBHOOK_SECRET
openssl rand -hex 24   # use output for POSTGRES_PASSWORD
```

Create `/docker/edunexuspro/.env`:

```bash
cat > /docker/edunexuspro/.env <<'EOF'
# ─── DB ───
POSTGRES_USER=nexusadmin
POSTGRES_PASSWORD=REPLACE_WITH_OPENSSL_OUTPUT_1
POSTGRES_DB=nexus

# ─── Backend ───
PORT=5000
DATABASE_URL=postgresql://nexusadmin:REPLACE_WITH_OPENSSL_OUTPUT_1@db:5432/nexus?schema=public
JWT_SECRET=REPLACE_WITH_OPENSSL_OUTPUT_2
PAYMENT_WEBHOOK_SECRET=REPLACE_WITH_OPENSSL_OUTPUT_3
CORS_ORIGIN=https://edunexus.kibm.in
NODE_ENV=production

# ─── Admin seed (one-time) ───
ADMIN_EMAIL=admin@edunexus.kibm.in
ADMIN_PASSWORD=REPLACE_WITH_STRONG_PASSWORD_MIN_16_CHARS
EOF
chmod 600 /docker/edunexuspro/.env
```

⚠️ Replace the 4 `REPLACE_*` placeholders before saving.

---

## 8. Rewrite docker-compose for co-tenancy

Port 8080 (currently public) ko **loopback-only** kar do — sirf nginx local pe call karega.

Edit `/docker/edunexuspro/docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    restart: unless-stopped
    ports:
      - "127.0.0.1:5050:5000"      # ← loopback only, was 0.0.0.0:5000
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "127.0.0.1:8090:80"        # ← loopback only, was 0.0.0.0:8080
    depends_on:
      - backend

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    env_file: .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

---

## 9. Bring up the stack

**On VPS, in `/docker/edunexuspro/`:**

```bash
# 1. Stop current broken stack
docker compose down

# 2. Pull latest code (assuming repo is cloned here)
git pull origin main      # if .git exists; else: clone first

# 3. Rebuild from scratch (no stale caches)
docker compose build --no-cache backend

# 4. Bring DB up first, wait for healthy
docker compose up -d db
docker compose ps          # confirm db is "healthy"

> 🗄️ **Postgres volume (read once):** `postgres_data` in this compose file is a standard
> Docker **named volume** — it is created automatically on first `up` (no manual
> `docker volume create edunexuspro_postgres_data` needed). Docker names it
> `<project>_postgres_data`, so as long as you keep the same compose project name
> (default: the directory name, e.g. `edunexuspro`), `docker compose down` WITHOUT
> `-v` preserves all data across redeploys. Never add `-v` to `down` on this stack.
> Backups target `/var/lib/docker/volumes/edunexuspro_postgres_data` (see §14).

# 5. Bring up backend + frontend
docker compose up -d backend frontend

# 6. Watch logs for clean boot
docker compose logs -f backend
# expected: "Server is running on port 5000"
# Ctrl+C when stable
```

**Verify locally on VPS:**
```bash
curl http://127.0.0.1:5050/         # → "EduNexus Pro API is running"
curl -I http://127.0.0.1:8090/      # → HTTP/1.1 200 OK
```

---

## 10. Nginx site + Let's Encrypt SSL

### 10.1 Create site config

```bash
cat > /etc/nginx/sites-available/edunexus <<'NGINX'
server {
    listen 80;
    server_name edunexus.kibm.in;

    # Certbot HTTP-01 challenge will write here
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # All other traffic → HTTPS (Certbot will add this after issuance)
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name edunexus.kibm.in;

    # SSL certs (Certbot fills these in)
    # ssl_certificate /etc/letsencrypt/live/edunexus.kibm.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/edunexus.kibm.in/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 1m;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend SPA
    location / {
        proxy_pass http://127.0.0.1:8090/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/edunexus /etc/nginx/sites-enabled/edunexus
nginx -t && systemctl reload nginx
```

### 10.2 Issue SSL cert

```bash
# Install certbot if not present
which certbot || apt-get update && apt-get install -y certbot python3-certbot-nginx

# Pre-check: DNS must resolve to this server
dig edunexus.kibm.in A +short    # must show 187.127.156.138

# Issue cert (interactive — pick option 2: redirect HTTP→HTTPS)
certbot --nginx -d edunexus.kibm.in --email vinayak@kibm.in --agree-tos --redirect
```

Certbot will edit the site config and uncomment the SSL lines.

### 10.3 Auto-renewal sanity check

```bash
systemctl status certbot.timer       # already enabled by certbot pkg
certbot renew --dry-run              # verifies renewal path
```

---

## 11. Smoke test

**From any laptop:**

```bash
# DNS
dig edunexus.kibm.in A +short                          # → 187.127.156.138

# HTTPS + cert
curl -sI https://edunexus.kibm.in/ | head -5           # → HTTP/2 200, ssl OK
curl -s https://edunexus.kibm.in/api/                  # → "EduNexus Pro API is running"

# Auth roundtrip — register + login
curl -s -X POST https://edunexus.kibm.in/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"smoketest123","name":"Smoke Test"}' \
  | python3 -m json.tool
# expected: { "token": "...", "user": { ... } }
```

**In browser:** `https://edunexus.kibm.in/`
- ✅ Home page loads
- ✅ Register → Dashboard
- ✅ Open any course → modules visible
- ✅ Admin login (`admin@edunexus.kibm.in` / your `ADMIN_PASSWORD`) → `/admin`

---

## 12. Troubleshooting & rollback

### Backend won't start
```bash
docker compose logs backend --tail=100
# common: DATABASE_URL malformed → check .env
# common: JWT_SECRET missing → check .env
# common: seed crash → see §6 fix
```

### DB connection refused
```bash
docker compose ps db                        # is healthy?
docker compose exec db pg_isready -U nexusadmin -d nexus
```

### nginx 502 Bad Gateway
```bash
curl -I http://127.0.0.1:8090/             # is frontend up?
curl -I http://127.0.0.1:5050/             # is backend up?
ss -tlnp | grep -E '5050|8090'             # ports actually listening?
journalctl -u nginx --since "5 min ago" | tail
```

### SSL renewal failure
```bash
certbot certificates                       # see expiry
certbot renew --force-renewal -d edunexus.kibm.in
```

### Full rollback (kill new deploy, keep KIBM safe)
```bash
cd /docker/edunexuspro
docker compose down
rm -f /etc/nginx/sites-enabled/edunexus
nginx -t && systemctl reload nginx
# DNS record can stay — points to a non-responding host but harmless
```

---

## 13. Co-tenancy promises (don't break KIBM)

KIBM stability is **non-negotiable** — production clients depend on it. Before any change on this VPS, confirm:

- [ ] No edit to `/etc/nginx/sites-enabled/kibm` or `/etc/nginx/sites-enabled/nexus`
- [ ] No restart of `nginx` until `nginx -t` passes
- [ ] No `docker system prune` (would nuke atlas_postgres + others)
- [ ] No change to port `80, 443, 3005, 3032, 4243-4245, 6379, 18789, 18791`
- [ ] After deploy: hit `https://kibm.in/`, `https://nexus.kibm.in/`, `https://marketplace.kibm.in/` — sab 200 OK
- [ ] After deploy: `docker ps | grep atlas` — atlas_postgres still UP

---

## 14. Post-deploy hardening (next sprint)

Already audited — 35 findings. Top 9 critical fixes still pending (track in GitHub issues):

| # | Fix | Effort |
|---|-----|--------|
| ~~C1~~ | ✅ Done — `/api/quiz/submit` requires `authenticateToken` | — |
| C2 | ⚠️ Partially done — certificate routes are auth-gated; `userId` still carried in URL (admin cert link) | 20 min |
| ~~C3~~ | ✅ Done — `JWT_SECRET` now via `getRequiredEnv` + fail-fast in `src/index.ts` | — |
| ~~C4~~ | ✅ Done — `PAYMENT_WEBHOOK_SECRET` now via `getRequiredEnv` + fail-fast | — |
| C5 | Mock payment ko Razorpay se replace karo | 1-2 days |
| C6 | Hardcoded `admin@nexus.com / admin123` seed ko env-driven banao | 15 min |
| C7 | ISO claims — confirm certifications exist; warna disclaimer add karo | — |
| ~~C8~~ | ✅ Done — Dockerfile uses `prisma migrate deploy` (idempotent, on-start) | — |
| ~~C9~~ | ✅ Done — CORS restricted to `CORS_ORIGIN` (default `https://edunexus.kibm.in`) | — |

Audit ka full report repo me alag se file karna hai — GitHub issues ke through track karenge.

---

## 🔐 Final reminder

After successful deploy + smoke test:
1. **Rotate Hostinger API token** (hpanel → API tokens → revoke + create new)
2. **Rotate SSH key** (generate new keypair on VPS, append to `~/.ssh/authorized_keys`, remove old)
3. **Delete this `DEPLOY.md`** from any shared inbox / chat after recipient confirms deploy is live
4. **Set up off-server backups** for Postgres volume (`/var/lib/docker/volumes/edunexuspro_postgres_data`)

---

**Questions / blockers?** Ping back in the same thread. Don't run §6–§10 in dry-run mode — always check `docker compose ps` and `nginx -t` between steps. KIBM safety first.

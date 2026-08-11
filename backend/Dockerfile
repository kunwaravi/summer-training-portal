FROM node:24-alpine

WORKDIR /app

# Security: run the API as the non-root `node` user (node:24-alpine ships one).
# COPY --chown so the runtime user owns everything it needs to run/seed.
COPY --chown=node:node package*.json ./
RUN npm ci

ENV CACHE_BUST=1
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate

COPY --chown=node:node . .

RUN npm run build

EXPOSE 5000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Start the application with migrations.
# NOTE: `prisma migrate deploy` runs on every container start (migration-on-start).
# It is idempotent — already-applied migrations are skipped — so a fresh deploy applies
# pending schema changes before the API boots. Ensure DATABASE_URL points at a Postgres
# that already has the required role/database (see DEPLOY.md for the volume prerequisite).
CMD npx prisma migrate deploy && npm start

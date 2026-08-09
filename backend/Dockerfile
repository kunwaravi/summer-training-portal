FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

ENV CACHE_BUST=1
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

# Start the application with migrations
CMD npx prisma migrate deploy && npm start
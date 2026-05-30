FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

# We need to run migrations and then start the server
CMD npx prisma db push --accept-data-loss && npx prisma db seed && npm start
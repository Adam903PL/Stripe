# ===========================
# 1️⃣ Build Stage
# ===========================
FROM node:22.11.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# Skopiuj resztę projektu
COPY . .

# ===========================
# 2️⃣ Runtime Stage
# ===========================
FROM node:22.11.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY . .


ENV NODE_ENV=production
ENV PORT=4000


EXPOSE 4000

CMD ["node", "src/server.js"]

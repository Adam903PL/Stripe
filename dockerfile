# ===========================
# 1️⃣ Build Stage
# ===========================
FROM node:22.11.0 AS build

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki definicji zależności
COPY package*.json ./

# Zainstaluj zależności (nie używamy npm ci, bo lockfile był niespójny)
RUN npm install --omit=dev

# Skopiuj resztę projektu
COPY . .

# ===========================
# 2️⃣ Runtime Stage
# ===========================
FROM node:22.11.0-alpine

WORKDIR /app

# Skopiuj node_modules z poprzedniego etapu
COPY --from=build /app/node_modules ./node_modules

# Skopiuj resztę kodu źródłowego
COPY . .

# Ustaw zmienną środowiskową (dla ESM)
ENV NODE_ENV=production
ENV PORT=4000

# Otwórz port
EXPOSE 4000

# Uruchom aplikację
CMD ["node", "src/server.js"]

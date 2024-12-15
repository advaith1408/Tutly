FROM node:20-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl curl && apt-get clean

RUN npm install -g astro

COPY package.json package-lock.json ./
COPY prisma ./prisma/

FROM base AS prod-deps

ENV HUSKY=0

RUN npm ci
RUN npm install @astrojs/check typescript
RUN npx prisma generate

FROM base AS build
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

ENV HOST=localhost
ENV HOSTNAME=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/server/entry.mjs"]

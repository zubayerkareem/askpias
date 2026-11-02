# Site (TanStack Start / Nitro SSR) — build once, run on Node.
# VITE_* values are baked at build time, so pass them as build args.

FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL=https://api.askpias.com/api
ARG VITE_ADMIN_URL=https://api.askpias.com/admin
ARG VITE_GTM_ID=""
ENV VITE_API_URL=$VITE_API_URL \
    VITE_ADMIN_URL=$VITE_ADMIN_URL \
    VITE_GTM_ID=$VITE_GTM_ID

RUN bun run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

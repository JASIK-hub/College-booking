# ---------- BUILD ----------
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache yarn

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build


# ---------- PROD ----------
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

CMD ["node", "dist/main.js"]

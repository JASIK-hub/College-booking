FROM node:22-alpine AS development
WORKDIR /app
RUN apk add --no-cache yarn dumb-init
RUN npm install --global @nestjs/cli
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN ls -la /app/dist

FROM node:22-alpine AS production
WORKDIR /app
RUN apk add --no-cache yarn dumb-init
COPY package.json yarn.lock ./
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist

CMD ["yarn", "start:dev"]

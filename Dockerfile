FROM node:18 AS base

COPY package.json pnpm-lock.yaml /app/
COPY /apps/frontend/package.json /app/apps/frontend/package.json
COPY /apps/backend/package.json /app/apps/backend/package.json

WORKDIR /app

COPY . /app

RUN npm install -g pnpm
RUN npm install -g turbo
RUN pnpm run build

CMD pnpm run start

# Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

# Build source code
FROM node:18-alpine AS builder

WORKDIR /app
VOLUME /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn db:generate
RUN yarn build

# Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD yarn prod

# Development runtime
FROM node:18-alpine AS dev

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY nodemon.json ./nodemon.json
COPY tsconfig.json ./tsconfig.json
COPY . .

CMD yarn dev

FROM node:22.9.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY proto ./proto/

RUN npm ci

COPY src ./src/

RUN npm run generate-types && \
    npx prisma generate && \
    npm run build

FROM node:22.9.0-alpine

ARG PORT
ARG HOST
ARG DATABASE_URL

ENV PORT=$PORT
ENV HOST=$HOST
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/proto ./proto
COPY prisma ./prisma/

ENV NODE_ENV=production

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE $PORT

CMD ["npm", "start"]

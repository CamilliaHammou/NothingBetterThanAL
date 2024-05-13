FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base as builder
COPY . .
RUN npm run build

FROM node:18-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
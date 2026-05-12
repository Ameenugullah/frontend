# ── Stage 1: Build the React app ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build with the Railway-injected env var
ARG VITE_PB_URL
ENV VITE_PB_URL=$VITE_PB_URL

RUN npm run build

# ── Stage 2: Serve with nginx ──────────────────────────────────────────────────
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

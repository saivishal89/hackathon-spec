# ----------------------------------------------------
# Stage 1: Build React/Vite Frontend
# ----------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ----------------------------------------------------
# Stage 2: Serve with Nginx
# ----------------------------------------------------
FROM nginx:alpine

# Copy custom Nginx configuration if needed, or default static dir
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy build to nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

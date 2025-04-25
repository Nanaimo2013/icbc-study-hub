# Build stage
FROM node:16-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install -g npm@latest && \
    npm install

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:16-bullseye-slim AS production

WORKDIR /home/container

# Install production dependencies
COPY package*.json ./
RUN npm install -g npm@latest && \
    npm ci --only=production && \
    npm cache clean --force

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy startup scripts
COPY entrypoint.sh startup.sh install.sh ./
RUN chmod +x entrypoint.sh startup.sh install.sh

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Create non-root user
RUN useradd -m -d /home/container container && \
    chown -R container:container /home/container

USER container

# Set entrypoint
ENTRYPOINT ["/home/container/entrypoint.sh"]

# Production environment
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=production /home/container/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
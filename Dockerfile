# ---------- Step 1: Build the React app ----------
FROM node:20 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the entire project and build it
COPY . .
RUN npm run build


# ---------- Step 2: Run the production build with Node ----------
FROM node:20 AS runner

WORKDIR /app

# Install production-only deps
COPY package.json package-lock.json* ./
RUN npm install --only=production

# Copy built app and server file
COPY --from=builder /app/dist ./dist
COPY server.js .

# Expose port used by your server (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
# Use official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose Vite preview port (default 4173)
EXPOSE 5173

# Run Vite preview
CMD ["npm", "run", "preview"]

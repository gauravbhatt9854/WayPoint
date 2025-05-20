# Use the official Node.js 20 image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port defined in vite.config.js (default is 5173)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

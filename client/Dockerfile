# Use Node.js 20 as base image
FROM node:20-alpine
# Set working directory inside container
WORKDIR /app
# Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Copy the rest of the app code
COPY . .
# Build the Vite project
RUN npm run build
# Install lightweight web server to serve the build
RUN npm install -g serve
# Command to run the app
CMD ["serve", "-s", "dist", "-l", "5173"]

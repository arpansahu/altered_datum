# Use the official Node.js 16 image as the base image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install a simple HTTP server to serve the built app
RUN npm install -g serve

# Expose port 8005 to the outside world
EXPOSE 8005

# Start the server to serve the built app
CMD ["serve", "-s", "build", "-l", "8005"]
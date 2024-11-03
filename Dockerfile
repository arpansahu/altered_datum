# Use the official Node.js image as the base image for development
FROM node:16-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Use a minimal image for the production server
FROM node:16-alpine as production

# Set the working directory in the container
WORKDIR /app

# Copy the build from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Install `serve` to serve the React application
RUN npm install -g serve

# Expose the application port
EXPOSE 8005

# Start the application using `serve`
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:8005"]

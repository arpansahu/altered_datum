# Use the official Node.js 20 image as the base image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

RUN npm run build

# Use a new image to keep the final image smaller
FROM node:20-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app /app

# Expose port 8005 to the outside world
EXPOSE 8005

# Start the application
CMD ["npm", "start"]

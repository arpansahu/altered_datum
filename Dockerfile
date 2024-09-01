# Use the official Node.js 16 image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm update @material-ui/core

# Copy the rest of the application code
COPY . .

# Expose port 8005 to the outside world
EXPOSE 8005

# Start the application using npm start on 0.0.0.0:8005
CMD ["npm", "start"]
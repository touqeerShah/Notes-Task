# Use an official Node.js runtime as base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application source code
COPY . .

# Compile TypeScript to JavaScript for production
RUN npm run compile
RUN npm run tsc

# Set NODE_ENV to production
ENV NODE_ENV=development

# Expose the port your application will run on
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "run", "deploy"]

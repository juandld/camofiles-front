#This dockerfile does not work, it will build but then Vite will not be found when running the dev server, might be able to deploy with it tho, so I will save it here for later. and develop normally.

# Stage 1: Build stage with Node.js
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install npm dependencies
RUN npm install

# Copy app files
COPY . .

# Stage 2: Final stage with Deno
FROM denoland/deno:latest

# Set the working directory
WORKDIR /app

# Copy installed dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy app files
COPY . .

# Install Deno dependencies
RUN deno install --allow-scripts=npm:@sveltejs/kit@2.11.1

EXPOSE 3000

# Run the Deno task
CMD ["deno", "task", "dev"]
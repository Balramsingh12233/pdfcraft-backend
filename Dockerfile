# Use an official Node runtime as a parent image
# Debian-based is required for apt-get
FROM node:18-bullseye-slim

# Install system dependencies:
# - ghostscript (for compression)
# - libreoffice (for pdf conversions)
# - default-jre (required by some libreoffice components, though headless often works without)
# - fonts-opensymbol (sometimes needed)
RUN apt-get update && apt-get install -y \
    ghostscript \
    libreoffice \
    libreoffice-java-common \
    default-jre \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the API port
EXPOSE 4000

# Start command
CMD ["node", "server.js"]

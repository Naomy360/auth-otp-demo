# Use a Node 20 image (works well with Vite)
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Default command for docker-compose
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

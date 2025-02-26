FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the files
COPY . .

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Set the environment variable
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
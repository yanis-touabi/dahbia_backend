FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Copy Prisma files
COPY prisma ./prisma

# Install required system packages
RUN apt-get update -y && apt-get install -y openssl procps

# Install dependencies using Yarn
RUN corepack enable && yarn install

# Install nodemon globally
RUN yarn global add nodemon

# Generate Prisma client
RUN yarn prisma generate

# Copy the rest of the app
COPY . .

# Build the application
RUN yarn build

# Expose app port
EXPOSE 4000

# Start the app in production
CMD ["yarn", "start:prod"]
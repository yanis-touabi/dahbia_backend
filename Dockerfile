FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Install required system packages
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies using Yarn
RUN corepack enable && yarn install

# Install nodemon globally
RUN yarn global add nodemon

# Copy the rest of the app
COPY . .

# Generate Prisma client (if using Prisma)
RUN yarn prisma:generate

# Expose app port
EXPOSE 4000

# Start the app
CMD ["yarn", "start:dev"]

FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Install required system packages
RUN apt-get update -y && apt-get install -y openssl procps

# Install dependencies using Yarn
RUN corepack enable && yarn install

# Install nodemon globally
RUN yarn global add nodemon

# Copy the rest of the app
COPY . .

# Generate Prisma client (if using Prisma)
# RUN yarn prisma:dev:deploy && yarn prisma:generate

# Build the application (compiles TS to JS in dist/)
RUN yarn build

# Expose app port
EXPOSE 4000

# Start the app in production
CMD ["yarn", "start:prod"]

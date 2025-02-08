# use the official Node.js 18 image as a base
FROM node:18-alpine AS builder

# set the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json first (for efficient caching)
COPY package.json ./

# install dependencies
RUN npm install

# copy the rest of the bot's source code
COPY . .

# run the build process
RUN npm run build

# production stage
FROM node:18-alpine

# set working directory
WORKDIR /app

# copy only the built files and production dependencies from the builder stage
COPY --from=builder /app/package*.json ./
RUN npm install --production

# copy only the built output
COPY --from=builder /app/dist ./dist

# command to run the bot
CMD ["node", "dist/index.js"]

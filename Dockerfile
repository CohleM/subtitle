# FROM node:21-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install

# COPY . .

# CMD ["npm", "run" , "dev"]


FROM node:21-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Set the command to start the server after building
CMD ["npm", "start"]


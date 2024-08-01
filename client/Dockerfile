FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env file to the working directory
COPY .env ./

# Expose the port that your app runs on
EXPOSE 3000

# Generate Prisma Client
RUN npx prisma generate

# Apply Prisma migrations
# RUN npx prisma migrate deploy

# Command to run your application
CMD ["yarn", "start"]

# docker build -t rwallet-server .
# docker run --env-file .env -p 3000:3000 -d rwallet-server
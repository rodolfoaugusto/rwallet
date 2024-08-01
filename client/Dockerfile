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

# Build
RUN yarn build

# Serve
RUN yarn global add serve

# Expose the port that your app runs on
EXPOSE 4200

# Command to run your application
CMD ["serve", "-s", "build", "-p 4200"]

# docker build -t rwallet-client .
# docker run --env-file .env -p 4200:4200 -d rwallet-client
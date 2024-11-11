# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine
# Use production node environment by default.
ENV NODE_ENV production
# Install nodemon globally
RUN npm install -g nodemon

# RUN npm install -g node-sass
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Copy the rest of the source files into the image.
COPY . .
USER node
EXPOSE 3000
# Run the application.
CMD npm run start2
# FROM nginx:1.26.0
# # COPY src/resource/scss/app.scss /usr/src/app/src/resource/scss/app.scss


# # Sao chép tệp cấu hình Nginx vào container
# COPY nginx.conf /etc/nginx/nginx.conf


# # Expose the port that the application listens on.
# EXPOSE 8000
# EXPOSE 80

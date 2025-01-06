# build stage
FROM node:16.20.2-alpine as build-stage
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY public public
COPY src src
COPY vue.config.js .
RUN yarn run web:build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist_web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
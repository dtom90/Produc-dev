# build stage
FROM node:14.17.3-alpine as build-stage
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY public public
COPY src src
RUN yarn run web:build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist_web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
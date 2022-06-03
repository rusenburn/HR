# FROM node:latest as build

# WORKDIR /usr/local/app

# COPY ./ /usr/local/app

# RUN npm install

# RUN npm run build --prod

# #

FROM nginx:latest

COPY ./dist/client /usr/share/nginx/html
# COPY --from=build /usr/local/app/dist/client /usr/share/nginx/html

EXPOSE 80
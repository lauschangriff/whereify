FROM node:latest as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./certificates/gpxtool.de.pem /etc/nginx/certs/
COPY ./certificates/privkey.pem /etc/nginx/certs/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
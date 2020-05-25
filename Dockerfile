# build environment
FROM node:10.13-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci 
RUN npm install react-scripts@3.4.1 -g 
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine

# Add bash
RUN apk add --no-cache bash

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY env.sh .
COPY .env .

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
# CMD ["nginx", "-g", "daemon off;"]
# ENTRYPOINT /bin/sh -c "/usr/bin/env.sh && nginx -g 'daemon off;'"
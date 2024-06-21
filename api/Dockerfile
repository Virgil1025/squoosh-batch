FROM node:16.14.2-alpine
WORKDIR /app
COPY package.json .

COPY ZScaler_Root_CA.crt /usr/local/share/ca-certificates/my-cert.crt
RUN cat /usr/local/share/ca-certificates/my-cert.crt >> /etc/ssl/certs/ca-certificates.crt && \
    apk --no-cache add \
        curl

#for installing canvas
# RUN apk add --update --no-cache make g++ jpeg-dev cairo-dev giflib-dev pango-dev

RUN npm install
COPY . .
RUN npm run build
CMD ["yarn", "run", "start:prod"] 

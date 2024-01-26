FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

EXPOSE 3000

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "start"]

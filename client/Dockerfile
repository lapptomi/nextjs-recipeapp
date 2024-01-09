FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ENV NEXTAUTH_SECRET=secret

EXPOSE 3000

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "start"]

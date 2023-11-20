FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./prisma /usr/src/app/prisma

RUN npm ci

COPY . .

# RUN npx prisma generate

RUN npm run build

CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /usr/src/app

ARG ARG_DATABASE_URL
ENV DATABASE_URL=$ARG_DATABASE_URL

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "start"]

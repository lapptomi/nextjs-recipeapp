FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

# RUN npm run build <- fix build for ci/cd

CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm ci

RUN npm install

COPY . .

RUN npx prisma generate
# <- fix build for ci/cd
RUN npm run build

CMD ["npm", "start"]

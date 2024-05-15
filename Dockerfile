FROM node:18.20.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
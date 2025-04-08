FROM node:22

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "dev", "--", "--host" ]
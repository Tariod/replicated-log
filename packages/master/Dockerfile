FROM node:18.12.1-alpine3.16

WORKDIR /usr/src/replicated-log

COPY package.json package-lock.json ./
RUN npm ci

ENV NODE_ENV production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json tsconfig.build.json ./
COPY src src
COPY .env ./
RUN npm run build


FROM node:14-alpine
COPY package.json ./
RUN npm install
COPY --from=build /app/dist dist
COPY .env* ./

CMD ["npm", "run", "start:prod"]

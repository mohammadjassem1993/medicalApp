FROM node:latest

WORKDIR /app
COPY . .
COPY routes routes
COPY model model
RUN npm install
EXPOSE 3000
CMD ["node","/app/index.js"]

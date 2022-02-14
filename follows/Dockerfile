FROM node:17

WORKDIR /app

# Configure the server
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
FROM node:19

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]

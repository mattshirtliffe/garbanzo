# docker build -f Dockerfile -t matthewshirtliffecouk/garbanzo .
# docker run -p 27017:27017 --name garbanzo-mongo -d mongo
# docker run -d -p 5000:5000 --link garbanzo-mongo:mongo --name garbanzo  matthewshirtliffecouk/garbanzo

# docker build -f Dockerfile -t matthewshirtliffecouk/garbanzo .
# docker network create --driver bridge garbanzo_network
# docker run -d --net=garbanzo_network -p 27017:27017 --name garbanzo-mongo -d mongo
# docker run -d --net=garbanzo_network -p 5000:5000 --name garbanzo  matthewshirtliffecouk/garbanzo

FROM node:latest

MAINTAINER Matthew Shirtliffe

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]

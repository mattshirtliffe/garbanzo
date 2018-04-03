
# Garbanzo API
A simple todo list api


## Create and start a test database

docker pull mongo
docker run -p 27017:27017 --name garbanzo-mongo -d mongo

## Access Database
docker exec -it garbanzo-mongo mongo

## Run app
npm start

## Run test
export NODE_ENV=test
npm test

## Config
app/config/config.js

```
"development": {
"database": "mongodb://localhost/garbanzo_development",
"httpPort":5000,
"jsonWebTokenSecret":"secret",
"jsonWebTokenExpiresIn":"1h",
"saltRounds":10,
"mailGunApiDomain":"",
"mailGunApiKey":"",
"adminEmailFrom":"Name <email address>",
"baseUrl":"your base url"
}
```




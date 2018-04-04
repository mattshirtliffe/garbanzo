
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
"database": "mongodb://garbanzo-mongo/garbanzo_development",
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

# Curl Usage

## Register

curl -H "Content-Type: application/json" -X POST -d \
'{"firstName": "Matthew",
"lastName": "Shirtliffe",
"email": "email@domain.com",
"phone": "07700 900518",
"password": "password",
"hasAcceptedTerms": true
}' http://127.0.0.1:5000/api/register

## Register authenticate and get token

curl -H "Content-Type: application/json" -X POST -d '{"email":"email@domain.com","password":"password"}' http://127.0.0.1:5000/api/authenticate

## Get Tasks

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X GET http://127.0.0.1:5000/api/tasks

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X GET http://127.0.0.1:5000/api/tasks/<id>

## Create Task

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X POST -d '{"title":"test"}' http://127.0.0.1:5000/api/tasks

## Update Tasks

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X PATCH -d '{"title":"new title"}' http://127.0.0.1:5000/api/tasks/<id>

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X PUT -d '{"title":"new title"}' http://127.0.0.1:5000/api/tasks/<id>

## Delete Task

curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X DELETE http://127.0.0.1:5000/api/tasks/<id>

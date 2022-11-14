# attention mock server for development

Run this to avoid errors with websockets while developing -
also it can trigger all methods and it returns attention level - 53


Estimation of attention level in a video
Always returns 53 to write in database

#start docker-compose container
docker-compose up --build
#remove container and volume
docker-compose down --remove-orphans




# Knight

knight is based on React(Frontend) and Django(Backend). You can set up this project by using Docker.

## Installation
First you need to install Docker on your PC and then run following commands.

Inside knight folder run below commands

```bash
docker-compose up db
docker-compose up api
```
and then

Inside frontend folder run below command
```bash
docker-composer up
```
then you need to create user 

for that you need to go inside docker api container by running following command

```bash
docker exec -it <container_id_or_name>
```
and then 
```bash
python manage.py createsuperuser
```

after running the above command you need to enter username, email, password and confirm password.

You also need to run below commands 
```bash
python manage.py loaddata specialty.json
python manage.py loaddata price.json
```
then ping localhost:3001

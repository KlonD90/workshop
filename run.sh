#!/bin/bash

while ! pg_isready -h pg_database > /dev/null 2> /dev/null; do
    echo "Connecting to pg_database Failed"
    sleep 1
done

./node_modules/.bin/sequelize db:migrate
node workshop.js

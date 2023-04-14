#!/bin/bash
cd restify-backend
./manage.py runserver &

cd ../restify-frontend
npm start &

#!/bin/bash
chmod +x run.sh
cd restify-frontend
npm install
echo "REACT_APP_BACKEND_URL='http://localhost:8000'" > .env

cd ../restify-backend
pip3 install virtualenv

virtualenv -p `which python3.8` venv
source venv/bin/activate
pip install -r requirements.txt
./manage.py makemigrations
./manage.py migrate

cd ../
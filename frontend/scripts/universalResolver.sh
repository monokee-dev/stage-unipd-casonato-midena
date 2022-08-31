#!/bin/bash

clear; cd ..;
cd ..; cd universal-resolver; 
docker rm $(docker stop $(docker ps -a -q --format='{{.ID}}'));
docker-compose -f docker-compose.yml pull;
docker-compose -f docker-compose.yml up;
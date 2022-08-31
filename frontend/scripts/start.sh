#!/bin/bash

clear; cd ..;
cd ..; cd waltid-typescript-sdk; git pull; npx tsc;
cd ..; cd waltid_besu_integration; git pull; npm link ssikit-sdk; npm start;
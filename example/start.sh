#!/bin/bash

# ---
echo "Starting new processe(s)"
nohup ./robohash.js --port=$1 > /dev/null  & 

# ---
exit 0
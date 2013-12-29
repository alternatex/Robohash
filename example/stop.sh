#!/bin/bash

# ---
echo "Terminating existing processe(s)"
kill $(ps aux | grep '[n]ode robohash.js' | awk '{print $2}')

# ---
exit 0
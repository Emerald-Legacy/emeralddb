#!/bin/bash
if [ ! -d /tmp/fiveringsdb-data ]; then
    mkdir /tmp/fiveringsdb-data
    git clone "https://github.com/fatihi/fiveringsdb-data" /tmp/fiveringsdb-data
else
    cd /tmp/fiveringsdb-data
    git pull master
fi
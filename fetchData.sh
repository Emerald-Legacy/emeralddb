#!/bin/bash
if [ ! -d /etc/fiveringsdb-data ]; then
    mkdir /etc/fiveringsdb-data
    git clone "https://github.com/fatihi/fiveringsdb-data" /etc/fiveringsdb-data
else
    cd /etc/fiveringsdb-data
    git pull master
fi
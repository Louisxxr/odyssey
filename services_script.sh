#!/bin/bash

read -p "secret: " secret

export FLASK_DEBUG=1
echo $secret | sudo redis-server /etc/redis/redis.conf
echo $secret | sudo /etc/init.d/mysql start

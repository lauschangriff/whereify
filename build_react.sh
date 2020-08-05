#!/bin/bash

cd fe &&
run npm build &&
cp -r build /var/www/html
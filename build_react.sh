#!/bin/bash

cd fe &&
npm run build &&
cp -r build /var/www/html
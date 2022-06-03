#!/bin/sh
cd "${0%/*}"
cd ../

echo "Building Angular Project..."
ng build -c production

echo "Dockerizing Output..."
docker build -t rusenburn/hr-client .

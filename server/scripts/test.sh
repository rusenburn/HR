#!/bin/sh
cd "${0%/*}"
cd ../src/
python -m unittest discover ./tests/
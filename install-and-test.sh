#!/usr/bin/env bash

set -e

packages="hidb-client hidb-redis hidb-server"

for package in $packages; do
  cd $package
  npm install
  npm run lint
  npm run test
  cd ../
done

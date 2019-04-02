#!/usr/bin/env bash

set -e

packages="jiber-client jiber-redis jiber-server tests"

for package in $packages; do
  cd $package
  npm install
  npm run lint
  npm run test
  cd ../
done

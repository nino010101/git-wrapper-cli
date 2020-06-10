#!/bin/sh

# error handle
set -eu

#install
echo '### install git wrapper cli ###'
npm install
npm run build
npm link
echo;
echo '### install complete ###'
echo 'usage: gitw [command]'

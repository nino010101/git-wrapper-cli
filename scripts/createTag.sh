#!/bin/sh
# tag作成とリリースドラフトを作るスクリプト

# error handle
set -eu

echo '### create release tag ###'
current=`git branch --contains | cut -d " " -f 2`
if [ ! "$current" = "master" ]; then
    echo 'error: run in master branch.'
    exit 1;
fi

status=$(git status --porcelain);
if [ -n "${status}" ]; then
    echo 'error: clean your local changes first.'
    exit 1;
fi

git fetch;
origin_diff=$(git diff origin/master);
if [ -n "${origin_diff}" ]; then
    echo 'error: local branch is not updated.'
    exit 1;
fi

current=`node -pe 'require("./package.json").version'`
echo;
echo "current version -> $current"
# check if who wants to create release pull request
read -p "create release tag for master branch? (Y/n): " answer;
if [ "${answer}" = "y" ] || [ "${answer}" = "Y" ]; then
    git tag "v$current"
    git push origin --tags
    hub release create -d v$current
    echo;
    echo '### tag & release draft created ###'
fi


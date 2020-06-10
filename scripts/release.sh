#!/bin/sh
# developブランチからリリース用のPRを作成するShellScript

# error handle
set -eu

echo '### create release PR ###'
current=`git branch --contains | cut -d " " -f 2`
if [ ! "$current" = "develop" ]; then
    echo 'error: run in develop branch.'
    exit 1;
fi

status=$(git status --porcelain);
if [ -n "${status}" ]; then
    echo 'error: commit your changes first.'
    exit 1;
fi

git fetch;
origin_diff=$(git diff origin/develop);
if [ -n "${origin_diff}" ]; then
    echo 'error: branch is not updated.'
    exit 1;
fi

# version update
newv=`yarn --no-git-tag-version version`
echo;
echo "release version -> $newv"
# check if who wants to create release pull request
read -p "create release pull request? (Y/n): " answer;
if [ "${answer}" = "y" ] || [ "${answer}" = "Y" ]; then
    git add ./package.json
    git commit -m "update version ( v$newv )"
    git push origin head
    hub pull-request -F ./.github/RELEASE_PULL_REQUEST_TEMPLATE.md -b master -h develop
    echo;
    echo '### release pull request created ###'
fi


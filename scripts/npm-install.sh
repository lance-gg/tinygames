#!/bin/bash
source /home/ec2-user/.bash_profile
mkdir -p /var/games/tinygames

# arg 1: game name
# arg 2: CDN name
run-game () {
    cd /var/games/tinygames/$1
    npm install

    # upload static files to s3
    cd /var/games/tinygames/$1/dist && aws s3 sync --acl public-read --delete . s3://$1.lance.gg

     # invalidate CDN
    aws configure set preview.cloudfront true && aws cloudfront create-invalidation --distribution-id ESBEDKJR2DSZF --paths "/*"
}

run-game asteroids
run-game wiggle
run-game pong

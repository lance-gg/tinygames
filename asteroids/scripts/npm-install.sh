#!/bin/bash
source /home/ec2-user/.bash_profile
mkdir -p /var/games/asteroids
cd /var/games/asteroids
npm install

# upload static files to s3 
cd /var/games/asteroids/dist && aws s3 sync --acl public-read --delete . s3://asteroids.lance.gg

# invalidate CDN
aws configure set preview.cloudfront true && aws cloudfront create-invalidation --distribution-id ESBEDKJR2DSZF --paths "/*"

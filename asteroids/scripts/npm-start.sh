#!/bin/bash
source /home/ec2-user/.bash_profile
cd /var/games/asteroids
PORT=3002 npm start >asteroids.out 2>asteroids.err &
      

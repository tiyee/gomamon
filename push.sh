#!/bin/bash
/bin/bash ./build.sh
git add -A;
git commit -m "$USER $(date +%H:%M:%S)";
git push origin master ;


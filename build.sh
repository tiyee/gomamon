#!/bin/bash
workspace=$(cd $(dirname $0) && pwd -P)
cd $workspace
function scan(){
    local folders=$workspace/docs
    local array=($(ls $folders/*.md))
    local num=$(echo $((${#array[@]}-1)))
    printf '['
    for ((i=0;i<${#array[@]};i++))
    do
        local file=${array[$i]}
        printf '{'
        local file_name=$(basename $file .md | base64)
        # local t=`git log   --pretty=short --format="%at" $file`
        local c=`cat $file | base64`
        printf "\"file\":\"${file_name}\","
        # printf "\"ts\":${t},"
        printf "\"md\":\"${c}\""
        if [ "$i" == ${num} ];
        then
                printf "}"
        else
                printf "},"
        fi
        
    done
    printf ']'
}
x=`scan`
echo $x > ./doc.json
#!/bin/bash
# This script takes in the configuration for creating the TFRcord Dataset for the input dataset, training and evaluation
flag="0"
PYTHON_BIN_PATH=$(which python || which python3 || True)

function create_if_not_exists {
    if [ ! -d "$1" ]; then
        mkdir $1
    fi 
}
function create_labels {
    echo "$1 $2 $3"
}

read -p "Enter the path models[Example:~/models/]" MODELS_DIR
read -p "Enter the path raw data[Example:~/raw_directory/" RAW_DIRECTORY 
read -p "Enter the directory where the split dataset will be populated[Example:~/split_directory/" SPLIT_DIRECTORY
read -p "Enter the directory where the TFRecord Dataset will be populated[Example:~/Dataset]" TFRECORD_OUTPUT
read -p "Enter the ratio for the split[Example:80,20][Default:80,20]" ratio
if [ -z "$ratio" ]; then
    ratio="80,20"
fi
read -p "Enter the name of the directory in your raw data which needs to be trained[Default:All]" WHICH_REST
if [ -z "$WHICH_REST" ]; then
    flag=1
fi

if [ "$flag" == "1" ]; then
    OUTPUT=`${PYTHON_BIN_PATH} dummy.py --raw_dir=$RAW_DIRECTORY --split_directory=$SPLIT_DIRECTORY`
else
    OUTPUT=`${PYTHON_BIN_PATH} dummy.py --raw_dir=$RAW_DIRECTORY --split_directory=$SPLIT_DIRECTORY --which_rest=$WHICH_REST`
fi

ABSOLUTE_PATH_MODELS=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${MODELS_DIR}')))"`
WORKING_DIRECTORY=$(pwd)
LABELS_DIR="$WORKING_DIRECTORY/Labels"
if [ -d $WORKING_DIRECTORY ]; then
    rm -rf $LABELS_DIR
fi
mkdir $LABELS_DIR

OUTPUT="true"
cd $ABSOLUTE_PATH_MODELS
cd inception
bazel build //inception:build_image_data

if [ "$OUTPUT" == "true" ]; then 
    create_labels "$SPLIT_DIRECTORY/$WHICH_REST/" "$LABELS" "$WHICH_REST.txt"    
else

if
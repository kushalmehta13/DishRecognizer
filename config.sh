#!/bin/bash
# This script takes in the configuration for creating the TFRcord Dataset for the input dataset, training and evaluation
flag="0"
PYTHON_BIN_PATH=$(which python || which python3 || True)

function create_if_not_exists {
    if [ ! -d "$1" ]; then
        mkdir $1
    fi 
}
function remove_if_exists {
    if [ -d $1 ]; then
        rm -rf $1
    fi
}
function remove_and_create {
    remove_if_exists $1
    mkdir $1
}
function create_labels {
    `${PYTHON_BIN_PATH} -c "import os; itemlist=os.listdir('$1'); outfile=open('$2','w'); outfile.write(\"\\n\".join(itemlist)); outfile.close()"`
}
function create_dataset {
    bazel-bin/inception/build_image_data --train_directory="$1" --validation_directory="$2" --output_directory="$3" --labels_file="$4"
}
function start_training {
    echo $1 $2 $3
    python train_image_classifier.py --train_dir=$1 --dataset_dir=$2 --dataset_name=imagenet --dataset_split_name=train --model_name=inception_resnet_v2 --checkpoint_path=$3 --checkpoint_exclude_scopes=InceptionResnetV2/Logits,InceptionResnetV2/AuxLogits --trainable_scopes=InceptionResnetV2/Logits,InceptionResnetV2/AuxLogits
}

read -p "Enter the path models[Example:~/models/]" MODELS_DIR
read -p "Enter the path raw data[Example:~/raw_directory/" RAW_DIRECTORY 
read -p "Enter the directory where the split dataset will be populated[Example:~/split_directory/" SPLIT_DIRECTORY
read -p "Enter the directory where the TFRecord Dataset will be populated[Example:~/Dataset/]" TFRECORD_OUTPUT
read -p "Enter the path to your model[Example:~/inception_resnet_v2_2016_08_30.ckpt]" CHECKPOINT_PATH
read -p "Enter the path where training data is to be saved[Example:~/Training/]" TRAIN_DIR
read -p "Enter the ratio for the split[Example:80,20][Default:80,20]" ratio
if [ -z "$ratio" ]; then
    ratio="80,20"
fi
read -p "Enter the name of the directory in your raw data which needs to be trained[Default:All]" WHICH_REST
if [ -z "$WHICH_REST" ]; then
    flag=1
fi

if [ "$flag" == "1" ]; then
    OUTPUT=`${PYTHON_BIN_PATH} dummy.py --raw_dir=$RAW_DIRECTORY --split_dir=$SPLIT_DIRECTORY`
else
    OUTPUT=`${PYTHON_BIN_PATH} dummy.py --raw_dir=$RAW_DIRECTORY --split_dir=$SPLIT_DIRECTORY --which_rest=$WHICH_REST`
fi

MODELS_DIR=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${MODELS_DIR}')))"`
RAW_DIRECTORY=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${RAW_DIRECTORY}')))"`
SPLIT_DIRECTORY=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${SPLIT_DIRECTORY}')))"`
TFRECORD_OUTPUT=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${TFRECORD_OUTPUT}')))"`
CHECKPOINT_PATH=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${CHECKPOINT_PATH}')))"`
TRAIN_DIR=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${TRAIN_DIR}')))"`

WORKING_DIRECTORY=$(pwd)
LABELS_DIR="$WORKING_DIRECTORY/Labels"

remove_and_create $LABELS_DIR
create_if_not_exists $TFRECORD_OUTPUT

OUTPUT="true"
cd $MODELS_DIR
cd inception
bazel build //inception:build_image_data

if [ "$OUTPUT" == "true" ]; then
    LABELS_FILE="$LABELS_DIR/$WHICH_REST.txt"
    REST_DIR="$SPLIT_DIRECTORY/$WHICH_REST"
    DATASET_DIR="$TFRECORD_OUTPUT/$WHICH_REST"
    TRAINING_DIR="$TRAIN_DIR/$WHICH_REST"
    create_labels "$REST_DIR/Train/" $LABELS_FILE 
    remove_and_create $DATASET_DIR
    create_dataset "$REST_DIR/Train/" "$REST_DIR/Validation/" $DATASET_DIR $LABELS_FILE
    cd ..
    cd slim
    remove_and_create $TRAINING_DIR
    start_training $TRAINING_DIR $DATASET_DIR $CHECKPOINT_PATH
else
    
fi
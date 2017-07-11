#!/bin/bash
# This is a script to retrain the final layer of inception to recognize custom images

# The path for python binary
PYTHON_BIN_PATH=$(which python || which python3 || True)

#The variables
working_directory=$(pwd)

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

read -p "Enter the directory for the dataset[Example:~/dataset]" dataset
read -p "Enter the path for tensorflow[Example:~/tensorflow]" tensorflow

# Sanitize the input to account for ~ in the path
dataset=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${dataset}')))"`
tensorflow=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${tensorflow}')))"`

# Create direcotories for the output graphs
remove_and_create Output_graphs
remove_and_create temp

# Create the outer model first 
cd $dataset
for d in */ ; do
    subdircount=`find "${d}" -maxdepth 1 -type d | wc -l`
    echo "$d"
    if [ $subdircount -eq 1 ]
    then
        cp -r "$d"  "$working_directory/temp/"
    else
        mkdir "$working_directory/temp/$d"
        cd "$d"
        for d1 in */; do
            cp -r "$d1." "$working_directory/temp/$d."
        done
        cd ..
    fi
done

cd $tensorflow
# Build the retrainer first
bazel build tensorflow/examples/image_retraining:retrain

# Train the model
bazel-bin/tensorflow/examples/image_retraining/retrain --image_dir "$working_directory/temp" --output_graph "$working_directory/Output_graphs/Outer.pb" --output_labels "$working_directory/Output_graphs/Outer.txt"

cd $dataset
for d in */ ; do
    subdircount=`find "${d}" -maxdepth 1 -type d | wc -l`
    if [ $subdircount -eq 1 ]
    then
        :
    else
        echo "${d///}"
        remove_and_create "$working_directory/temp"
        cp -r "$d." "$working_directory/temp/"
        $tensorflow/bazel-bin/tensorflow/examples/image_retraining/retrain --image_dir "$working_directory/temp" --output_graph "$working_directory/Output_graphs/${d///}.pb" --output_labels "$working_directory/Output_graphs/${d///}.txt"
    fi
done
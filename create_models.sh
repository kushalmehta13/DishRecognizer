#!/bin/bash
# This is a script to retrain the final layer of inception to recognize custom images
# The input to this script is a folder containing categorized input images and the output is a .pb and a labels file which can then be used by the
# prediction script to predict given an input image

# The path for python binary
PYTHON_BIN_PATH=$(which python || which python3 || True)

# This holds the current directory where the program resides
# All the output graphs are going to be populated in a folder called Output_graphs as well as a temporary directory which will be made for 
# training purposes
working_directory=$(pwd)

# This is a utility function which creates a directory if it doesn't exist already
function create_if_not_exists {
    if [ ! -d "$1" ]; then
        mkdir "$1"
    fi 
}

# This is a utility function which removes a directory if it exists
function remove_if_exists {
    if [ -d "$1" ]; then
        rm -rf "$1"
    fi
}

# This is a utility function which deletes a directory and creates it again - useful for cleanup purposes
function remove_and_create {
    remove_if_exists "$1"
    mkdir "$1"
}

# Read the user input where the categorized data resides as well as the tensorflow github directory
read -e -p"Enter the directory for the dataset[Example:~/dataset]" dataset
read -e -p"Enter the path for tensorflow[Example:~/tensorflow]" tensorflow

Output_graphs=`basename "${dataset}"`
echo $Output_graphs

# Sanitize the input to account for ~ in the path
dataset=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${dataset}')))"`
tensorflow=`${PYTHON_BIN_PATH} -c "import os; print(os.path.realpath(os.path.expanduser('${tensorflow}')))"`

# Create direcotories for the output graphs and a temporary directory
remove_and_create "$Output_graphs"
remove_and_create temp

# Sanitize the data
python sanitize.py "$dataset"

# Create the outer model first 
# Outer model refers to the broader classifier which will classify an image into one of the broad categories like burger, taco, burrito etc.
cd "$dataset"
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

# Change to the tensorflow directory
cd "$tensorflow"

# Build the retrainer first
# This is just the first time step. You can comment this out after one run
# bazel build tensorflow/examples/image_retraining:retrain

# Train the model
# The trained model is stored as Outer.pb and the labels file is Outer.txt
bazel-bin/tensorflow/examples/image_retraining/retrain --image_dir "$working_directory/temp" --output_graph "$working_directory/$Output_graphs/Outer.pb" --output_labels "$working_directory/$Output_graphs/Outer.txt" 

# Now we proceed to constructing the sub models i.e models for every sub category so we know which exact item in that sub category it is e.g 
# if its determined as a burger by the outer model, the sub model will determine which exact burger it is
# Every sub model is generated with the same name as that of the enclosing folder i.e burger.pb and burger.txt(for the labels)
cd "$dataset"
for d in */ ; do
    subdircount=`find "${d}" -maxdepth 1 -type d | wc -l`
    if [ $subdircount -eq 1 ]
    then
        :
    else
        echo "${d///}"
        remove_and_create "$working_directory/temp"
        cp -r "$d." "$working_directory/temp/"
        $tensorflow/bazel-bin/tensorflow/examples/image_retraining/retrain --image_dir "$working_directory/temp" --output_graph "$working_directory/$Output_graphs/${d///}.pb" --output_labels "$working_directory/$Output_graphs/${d///}.txt" 
    fi
done
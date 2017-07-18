# DishRecognizer
This project aims to train and predict using Google's Inception model which is implemented using Tensorflow. This repo defines a two bash scripts for the following purposes:
1. To generate tensorflow model files from raw images 
2. To use the generated model files to predict given an image

## Prerequisites:
1. Installed tensorflow with GPU support. For further instruction check this [link](https://www.tensorflow.org/install/).
2. Installed the following packages for python:
    * Regex package "re"
    * Argument parser "argparse"
    * Image library "pillow"
    * Requests Library "requests"
    * Pprint 
    * Jsbeautifier

## Get started
First you have to create the model by executing the create_models.sh file. For that execute it as follows
'''
./create_models.sh 
Enter the directory for the dataset[Example:~/dataset] ~/datatset
Enter the path for tensorflow[Example:~/tensorflow] ~/tensorflow
.
.
.
'''

This script generates the necessary model and label files required by the prediction. More detail on the dataset structure is given in the next section.
Optionally you can also pass an input files to the script as shown in input.txt like so
'''
./create_models.sh < input.txt
'''

## PART 1: Generating Tensorflow model files from Raw Dataset
The script create_models.sh asks the user for two inputs. The first one is the directory for the cloned tensorflow repository. For example if the cloned directory resides in the $HOME folder of the user, the appropriate input for this would be /home/dev/tensorflow or simply ~/tensorflow. User should take note that environment variables are not handled as part of the script e.g $HOME, $PWD etc. The second input to this would be the directory where the raw images reside in a categorized fashion. Therefore your directory structure could be as follows:

'''
~/dataset/burgers/burger_type_1/001.jpg
~/dataset/burgers/burger_type_1/002.jpg
.
.
.
~/dataset/burgers/burger_type_3/001.jpg
.
.
.
~/dataset/french_fries/001.jpg
.
.
.
~/dataset/french_fries/100.jpg
.
.
.
'''

We see that in the dataset the folder burger has subfolders defining each individual type of burger while in french fries there are no categories. The training works as follows:
1. It first trains a large outer model which will classify an image into one of the broader categories. Therefore, given a dish the outer model will detect whether it is a burger or a french fry.
2. If the output is french fry, then the prediction stops there since there are no additional categories to look for. However, in case of a burger further predictions are required to determine which exact type of burger it is. For this prediction a sub model focused only on burgers is created by the create_models.sh
3. The script creates an Output_graphs folder which houses the all the models in it e.g. Outer.pb and Outer.txt(For the broader classification), burgers.pb and burgers.txt(For a classification among burgers) and so on.
4. Additionally a temporary folder is also created which houses all the temporary.

NOTE: The creation of models involves a cleaning up of the folder names as they can produce bugs while folder traversal. `sanitize.py` removes all special characters in a folder name and retains all the spaces. Doing so modifies the folder name of the ORIGINAL dataset.  The next step is to predict using the .pb and .txt files generated.
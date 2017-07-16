import sys
import os
import re

# This is a program which is responsible for sanitizing the input names for directory names
# This is done to iron out the bugs faced during directory traversal 
# The program accepts the complete directory path like so 'python sanitie.py /absolute/path/to/directory

dataset_dir=sys.argv[1]

def change_directory_names(directory):
    '''
    This function takes the directory name and removes all special characters except spaces in the names of its subdirectories
    '''
    
    # List all the subdirectories
    sub_directories=os.listdir(directory)
     
    replace_names=[]

    # Find the sub directories, filter out all the special characters and rename the directory
    for i in range(len(sub_directories)):
        string=sub_directories[i]
        temp=re.sub("[^a-zA-Z0-9 ]","",re.sub("[&]","and",string).lower())
        replace_names.append(temp)
        os.rename(os.path.join(directory,string),os.path.join(directory,temp))

def has_subdirectories(directory):
    '''
    This function checks if a directory has subdirectories. Returns True if they exist and False otherwise
    '''
    flag=False
    for i in os.listdir(directory):
        if os.path.isdir(os.path.join(directory,i)):
            flag=True
    
    return flag

for i in os.listdir(dataset_dir):
    abs_path=os.path.join(dataset_dir,i)
    if has_subdirectories(abs_path):
        change_directory_names(abs_path)

change_directory_names(dataset_dir)
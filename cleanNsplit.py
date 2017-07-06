import sys
import os
import magic
# pip install filemagic
import math
import shutil
import argparse
from PIL import Image

def createDirectories(Raw_Dataset, isFlagged=False):
    if isFlagged == False:
        iterPath = iter(os.listdir(Raw_Dataset))
        for RestDir in iterPath:
            trainNval_root_dir = '../Split_Dataset/' + RestDir
            train_dir = trainNval_root_dir + '/Train'
            validation_dir = trainNval_root_dir + '/Validation'
            if not os.path.exists(trainNval_root_dir):
                os.makedirs(trainNval_root_dir)
                os.makedirs(train_dir)
                os.makedirs(validation_dir)
            for dishes in os.listdir('../Raw_Dataset/' + RestDir):
                training_dishes_dirs = train_dir + '/' + dishes
                validation_dishes_dirs = validation_dir + '/' + dishes
                if not os.path.exists(training_dishes_dirs) and not os.path.exists(validation_dishes_dirs):
                    os.makedirs(training_dishes_dirs)
                    os.makedirs(validation_dishes_dirs)
    else:
        l_rawDataSet = Raw_Dataset.split('/')
        RestDir = ''
        if l_rawDataSet[len(l_rawDataSet)-1] == '':
            RestDir = l_rawDataSet[len(l_rawDataSet)-2]
        else:
            RestDir = l_rawDataSet[len(l_rawDataSet)-1]
        trainNval_root_dir = '../Split_Dataset/' + RestDir
        if os.path.isdir(trainNval_root_dir):
            shutil.rmtree(trainNval_root_dir)
        train_dir = trainNval_root_dir + '/Train'
        validation_dir = trainNval_root_dir + '/Validation'
        if not os.path.exists(trainNval_root_dir):
            os.makedirs(trainNval_root_dir)
            os.makedirs(train_dir)
            os.makedirs(validation_dir)
        for dishes in os.listdir(Raw_Dataset):
            training_dishes_dirs = train_dir + '/' + dishes
            validation_dishes_dirs = validation_dir + '/' + dishes
            if not os.path.exists(training_dishes_dirs) and not os.path.exists(validation_dishes_dirs):
                os.makedirs(training_dishes_dirs)
                os.makedirs(validation_dishes_dirs)


def clean(Raw_Dataset, isFlagged):
    for (dirpath, dirnames, filenames) in os.walk(Raw_Dataset):
        for filename in filenames:
            f = os.sep.join([dirpath, filename])
            with magic.Magic(flags=magic.MAGIC_MIME_TYPE) as m:
                fileType = m.id_filename(f)
                if 'text' in fileType:
                    os.remove(f)
                # if 'png' in fileType:
                #     im = Image.open(f)
                #     rgb_im = im.convert('RGB').save(f+'.jpg','JPEG')
                #     im.close()
            if os.path.exists(f) and '.jpg' not in f:
                os.rename(f, f + '.jpg')


def splitData(Raw_Dataset,isFlagged=False, TrainPerc=80.0, ValidationPerc=20.0):
    trainNval_root_dir = ''
    train_dir = ''
    validation_dir = ''
    if isFlagged:
        iterpath = iter(os.walk(Raw_Dataset))
        iterpath.next()
        #For every dish in a given restaurant
        for (DishDirPath,DishDirName,DishFile) in iterpath:
            count = 0
            l_dishDirPath = DishDirPath.split('/')
            trainNval_root_dir = '../Split_Dataset/' + l_dishDirPath[len(l_dishDirPath)-2]
            train_dir = trainNval_root_dir + '/Train'
            validation_dir = trainNval_root_dir + '/Validation'
            total = len(os.listdir(DishDirPath))
            t_num = int(math.ceil(total * (TrainPerc / 100.0)))
            v_num = total - t_num
            #for every file in a dish folder
            for f in os.listdir(DishDirPath):
                dishFilePath = DishDirPath + '/' + str(f)
                if count <= t_num:
                    shutil.copy(dishFilePath, train_dir + '/' + l_dishDirPath[len(l_dishDirPath)-1])
                else:
                    shutil.copy(dishFilePath, validation_dir + '/' + l_dishDirPath[len(l_dishDirPath)-1])
                count += 1
    else:
        iterpath = iter(os.walk(Raw_Dataset))
        Raw_Dataset_root = iterpath.next()[0]
        limit = Raw_Dataset_root.count(os.path.sep)
        for (restaurantsDirPath,restaurantName,files) in iterpath:
            if restaurantsDirPath.count(os.path.sep) == limit:
                Inneriterpath = iter(os.walk(restaurantsDirPath))
                Inneriterpath.next()
                #For every dish in a given restaurant
                for (DishDirPath,DishDirName,DishFile) in Inneriterpath:
                    count = 0
                    l_dishDirPath = DishDirPath.split('/')
                    trainNval_root_dir = '../Split_Dataset/' + l_dishDirPath[len(l_dishDirPath)-2]
                    train_dir = trainNval_root_dir + '/Train'
                    validation_dir = trainNval_root_dir + '/Validation'
                    total = len(os.listdir(DishDirPath))
                    t_num = int(math.ceil(total * (TrainPerc / 100.0)))
                    v_num = total - t_num
                    #for every file in a dish folder
                    for f in os.listdir(DishDirPath):
                        dishFilePath = DishDirPath + '/' + str(f)
                        if count <= t_num:
                            shutil.copy(dishFilePath, train_dir + '/' + l_dishDirPath[len(l_dishDirPath)-1])
                        else:
                            shutil.copy(dishFilePath, validation_dir + '/' + l_dishDirPath[len(l_dishDirPath)-1])
                        count += 1

def getRawDatasetPath():
    parser = argparse.ArgumentParser()
    parser.add_argument("--which_rest",help="Path to new restaurant directory in Raw dataset")
    parser.add_argument("--raw_dir",help="Path to Raw dataset directory")
    args = parser.parse_args()
    if args.raw_dir:
        if args.which_rest:
            print('true')
            return (args.which_rest,True)
        else:
            doubleCheck = str(raw_input("You have not specified which_rest, this will repopulate the training and validation data all over for every restaurant in your raw dataset. Continue? (Y/N) :"))
            if doubleCheck is 'Y':
                if os.path.isdir('../Split_Dataset'):
                    shutil.rmtree('../Split_Dataset/')
                else:
                    if not os.path.exists('../Split_Dataset'):
                        os.makedirs('../Split_Dataset')
            else:
                exit()
            print('false')    
            return (args.raw_dir,False)
    else:
        sys.exit('Error: --raw_dir not specified')

def main():
    # if WHICH_REST specified, use Raw_Dataset ='../Raw_Dataset/restaurantName' and give flag as 1
    # If WHICH_REST not specified, it will delete split data and populate all over again
    (Raw_Dataset_Path,isFlagged) = getRawDatasetPath()
    createDirectories(Raw_Dataset_Path, isFlagged)
    clean(Raw_Dataset_Path, isFlagged)
    splitData(Raw_Dataset_Path,isFlagged, 80, 20)

main()

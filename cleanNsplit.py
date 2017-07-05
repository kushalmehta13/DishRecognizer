import os
import magic
#pip install filemagic
import math
import shutil
def createDirectories(Raw_Dataset,isFlagged = False):
    if isFlagged == False:
        iterPath = iter(os.listdir(Raw_Dataset))
        for RestDir in iterPath:
            trainNval_root_dir = '../Split_Dataset/'+ RestDir
            train_dir = trainNval_root_dir + '/Train'
            validation_dir = trainNval_root_dir + '/Validation'
            if not os.path.exists(trainNval_root_dir):
                os.makedirs(trainNval_root_dir)
                os.makedirs(train_dir)
                os.makedirs(validation_dir)
            for dishes in os.listdir('../Raw_Dataset/'+RestDir):
                training_dishes_dirs = train_dir + '/' + dishes
                validation_dishes_dirs = validation_dir + '/' + dishes
                if not os.path.exists(training_dishes_dirs) and not os.path.exists(validation_dishes_dirs):
                    os.makedirs(training_dishes_dirs)
                    os.makedirs(validation_dishes_dirs)
    else:
        RestDir =  Raw_Dataset.split('/')[2]
        trainNval_root_dir = '../Split_Dataset/'+ RestDir
            #Uncomment this in the future
        # if os.path.isdir(trainNval_root_dir):
            # shutil.rmtree(trainNval_root_dir)
        train_dir = trainNval_root_dir + '/Train'
        validation_dir = trainNval_root_dir + '/Validation'
        if not os.path.exists(trainNval_root_dir):
            os.makedirs(trainNval_root_dir)
            os.makedirs(train_dir)
            os.makedirs(validation_dir)
        for dishes in os.listdir('../Raw_Dataset/'+RestDir):
            training_dishes_dirs = train_dir + '/' + dishes
            validation_dishes_dirs = validation_dir + '/' + dishes
            if not os.path.exists(training_dishes_dirs) and not os.path.exists(validation_dishes_dirs):
                os.makedirs(training_dishes_dirs)
                os.makedirs(validation_dishes_dirs)
    clean(Raw_Dataset,isFlagged)

def clean(Raw_Dataset,isFlagged):
        for (dirpath, dirnames, filenames) in os.walk(Raw_Dataset):
            for filename in filenames:
                f = os.sep.join([dirpath, filename])
                if '.jpg' not in f:
                    os.rename(f,f+'.jpg')
                with magic.Magic(flags=magic.MAGIC_MIME_TYPE) as m:
                    fileType = m.id_filename(f)
                    if 'text' in fileType:
                        os.remove(f)


def splitData(Raw_Dataset,TrainPerc = 80.0,ValidationPerc = 20.0):
    iterpath = iter(os.walk(Raw_Dataset))
    trainNval_root_dir = ''
    train_dir = ''
    validation_dir = ''
    for (DishDirPath,DishDirName,DishFile) in iterpath:
        #Gets only Dishes folders.
        if len(DishDirPath.split('/')) == 3:
            trainNval_root_dir = '../Split_Dataset/' + DishDirPath.split('/')[2]
            train_dir = trainNval_root_dir + '/Train'
            validation_dir = trainNval_root_dir + '/Validation'
        if len(DishDirPath.split('/')) == 4:
            total = len(os.listdir(DishDirPath))
            t_num = int(math.ceil(total * (TrainPerc/100.0)))
            v_num = total - t_num
            count = 0
            for f in os.listdir(DishDirPath):
                dishFilePath = DishDirPath +'/' + str(f)
                if count <= t_num:
                    shutil.copy(dishFilePath,train_dir + '/' + DishDirPath.split('/')[3])
                else:
                    shutil.copy(dishFilePath,validation_dir + '/' + DishDirPath.split('/')[3])
                count += 1



def main():
    #if WHICH_REST specified, use Raw_Dataset ='../Raw_Dataset/restaurantName' and give flag as 1
    #If WHICH_REST not specified, it will delete split data and populate all over again
    doubleCheck =  str(raw_input("You have not specified WHICH_REST, this will repopulate the training and validation data all over for every restaurant in your raw dataset. Continue? (Y/N) :"))
    Raw_Dataset_Path = '../Raw_Dataset'
    if doubleCheck is 'Y':
        if os.path.isdir('../Split_Dataset'):
            shutil.rmtree('../Split_Dataset/')
        else:
            if not os.path.exists('../Split_Dataset'):
                os.makedirs('../Split_Dataset')
    else:
        exit()
    createDirectories(Raw_Dataset_Path,False)
    #createDirectories('../Raw_Dataset',0)
    splitData(Raw_Dataset_Path,80,20)

main()

'''
This script takes in the absolute path of an image, the absolute
path of the trained model and the absolute path to the labels file
as command line arguments.
Once these arguments are provided, the program predicts top 5 matches of a dish in order of the accuracy of the predicitons.


Eg: python predictor.py --imagePath=/home/user/Photos/1.jpg --modelFullPath=/home/user/models/tacoBell.pb --labelsFullPath=/home/user/labels/tacoBellLabels.txt

NOTE: Please use jpg or jpeg files only.

Python 2 packages required:
- numpy
- argparse
- os
- tensorflow


'''

import os
import numpy as np
import tensorflow as tf
import argparse

'''
Everytime a tensorflow program is run, it initializes some memory from the GPU before the
prediction takes place. This process is very time consuming (5 seconds). As a measure to prevent
this delay to take place, we hide the GPU from the script, hence the initialization of memory is avoided
and the delay reduces from 5 seconds to 1 second.
'''
os.environ['CUDA_VISIBLE_DEVICES'] = ''
'''
This hides the verbosity from showing up on the terminal.
'''
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
parser = argparse.ArgumentParser()

'''Expects an absolute path to an image. (eg. /home/user/photos/1.jpg)'''
parser.add_argument("--imagePath",help="Path to image to predict")

'''Expects an absolute path to the trained model. (eg. /home/user/models/tacoBell.pb)'''
parser.add_argument("--modelFullPath",help="Path the saved pb file")

'''Expects an absolute path to the labels file of a restaurant. The labels file has a list of dishes for a restaurant. (eg. /home/user/labels/tacoBellLabels.txt)'''
parser.add_argument("--labelsFullPath",help="Path to the labels for the model")
args = parser.parse_args()
imagePath = args.imagePath
modelFullPath = args.modelFullPath
labelsFullPath = args.labelsFullPath


def create_graph():
    """Creates a graph from saved GraphDef file and returns a saver."""
    # Creates graph from saved graph_def.pb.
    with tf.gfile.FastGFile(modelFullPath, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')


def run_inference_on_image():
    '''Loads the final layer from the trained model and classifies the image.'''
    answer = None

    if not tf.gfile.Exists(imagePath):
        tf.logging.fatal('File does not exist %s', imagePath)
        return answer

    image_data = tf.gfile.FastGFile(imagePath, 'rb').read()

    # Creates graph from saved GraphDef.
    create_graph()

    with tf.Session() as sess:

        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        predictions = sess.run(softmax_tensor,
                               {'DecodeJpeg/contents:0': image_data})
        predictions = np.squeeze(predictions)

        top_k = predictions.argsort()[-5:][::-1]  # Getting top 5 predictions
        f = open(labelsFullPath, 'rb')
        lines = f.readlines()
        labels = [str(w).replace("\n", "") for w in lines]
        for node_id in top_k:
            human_string = labels[node_id]
            score = predictions[node_id]
            print('%s (score = %.5f)' % (human_string, score))

        answer = labels[top_k[0]]
        return answer


if __name__ == '__main__':
    run_inference_on_image()

#!/bin/bash
#!/usr/bin/env python
##############################
### HOW TO USE THIS SCRIPT ###
#
#
#
# ./predictor.sh [Location to image.jpg] [Location to directory which contains restaurant models]
#
#
#
##############################
############  EXAMPLE ########
#
#./predictor.sh /home/user/photos/1.jpg /home/user/restaurant_model
#
##############################
##############################



#Pass path to the image as a command line argument
pathToImage=$1
#Pass path to the restaurant models directory as a commandline argument
pathToRestModel=$2


#Get the closest restaurant to the image. This internally calls restaurantSelector.py
restaurant=$(python restaurantExtractor.py --imagePath="$pathToImage")


#Every restaurant has an outer prediction file, this file is used to classify an image into generic food types.
#(eg. Salad, burger, burrito, sandwich, etc.)
#Outer.pb classifies the image into one of the generic dishes in a restaurant
OuterModel='Outer.pb'
#Outer.txt is the labels file for the generic dishes in the restaurant
OuterLabel='Outer.txt'


#Get absolute paths to the Outer.pb and Outer.txt for a restaurant
pathToOuterModel=$(find "${pathToRestModel}${restaurant}" -name  $OuterModel)
pathToOuterLabel=$(find "${pathToRestModel}${restaurant}"  -name  $OuterLabel)


#Predict the generic food category in which the image resides in. The result is stored in categoryPredictions.txt
CategoryPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath="$pathToOuterModel" --labelsFullPath="$pathToOuterLabel" | tail -5)
catPredClean=$(echo "$dishPred" | cut -f1 -d"(" | rev | cut -d" " -f2-| rev )
echo "$catPredClean" > categoryPredictions.txt


#Top 5 category predictions in array form. Each element of the array is a prediction. Length of array is 5
mapfile -t top5Cat <<< "$CategoryPred"

#Get the mmost confident prediction
topCat=$(echo "$top5Cat" | cut -f1 -d"(" | rev | cut -d" " -f2-| rev )

#Check if an outer category has a more specific prediction file
if [ -e "${pathToRestModel}${restaurant}/$topCat.pb" ]; then
	#Get the absolute path to the inner model for specific dish prediction
	pathToInnerModel=$(find "${pathToRestModel}${restaurant}" -name "$topCat.pb")
	pathToInnerLabel=$(find "${pathToRestModel}${restaurant}" -name "$topCat.txt")

	#Predict the exact dish and store top 5 results in dishPredictions.txt
	dishPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath="$pathToInnerModel" --labelsFullPath="$pathToInnerLabel" | tail -5)
	echo "$dishPred" > dishPredictions.txt

	#Top 5 dish predictions in array form. Each element of the array is a dish prediction. Length of the array is 5
	mapfile -t top5Dish <<< "$dishPred"

	#Get the most confident prediction and store it in a file called prediction.txt
	topDish=$(echo "$top5Dish" | cut -f1 -d"(" | rev | cut -d" " -f2-| rev )
	echo "$restaurant,$topDish" > prediction.txt
else
	#If there is no specific dish prediction file, then the current prediciton is the predicited dish since it is one of a kind and does not
	#fall under generic categories. This can also be used as a fallback model.

	#remove dishPredictions.txt since it contains dishes from the previous predictions.
	if [ -e "dishPredictions.txt" ]; then
	rm dishPredictions.txt
	fi
	#Populate the final prediction into prediction.txt
	echo "$restaurant,$topCat"
	#echo "$restaurant,$topCat" > prediction.txt
fi

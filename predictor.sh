#!/bin/bash
#!/usr/bin/env python
#$1 is the path to the image
pathToImage=$1
pathToRestModel=$2
#This internally calls restaurantSelector.py
restaurant=$(python restaurantExtractor.py --imagePath="$pathToImage")
OuterModel='Outer.pb'
OuterLabel='Outer.txt'
pathToOuterModel=$(find "${pathToRestModel}${restaurant}" -name  $OuterModel)
pathToOuterLabel=$(find "${pathToRestModel}${restaurant}"  -name  $OuterLabel)
CategoryPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath="$pathToOuterModel" --labelsFullPath="$pathToOuterLabel" | tail -5)
echo "$CategoryPred" > categoryPredictions.txt
#echo "Category predictions \n $CategoryPred"
mapfile -t top5Cat <<< "$CategoryPred"
topCat=$(echo "$top5Cat" | cut -f1 -d"(" | rev | cut -d" " -f2-| rev )
if [ -e "${pathToRestModel}${restaurant}/$topCat.pb" ]; then
	pathToInnerModel=$(find "${pathToRestModel}${restaurant}" -name "$topCat.pb")
	pathToInnerLabel=$(find "${pathToRestModel}${restaurant}" -name "$topCat.txt")
	dishPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath="$pathToInnerModel" --labelsFullPath="$pathToInnerLabel" | tail -5)
	echo "$dishPred" > dishPredictions.txt
	#echo "Dish predicitons \n $dishPred"
	mapfile -t top5Dish <<< "$dishPred"
	topDish=$(echo "$top5Dish" | cut -f1 -d"(" | rev | cut -d" " -f2-| rev )
	echo "$restaurant,$topDish" > prediction.txt
else
	echo "$restaurant,$topCat" > prediction.txt
fi
cat prediction.txt 

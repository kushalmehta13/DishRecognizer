#!/bin/bash
#!/usr/bin/env python
#$1 is the path to
pathToImage=$1
pathToRestModel=$2
#path where this file Exists
workingFile=$(find /home/ -name "predictor.sh")
workingDir=$(dirname workingFile)
#This internally calls restaurantSelector.py
restaurant=$(python restaurantExtractor.py --imagePath="$pathToImage")
OuterModel='Outer.pb'
OuterLabel='Outer.txt'
cd "$pathToRestModel"'/'"$restaurant"
pathToOuterModel=$(find . -name  $OuterModel)
pathToOuterLabel=$(find . -name  $OuterLabel)
CategoryPred=$(python $workingDir/predictor.py --imagePath=$pathToImage --modelFullPath=$pathToOuterModel --labelsFullPath=$pathToOuterLabel | tail -5)
echo "The top 5 Categories are:"
echo "$CategoryPred"
mapfile -t top5Cat <<< "$CategoryPred"
topCat=$(echo "$top5Cat" | cut -f1 -d"(")
pathToInnerModel=$(find . -name "$topCat.pb")
pathToInnerLabel=$(find . -name "$topCat.txt")
dishPred=$(python $workingDir/predictor.py --imagePath=$pathToImage --modelFullPath=$pathToInnerModel --labelsFullPath=$pathToInnerLabel | tail -5)
mapfile -t top5Dish <<< "$dishPred"
echo "The dish is: $top5Dish"

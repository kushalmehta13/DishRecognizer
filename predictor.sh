#!/bin/bash
#!/usr/bin/env python
#$1 is the path to the image
pathToImage=$1
pathToRestModel=$2
#This internally calls restaurantSelector.py
restaurant=$(python restaurantExtractor.py --imagePath="$pathToImage")
OuterModel='Outer.pb'
OuterLabel='Outer.txt'
pathToOuterModel=$(find "${pathToRestModel}""${restaurant}" -name  $OuterModel)
pathToOuterLabel=$(find "${pathToRestModel}${restaurant}"  -name  $OuterLabel)
CategoryPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath="$pathToOuterModel" --labelsFullPath="$pathToOuterLabel" | tail -5)
echo "The top 5 Categories are:"
echo "$CategoryPred"
mapfile -t top5Cat <<< "$CategoryPred"
topCat=$(echo "$top5Cat" | cut -f1 -d"(")
pathToInnerModel=$(find "${pathToRestModel}""${restaurant}" -name "$topCat.pb")
pathToInnerLabel=$(find "${pathToRestModel}""${restaurant}" -name "$topCat.txt")
dishPred=$(python predictor.py --imagePath=$pathToImage --modelFullPath=$pathToInnerModel --labelsFullPath=$pathToInnerLabel | tail -5)
mapfile -t top5Dish <<< "$dishPred"
echo "The dish is: $top5Dish"

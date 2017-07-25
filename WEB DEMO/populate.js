
$(document).ready(function(){
  var t1 = new EventSource("/stream");
  var dishLabels = [];
  var dishPred = [];
  var flavorLabels = [];
  var flavorValue = []
  t1.addEventListener("team1",function(e){
    var predictions = e.data;
    var predObj = JSON.parse(predictions);
    var image = predObj.image;
    d = new Date();

    foodImage = document.getElementById('foodImage');
    parentImage = foodImage.parentNode;
    parentImage.removeChild(foodImage);
    foodImage=document.createElement("img");
    foodImage.src = image+"?time="+d.getTime();
    foodImage.height = "1000"
    foodImage.width = "700"
    foodImage.className="img-responsive center-block";
    foodImage.id="foodImage";
    parentImage.appendChild(foodImage);


    p = document.getElementById('predictions');
    parentDiv = p.parentNode;
    parentDiv.removeChild(p);
    p=document.createElement("canvas");
    p.height = "350";
    p.id = 'predictions';
    parentDiv.appendChild(p);



    console.log(image+"?time="+d.getTime());

    var predInner = predObj.prediction;
    for (var dish in predInner){
      dishLabels.push(dish);
      dishPred.push(parseFloat(predInner[dish])*100);
    }
    loadBar(dishLabels,dishPred);
  });
  t1.addEventListener("team3",function(e){
    var flavor = e.data;
    var flavorObj = JSON.parse(flavor);
    for (var f in flavorObj){
      flavorLabels.push(f);
      flavorValue.push(parseFloat(flavorValue[f]));
    }

    f = document.getElementById('flavor');
    parentDiv = f.parentNode;
    parentDiv.removeChild(f);
    f=document.createElement("canvas");
    f.height = "350";
    f.id = 'flavor';
    parentDiv.appendChild(f);


    loadFlavors(flavorLabels,flavorValue);
  });
  $(window).scroll(function() {
      if (isScrolledIntoView('#imageTeam')){
        if (inViewI){ return ;}
        inViewI = true;
        loadBar(dishLabels,dishPred);
      }
      if (isScrolledIntoView('#userTeam')){
        if (inViewU){return ;}
        inViewU = true;
        loadGraphs();
      }
      if (isScrolledIntoView('#flavorTeam')) {
          if (inViewF) { return; }
          inViewF = true;
          loadFlavors(flavorLabels,flavorValue);
      }
    });
});

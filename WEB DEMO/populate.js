
$(document).ready(function(){
  var t1 = new EventSource("/stream");
  var dishLabels = [];
  var dishPred = [];
  var flavorLabels = [];
  var flavorValue = [];
  var spicy = false;
  var cNew = [];
  var cNewVal = [];
  var cOld = [];
  var cOldVal = [];
  var tNew = [];
  var tNewVal = []
  var tOld = [];
  var tOldVal = [];
  var userFlavorLabels = [];
  var userFlavorValue = [];
  t1.addEventListener("team1",function(e){
    dishLabels = [];
    dishPred = [];
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
    flavorLabels = [];
    flavorValue = [];
    var table = document.getElementById("flavorTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    f = document.getElementById('flavor');
    parentDivF = f.parentNode;
    parentDivF.removeChild(f);
    f=document.createElement("canvas");
    f.height = "350";
    f.id = 'flavor';
    parentDivF.appendChild(f);



    var flavor = e.data;
    var flavorObj = JSON.parse(flavor);
    cell1.innerHTML = flavorObj.sweet;
    cell2.innerHTML = flavorObj.rich;
    cell3.innerHTML = flavorObj.salt;
    cell4.innerHTML = flavorObj.umami;
    cell5.innerHTML = flavorObj.bitter;
    cell6.innerHTML = flavorObj.sour;
    for (var f in flavorObj){
      if(f != "spicy")
      {
        flavorLabels.push(f);
        flavorValue.push(parseFloat(flavorObj[f]));
    }
  }
    spicy = flavorObj.spicy;
    // spicy = 1;
    loadFlavors(spicy,flavorLabels,flavorValue);
  });
  t1.addEventListener("team2",function(e){
    cNew = [];
    cNewVal = [];
    cOld = [];
    cOldVal = [];
    tNew = [];
    tNewVal = []
    tOld = [];
    tOldVal = [];
    userFlavorLabels = [];
    userFlavorValue = [];
    f = document.getElementById('userFlav');
    parentDivF = f.parentNode;
    parentDivF.removeChild(f);
    f=document.createElement("canvas");
    f.height = "350";
    f.id = 'userFlav';
    parentDivF.appendChild(f);

    b = document.getElementById('userScore');
    parentDivB = b.parentNode;
    parentDivB.removeChild(b);
    b=document.createElement("canvas");
    b.height = "350";
    b.id = 'userScore';
    parentDivB.appendChild(b);
    var user = e.data;
    var userObj = JSON.parse(user);
    var cuisinenew = userObj.cuisinenew;
    var tagsnew = userObj.tagsnew;
    var cuisineold = userObj.cuisineold;
    var tagsold = userObj.tagsold;
    var uFlavor = userObj.flavor;
    for (c in cuisinenew){
      cNew.push(c);
      cNewVal.push(cuisinenew[c]);
    }
    for (t in tagsnew){
      tNew.push(t);
      tNewVal.push(tagsnew[t]);
    }
    for (c in cuisineold){
      cOld.push(c);
      cOldVal.push(cuisineold[c]);
    }
    for (t in tagsold){
      tOld.push(t);
      tOldVal.push(tagsold[t]);
    }
    for (f in uFlavor){
      if(f != "spicy"){
      userFlavorLabels.push(f);
      userFlavorValue.push(uFlavor[f]);
      }
    }

    loadGraphs(cNew,cNewVal,cOld,cOldVal,tNew,tNewVal,tOld,tOldVal,userFlavorLabels,userFlavorValue);
    // console.log(cNew,cNewVal);
    // console.log(cOld,cOldVal);
    // console.log(tNew,tNewVal);
    // console.log(tOld,tOldVal);
    // console.log(userFlavorLabels,userFlavorValue);



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
        loadGraphs(cNew,cNewVal,cOld,cOldVal,tNew,tNewVal,tOld,tOldVal,userFlavorLabels,userFlavorValue);
      }
      if (isScrolledIntoView('#flavorTeam')) {
          if (inViewF) { return; }
          inViewF = true;
          loadFlavors(spicy,flavorLabels,flavorValue);
      }
    });
});

$document.ready(function(){
  var t1 = new EventSource("/stream");
  t1.addEventListener("team1",function(e){
    var predictions = e.data;
    var predObj = JSON.parse(predictions);
    var image = predObj.image;
    document.getElementById('foodImage').src = image;
    var predInner = predObj.prediction;
    var dishLabels = [];
    var dishPred = [];
    for (var dish in predInner){
      dishLabels.push(dish);
      dishPred.push(parseFloat(predInner[dish])*100);
    }
    loadBar(dishLabels,dishPred);
  })
});

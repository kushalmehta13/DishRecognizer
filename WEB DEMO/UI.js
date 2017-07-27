var inViewF;
var inViewFo;
var inViewU;
var inViewI;
var i;
var s;
$(document).ready(function(){
  i = document.getElementById('spicy');
  s = document.getElementById('spiceText');
  inViewF = false;
  inViewFO = false;
  inViewU = false;
  inViewI = false;
  loadBar();
  $(function() {
    $("#imgDown").on("click", function() {
        $("body").animate({"scrollTop": window.scrollY+1100},0.1);
        return false;
    });
});
  $(function() {
    $("#imgUp").on("click", function() {
        $("body").animate({"scrollTop": window.scrollY-1100},0.1);
        return false;
    });
});
});
function loadBar(dishLabels,dishPred){
  var pred = document.getElementById('predictions').getContext('2d');
  var predChart = new Chart(pred, {
      // The type of chart we want to create
      type: 'bar',
      responsive: true,
      // The data for our dataset
      data: {
          labels: dishLabels,
          datasets: [{
              label: "Confidence Value",
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              pointBackgroundColor: 'rgb(255,99,132)',
              pointBorderColor: 'rgb(255,255,255)',
              pointRadius: 5,
              data: dishPred,
              backgroundColor:['rgba(3,169,244,0.2)','rgb(3,169,244)','rgb(3,169,244)','rgb(3,169,244)','rgb(3,169,244)']
          }]
      },

      // Configuration options go here
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              fontSize: 15
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 15
            }
          }]
        },
        title:{
          display: true,
          text: 'Dish Predictions',
          fontSize: 30
        },
        legend:{
          labels:{
            fontSize: 14,
            usePointStyle: true
          }
        }
      }
  });
}

  function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();


    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
}

function loadG1(tNew,tOld,tNewVal,tOldVal){
    var scores = document.getElementById('userScore').getContext('2d');
    var scoreChart = new Chart(scores,{
      type: 'line',
      responsive: true,
      data: {
        labels: tNew,
        datasets: [{
          label: "User Score",
          borderColor: 'rgb(33,150,243)',
          backgroundColor: 'rgba(33,150,243,0.2)',
          pointBackgroundColor: 'rgb(33,150,243)',
          pointBorderColor: 'rgb(255,255,255)',
          pointRadius: 5,
          data: tOldVal
        },{
          label: "User Score new",
          borderColor: 'rgb(233,30,99)',
          backgroundColor: 'rgba(233,30,99,0.2)',
          pointBackgroundColor: 'rgb(233,30,99)',
          pointBorderColor: 'rgb(255,255,255)',
          pointRadius: 5,
          data: tNewVal
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 15
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 15
            }
          }]
        },
        title:{
          display: true,
          text: 'User Food Tag Score',
          fontSize: 30
        },
        legend:{
          labels:{
            fontSize: 14,
            usePointStyle: true
          }
        }
      }
    });
}

function loadG2(userFlavorLabels,userFlavorValue){
  var scores = document.getElementById('userFlav').getContext('2d');
  var scoreChart = new Chart(scores,{
    type: 'radar',
    responsive: true,
    data: {
      labels: userFlavorLabels,
      datasets: [{
      label: "Flavor Intensity",
      borderColor: 'rgb(3,169,244)',
      backgroundColor: 'rgba(3,169,244,0.2)',
      pointBackgroundColor: 'rgb(3,169,244)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: userFlavorValue
    }]
  },
  options: {
    scales:{
      fontSize: 20
    },
    scale: {
      ticks:{
        // min: 0,
        // max: 10,
        fontSize: 17
      },
      pointLabels:{
        fontSize: 20
      },
    },
    legend: {
      labels:{
        fontSize: 17,
        usePointStyle: true
      }
    },
    title:{
      display: true,
      text: 'User Flavor Profile',
      fontSize: 30
    }
  }
  });
}
function loadCuisine(cNew,cNewVal,cOld,cOldVal){

}

function loadGraphs(cNew,cNewVal,cOld,cOldVal,tNew,tNewVal,tOld,tOldVal,userFlavorLabels,userFlavorValue){
  loadG1(tNew,tOld,tNewVal,tOldVal);
  loadG2(userFlavorLabels,userFlavorValue);
  loadCuisine(cNew,cNewVal,cOld,cOldVal);
}

function loadFlavors(spicy,flavorLabels,flavorValue){
  if (spicy){
    i.style.visibility='visible';
    s.style.visibility='visible';
  }
  var flavor1 = document.getElementById('flavor').getContext('2d');
  var flavChart = new Chart(flavor1 ,{
    type: 'radar',
    responsive: true,
    data: {
      labels: flavorLabels,
      datasets: [{
      label: "Flavor Intensity",
      borderColor: 'rgb(3,169,244)',
      backgroundColor: 'rgba(3,169,244,0.2)',
      pointBackgroundColor: 'rgb(3,169,244)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: flavorValue
    }]
    },
    options: {
      scales:{
        fontSize: 20
      },
      scale: {
        ticks:{
          // min: 0,
          // max: 10,
          fontSize: 17
        },
        pointLabels:{
          fontSize: 20
        },
      },
      legend: {
        labels:{
          fontSize: 17,
          usePointStyle: true
        }
      },
      title:{
        display: true,
        text: 'Flavor Chart',
        fontSize: 30
      }
    }
  });
}

function loadFlavorsOverlap(flavorLabels,flavorValue,userFlavorValue){
  var flavorO = document.getElementById('overlap').getContext('2d');
  var flavChart = new Chart(flavorO ,{
    type: 'radar',
    responsive: true,
    data: {
      labels: flavorLabels,
      datasets: [{
      label: "Dish Flavor Intensity",
      borderColor: 'rgb(3,169,244)',
      backgroundColor: 'rgba(3,169,244,0.2)',
      pointBackgroundColor: 'rgb(3,169,244)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: flavorValue
    },{
      label: "User Flavor Intensity",
      borderColor: 'rgb(233,30,99)',
      backgroundColor: 'rgba(233,30,99,0.2)',
      pointBackgroundColor: 'rgb(233,30,99)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: userFlavorValue
    }]
    },
    options: {
      scales:{
        fontSize: 20
      },
      scale: {
        ticks:{
          // min: 0,
          // max: 10,
          fontSize: 17
        },
        pointLabels:{
          fontSize: 20
        },
      },
      legend: {
        labels:{
          fontSize: 17,
          usePointStyle: true
        }
      },
      title:{
        display: true,
        text: 'Flavor Chart',
        fontSize: 30
      }
    }
  });
}

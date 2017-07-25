var inView = false;
var dLabels, dPred;
var fLabels,fValue;
$(document).ready(function(){
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
  dLabels = dishLabels;
  dPred = dishPred;
  var pred = document.getElementById('predictions').getContext('2d');
  var predChart = new Chart(pred, {
      // The type of chart we want to create
      type: 'bar',
      responsive: true,
      // The data for our dataset
      data: {
          labels: dLabels,
          datasets: [{
              label: "Confidence Value",
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              pointBackgroundColor: 'rgb(255,99,132)',
              pointBorderColor: 'rgb(255,255,255)',
              pointRadius: 5,
              data: dPred,
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
    console.log("doc",docViewTop,docViewBottom);


    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    console.log("elem",docViewTop,docViewBottom);

    return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
}

function loadG1(){
    var scores = document.getElementById('userScore').getContext('2d');
    var scoreChart = new Chart(scores,{
      type: 'line',
      responsive: true,
      data: {
        labels: ["A","B","C","D"],
        datasets: [{
          label: "User Score",
          borderColor: 'rgb(139,195,74)',
          backgroundColor: 'rgba(139,195,74,0.2)',
          pointBackgroundColor: 'rgb(139,195,74)',
          pointBorderColor: 'rgb(255,255,255)',
          pointRadius: 5,
          data: [1,4,6,3]
        },{
          label: "User Score 2",
          borderColor: 'rgb(11,15,52)',
          backgroundColor: 'rgba(11,15,52,0.2)',
          pointBackgroundColor: 'rgb(11,15,52)',
          pointBorderColor: 'rgb(255,255,255)',
          pointRadius: 5,
          data: [0,0,0,0]
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

function loadG2(){
  var scores = document.getElementById('userFlav').getContext('2d');
  var scoreChart = new Chart(scores,{
    type: 'radar',
    responsive: true,
    data: {
      labels: ["Sweet" , "Rich" , "Salt" , "Umami" , "Bitter" , "Sour" ],
      datasets: [{
      label: "Flavor Intensity",
      borderColor: 'rgb(3,169,244)',
      backgroundColor: 'rgba(3,169,244,0.2)',
      pointBackgroundColor: 'rgb(3,169,244)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: [2,4,2,3,5,4]
    }]
  },
  options: {
    scales:{
      fontSize: 20
    },
    scale: {
      ticks:{
        min: 0,
        max: 10,
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

function loadGraphs(){
  loadG1();
  loadG2();
//  loadG3();
}

function loadFlavors(flavorLabels,flavorValue){
  fLabels = flavorLabels;
  fValue = flavorValue;
  var flavor1 = document.getElementById('flavor').getContext('2d');
  var flavChart = new Chart(flavor1 ,{
    type: 'radar',
    responsive: true,
    data: {
      labels: fLabels,
      datasets: [{
      label: "Flavor Intensity",
      borderColor: 'rgb(3,169,244)',
      backgroundColor: 'rgba(3,169,244,0.2)',
      pointBackgroundColor: 'rgb(3,169,244)',
      pointBorderColor: 'rgb(255,255,255)',
      pointRadius: 5,
      data: fValue
    }]
    },
    options: {
      scales:{
        fontSize: 20
      },
      scale: {
        ticks:{
          min: 0,
          max: 10,
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

// function checkAndAnimateGraph(){
//   if (isScrolledIntoView('#imageTeam')){
//     loadBar();
//   }
//   if (isScrolledIntoView('#userTeam')){
//     loadGraphs();
//   }
//   if (isScrolledIntoView('#flavorTeam')){
//     loadFlavors();
//   }
// }

$(window).scroll(function() {
    if (isScrolledIntoView('#imageTeam')){
      loadBar(dLabels,dPred);
    }
    if (isScrolledIntoView('#userTeam')){
      loadGraphs();
    }
    if (isScrolledIntoView('#flavorTeam')) {
        if (inView) { return; }
        inView = true;
        loadFlavors(fLabels,fValue);
    //     var flavor1 = document.getElementById('flavor').getContext('2d');
    //     var flavChart = new Chart(flavor1 ,{
    //       type: 'radar',
    //       responsive: true,
    //       data: {
    //         labels: ["Sweet" , "Rich" , "Salt" , "Umami" , "Bitter" , "Sour" ],
    //         datasets: [{
    //         label: "Flavor Intensity",
    //         borderColor: 'rgb(3,169,244)',
    //         backgroundColor: 'rgba(3,169,244,0.2)',
    //         pointBackgroundColor: 'rgb(3,169,244)',
    //         pointBorderColor: 'rgb(255,255,255)',
    //         pointRadius: 5,
    //         data: [2,4,2,3,5,4]
    //       }]
    //       },
    //       options: {
    //         scales:{
    //           fontSize: 20
    //         },
    //         scale: {
    //           ticks:{
    //             min: 0,
    //             max: 10,
    //             fontSize: 17
    //           },
    //           pointLabels:{
    //             fontSize: 20
    //           },
    //         },
    //         legend: {
    //           labels:{
    //             fontSize: 17,
    //             usePointStyle: true
    //           }
    //         },
    //         title:{
    //           display: true,
    //           text: 'Flavor Chart',
    //           fontSize: 30
    //         }
    //       }
    //     });
    //   }
    //    else {
    //     inView = false;
    }
  });

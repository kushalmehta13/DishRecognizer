var pred = document.getElementById('predictions').getContext('2d');
var flavor1 = document.getElementById('flavor').getContext('2d');
var predChart = new Chart(pred, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Confidence Value",
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointBackgroundColor: 'rgb(255,99,132)',
            pointBorderColor: 'rgb(255,255,255)',
            pointRadius: 5,
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 20
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 20
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
var flavChart = new Chart(flavor1 ,{
  type: 'radar',
  animate:{
  duration: 1000,
  animateScale: true,
  animationSteps: 15
  },
  data: {
    labels: ["Sweet" , "Rich" , "Salt" , "Umami" , "Bitter" , "Sour" ],
    datasets: [{
    label: "Flavor Intensity",
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255,99,132,0.2)',
    pointBackgroundColor: 'rgb(255,99,132)',
    pointBorderColor: 'rgb(255,255,255)',
    pointRadius: 5,
    data: [2,4,6,8,9]
  },{
    label: "Intensity",
    borderColor: 'rgb(220, 150, 3)',
    backgroundColor: 'rgba(220, 150, 3,0.2)',
    pointBackgroundColor: 'rgb(220, 150, 3)',
    pointBorderColor: 'rgb(255,255,255)',
    pointRadius: 5,
    data: [6,3,7,1,5]
  }]
  },
  options: {
    scale: {
      ticks:{
        min: 0,
        max: 10
      },
      pointLabels:{
        fontSize: 15
      },
    },
    legend: {
      labels:{
        fontSize: 14,
        usePointStyle: true
      }
    },
    title:{
      display: true,
      text: 'Flavor Chart',
      fontSize: 30
    },
    animateScale: true
  }
})

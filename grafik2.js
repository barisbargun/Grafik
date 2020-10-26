let discipline = [
    // "triathlon",
    // "badminton",
    // "fencing",
    // "rowing",
    // "handball",
    // "cycling",
    // "gymnastics"
  ];

dataArray = [];

let data = [{
  name:"triathlon",
  values:[13,15,16,17,18,20,22,24,25,27,28,32,33,35,36,37,38,40,42,44,45,48,53]
},{
  name:"badminton",
  values:[15,16,17,18,19,20,22,24,27,28,29,32,36,42,44]
}
]

for(i=0;i<data.length;i++){
  discipline.push(data[i].name);
  dataArray.push(data[i].values);
};

  Highcharts.getJSON(
    "https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/densityMaleData.json?callback=?",
    function (dataJson) {
      redrawing = false;
      //Create the series data from the data source
      // let dataArray = [];
      // for (i = 0; i < discipline.length; i++) {
      //   dataArray.push([]);
      // }
      // dataJson.forEach((e) => {
      //   discipline.forEach((key, value) => {
      //     if (e.sport == key) {
      //       dataArray[value].push(e.weight);
      //     }
      //   });
      // });

      //Process density data
      let step = 1,
        precision = 0.00000000001,
        width = 15;

      let data = processDensity(
        step,
        precision,
        width,
        dataArray[0], //triathlon,
        dataArray[1], //badminton,
        // dataArray[2], //fencing,
        // dataArray[3], //rowing,
        // dataArray[4], //handball,
        // dataArray[5], //cycling,
        // dataArray[6] //gymnastics

      );

      //Structure the data to create the chart
      let chartsNbr = data.results.length;
      let xi = data.xiData;
      let stat = data.stat;
  
      //Create the series
      let dataSeries = [],
        series = [];
      data.results.forEach((e, i) => {
        dataSeries.push([]);
        dataSeries[i] = e;
        series.push({
          data: dataSeries[i],
          name: discipline[i],
          zIndex: chartsNbr - i
        });
      });
      
      Highcharts.chart("container", {
        chart: {
          type: "areasplinerange",
          animation: true,
          events: {
            render() {
              if (!redrawing) {
                redrawing = true;
  
                this.series.forEach((s) => {
                  s.update({
                    fillColor: {
                      linearGradient: [0, 0, this.plotWidth, 0],
                      stops: [
                        [0, Highcharts.color("yellow").setOpacity(0).get("rgba")],
                        [0.25, "#FFA500"], //orange
                        [0.5, "#FF0033"], //red
                        [0.75, "#7A378B"] //purple
                      ]
                    }
                  });
                });
                redrawing = false;
              }
            }
          }
        },
        title: {
          text: "The 2012 Olympic male athletes weight"
        },
        xAxis: {
          labels: { format: "{value} kg" }
        },
  
        yAxis: {
          title: { text: null },
          categories: discipline,
          max: data.results.length,
          labels: {
            formatter: function () {
              if (this.pos < chartsNbr) return this.value;
            },
            style: {
              textTransform: "capitalize",
              fontSize: "9px"
            }
          },
          startOnTick: true,
          gridLineWidth: 1,
          tickmarkPlacement: "on"
        },
        tooltip: {
          useHTML: true,
          shared: true,
          crosshairs: true,
          valueDecimals: 3,
          headerFormat: null,
          pointFormat: "<b>{series.name}</b>: {point.x} kg <br/>",
          footerFormat: null
        },
        plotOptions: {
          areasplinerange: {
            marker: {
              enabled: false
            },
            states: {
              hover: {
                enabled: false
              }
            },
            pointStart: xi[0],
            animation: {
              duration: 0
            },
            fillColor: "",
            lineWidth: 1,
            color: "black"
          }
        },
        legend: {
          enabled: false
        },
        series: series
      });
    }
  );
  
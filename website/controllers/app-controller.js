// Version:1.0.0
// Developer: Delinet

//app-controller

console.log(":/> app-controller");

let totale;
const dataToBind = {};

const stringReverse = function(stringToReverse){
    let stringToArray = stringToReverse.split("-");
    stringToArray = stringToArray.reverse();
    return stringToArray.join(".");
} // stringToReverse

const positiviTamponiCalculator = function(index){
    /* percentualePositiviTamponi */
    let incrementoTamponi = totale[index].tamponi - totale[index-1]["tamponi"];
    return ((totale[index].nuovi_positivi / incrementoTamponi)*100).toFixed(2);
} // positiviTamponiCalculator

const prepareData = function(){
    /* dailyDate */
    dataToBind["dailyDate"] = stringReverse(totale[totale.length-1].data.substring(0,10));

    /* incrementoPositivi */
    dataToBind["incrementoPositivi"] = "+" + totale[totale.length-1].nuovi_positivi;

    /* terapiaIntensiva */
    dataToBind["terapiaIntensiva"] = totale[totale.length-1].terapia_intensiva;
    if (totale[totale.length-1].terapia_intensiva > totale[totale.length-2]["terapia_intensiva"]){
        dataToBind["iconTerapiaIntensiva"] = "arrow-up";
    }
    else {
        dataToBind["iconTerapiaIntensiva"] = "arrow-down";
    }

    /* percentualePositiviTamponi */
    // let incrementoTamponi = totale[totale.length-1].tamponi - totale[totale.length-2]["tamponi"];
    // console.log(incrementoTamponi)
    // dataToBind["percentualePositiviTamponi"] = ((totale[totale.length-1].nuovi_positivi / incrementoTamponi)*100).toFixed(2) + "%";
    dataToBind["percentualePositiviTamponi"] = positiviTamponiCalculator(totale.length-1);

    dataForChart();

} // prepareData

/******************************** Chart Rendering ************************************/

const dataForChart = function() {
    /* Chart: Terapia Intensiva */
    let arrayData = [];
    let arrayLabel = [];
    for(let i=totale.length-7; i<totale.length; i++){
        arrayData.push(totale[i].terapia_intensiva);
        arrayLabel.push(stringReverse(totale[i].data.substring(0,10)));
        
    } 
    dataToBind["terapiaIntensivaData"] = arrayData;
    dataToBind["terapiaIntensivaLabel"] = arrayLabel;

    /* Chart: Positivi su Tamponi */
    arrayData = [];
    for(let i=totale.length-7; i<totale.length; i++){
        arrayData.push(positiviTamponiCalculator(i));
    } 
    dataToBind["positiviTamponiData"] = arrayData;
    dataToBind["positiviTamponiLabel"] = arrayLabel;
}; // dataForChart


const renderLineChart = function(){
    var ctx = document.getElementById('terapiaIntensivaChart');
    data = {
        labels: dataToBind.terapiaIntensivaLabel,
        datasets:[{
            label: 'Terapia Intensiva',
            data: dataToBind.terapiaIntensivaData,
            borderColor:'rgba(204, 209, 255, 1)',
            borderWidth:5,
            pointRadius:3,
            fill:false
        }]
    };
    options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

    var ctx = document.getElementById('positiviTamponiChart');
    data = {
        labels: dataToBind.positiviTamponiLabel,
        datasets:[{
            label: 'Positivi su Tamponi',
            data: dataToBind.positiviTamponiData,
            borderColor:'rgba(204, 209, 255, 1)',
            borderWidth:5,
            pointRadius:3,
            fill:false
        }]
    };
    options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}; // renderLineChart


/*************************************************************************************/



let App={};
const init = function(){
    prepareData();
    App = Vue.createApp({
        data() {
            return {
                dailyDate:dataToBind.dailyDate,
                incrementoPositivi:dataToBind.incrementoPositivi,
                terapiaIntensiva:dataToBind.terapiaIntensiva,
                iconTerapiaIntensiva:dataToBind.iconTerapiaIntensiva,
                percentualePositiviTamponi:dataToBind.percentualePositiviTamponi
            }
        },
        mounted() {
            renderLineChart();
        }
    }); // App Object
};// init

// fetch data source
const datasourceURI = "../dataSource.json";
console.log("FETCH");
fetch(datasourceURI,{})
    .then(response => {
        console.log(response);
        totale = response;
        console.log(totale);
        init();
    });





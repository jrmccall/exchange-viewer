import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Chart} from 'chart.js';
import {OrderBook} from "../../library/order-book.model";


/**
 * Generated class for the PairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pair',
  templateUrl: 'pair.html',
})
export class PairPage {

  @ViewChild('chartCanvas') chartCanvas;

  lineChart: any;
  pair: OrderBook;
  bids: any[];
  xAxisString: string = 'Price of Coin';
  sum: number = 0;
  sumAt40PercentOfTopPrice: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pair = this.navParams.data;
    console.log(this.pair);
    //console.log(this.bids);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PairPage');
    this.createBidObjectList();
    console.log(this.bids);
    this.loadChart();
  }

  loadChart(){

    const timeFormat = 'MM/DD/YYYY HH:mm';

    this.lineChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: "Sum",
            fill: 'origin',
            data: this.bids,
            backgroundColor: "rgba(75,192,192, 1)",
            pointRadius: 1
          }
        ]
      },
      options: {
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'linear',
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: this.xAxisString
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: this.sumAt40PercentOfTopPrice
            },
            scaleLabel: {
              display: true,
              labelString: 'Sum (Coin)'
            }
          }]
        }
      }
    });

    // this.dataset$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
    //   const ci = this.lineChart;
    //   ci.data.datasets[0].data = datasets;
    //   ci.update();
    // });

  }

  createBidObjectList(){
    let sum = 0;
    let string = this.xAxisString;
    let topPrice = this.pair.bids[0][0];
    let sumAtPercent = 0;
    //This is for graphs whose prices are so small that chart.js won't display them
    let multiplier = 1;
    if(this.pair.bids[0][0] < 0.000000001){
      multiplier = 1000000;
      string = 'Price of Coin (e-6)';
    }
    else if(this.pair.bids[0][0] < 0.000001){
      multiplier = 1000;
      string = 'Price of Coin (e-3)';
    }
    this.bids = this.pair.bids.map(function(current, index, array){
      let price = +current[0]*multiplier;
      let amount = +current[1];
      sum += amount;
      if(price/(topPrice*multiplier) < .45 && price/(topPrice*multiplier) > .35){
        sumAtPercent = sum;
      }
      let obj = {
        'x': price,
        'y': sum
      };

      return obj;
    }).sort(function(a,b) {return a.x-b.x});
    this.xAxisString = string;
    this.sum = sum;
    this.sumAt40PercentOfTopPrice = sumAtPercent;
  }

}

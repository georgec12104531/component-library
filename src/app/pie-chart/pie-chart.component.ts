import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public options: any = {
    chart: {
      type: 'scatter',
      height: 700
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          'y: ' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
      },
      {
        name: 'Abnormal',
        turboThreshold: 500000,
        data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
      }
    ]
  }
  constructor() { }

  ngOnInit(){
    Highcharts.chart('container', this.options);
  }

  @Input() options;
	@Input() userActivityData;
	@ViewChild('chartArea') chartArea:ElementRef

	private titleHtml: string;
	private chartColorPalette: ChartColorPalette;

	constructor() {
	}
	
	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		if (changes["userActivityData"] && !changes['userActivityData'].firstChange) {
			this.userActivityData = changes["userActivityData"].currentValue;	 
			this.chartColorPalette = this.setColorPalette(this.userActivityData.partnerColorPalette);
			this.options = this.generateChartOptions(this.userActivityData, this.chartColorPalette);
			this.setId(this.userActivityData.id);
			Highcharts.chart(this.userActivityData.id, this.options);
		}
	}

	ngOnInit() {
		this.chartColorPalette = this.setColorPalette(this.userActivityData.partnerColorPalette);
		this.options = this.generateChartOptions(this.userActivityData, this.chartColorPalette);
		this.setId(this.userActivityData.id);
		Highcharts.chart(this.userActivityData.id, this.options);
	}

	setId(id) {
		this.chartArea.nativeElement.id = id;
	}

	setColorPalette(chartColorPalette) {
		return {	
			primaryColor: chartColorPalette.primaryColor,
			secondaryColor: chartColorPalette.secondaryColor,
			tertiaryColor: UtilityService.addOpacity(chartColorPalette.primaryColor, 20),
			quaternaryColor: UtilityService.addOpacity(chartColorPalette.primaryColor, 40),
		}
	}

	generateChartOptions(data, colorPalette) {
		// Add more properties if needed
		const titleHtml = this.generateTitleHtml(data, colorPalette);
		const value1 = UtilityService.toInt(data.value1);
		const remainder = this.generatePercentageRemainder(value1);
		const outerChartColor = colorPalette.quaternaryColor;
		const innerRemainderChartColor = colorPalette.tertiaryColor;
		//Fix to reduce chart slice at 0%
		let innerChartColor;
		if (data.value1 === 0) {
			innerChartColor = colorPalette.tertiaryColor
		} else {
			innerChartColor = colorPalette.primaryColor;
		}

		return {   
			chart : {
				 styleMode: true,
				 margin: [20, 20, 20, 20],
				 reflow: true,
				 height: 300,
			},
			credits: {
				enabled: false
			},
			title: {
				text: titleHtml,
				useHTML: true,
				align: 'center',
				verticalAlign: 'middle',
				y: -35,
			},
			tooltip : {
				enabled: false,
			},
			plotOptions : {
				 pie: {
						borderWidth: 0,
						borderColor: null,
						center: ['50%', '50%'],
						size:'50%',
						innerSize: '100%',
						states: {
							hover: {
								enabled: false
							}
						},
						cursor: '',
						dataLabels: {
								enabled: false,
						},
						tooltip: { 
							enabled: false 
						}
				} 
			},
			series: [{
				type: 'pie',
				label: {
				enabled: false,
				},
				innerSize: 193,
				size: 243,
				data: [
					{
						y: 100.0,
						color: outerChartColor,
					}
				],
			}, 
			{
				type: 'pie',
				label: {
				 enabled: false,
				},
				innerSize: 143,	
				size: 193,
				data: [
					{
						y: remainder,
						color: innerRemainderChartColor
					},
					{
						y: value1,
						color: innerChartColor
					},		
				]
			}]
	 }
	}

	generateTitleHtml(data, colorPalette) {
		const name = data.name;
		const value1 = this.formatNumStrWithoutSymbol(data.value1, data.format1);
		const value2 = this.formatNumStrWithSymbol(data.value2, data.format2);
		const color = colorPalette.secondaryColor;
		this.titleHtml = `<div class="user-performance-chart-title-container"><div class="user-performance-chart-sub-title-one" style="color:${color}">${name}</div><div class="user-performance-chart-title-one" style="color: ${color};">${value1}</div><div class="user-performance-chart-sub-title-two" style="color: ${color};">${value2}</div></div>`		

		return this.titleHtml
	}

	generatePercentageRemainder(value) {
		const num = UtilityService.toInt(value);
		const remainder = 100 - num;
		return remainder;
	}

	formatNumStrWithSymbol(numStr, format) {
		const int = UtilityService.toInt(numStr)
	
		if (int < 0) {
			let negNumStrWithCommas = UtilityService.numberWithCommas(numStr.toString().split("-")[1]);
			return "-" + `${format.prepend}` + `${negNumStrWithCommas}` + `${format.append}`;
		} else if (int === 0) {
			return `${format.prepend}` + `${numStr}` + `${format.append}`;
		} else {
			let posNumStrWithCommas = UtilityService.numberWithCommas(numStr.toString())
			return "+" + `${format.prepend}` + `${posNumStrWithCommas}` + `${format.append}`;
		}
	}

	formatNumStrWithoutSymbol(numStr, format) {
		const numStrWithCommas = UtilityService.numberWithCommas(numStr);

		return `${format.prepend}` + `${numStrWithCommas}` + `${format.append}`;
	}

}

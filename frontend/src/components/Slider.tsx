import React from 'react';
// @ts-nocheck

import CanvasJSReact from '../assets/canvasjs.stock.react';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function Slider(props: any) {

    const options = {
        height: 300,
        animationEnabled: true,
        exportEnabled: true,
        charts: [{
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                crosshair: {
                    enabled: true,
                    //snapToDataPoint: true
                }
            },
            data: [{
                type: "spline",
                dataPoints: props.signal
            }]
        }],
        navigator: {
          height: 100
        },
        rangeSelector: {
            inputFields: {
                startValue: 4000,
                endValue: 6000,
                valueFormatString: "###0"
            },

            buttons: [{
                label: "1000",
                range: 1000,
                rangeType: "number"
            },{
                label: "2000",
                range: 2000,
                rangeType: "number"
            },{
                label: "5000",
                range: 5000,
                rangeType: "number"
            },{
                label: "All",
                rangeType: "all"
            }]
        }
    };
    return (
        <div style={{margin: '5px', height: props.height}}>
            <div>
                <CanvasJSStockChart options={options}
                />
            </div>
        </div>
    );
}


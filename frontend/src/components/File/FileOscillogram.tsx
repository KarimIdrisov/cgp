import React from 'react';

import CanvasJSReact from '../../assets/canvasjs.react';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function FileOscillogram(props: any) {

    console.log(props.signal)

    const options = {
        animationEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        axisY: {
            title: props.name,
        },
        axisX: {
        },
        data: [{
            type: "line",
            dataPoints: props.signal,
            xValueType: "dateTime",
        }]
    }

    return (
        <div style={{margin: '5px'}}>
            <CanvasJSChart options = {options}
                /* onRef={ref => this.chart = ref} */
            />
        </div>
    );
}


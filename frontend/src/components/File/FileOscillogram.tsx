import React from 'react';

import CanvasJSReact from '../../assets/canvasjs.react';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function FileOscillogram(props: any) {

    const options = {
        animationEnabled: true,
        zoomEnabled:true,
        height: props.height,
        theme: "light2", // "light1", "dark1", "dark2"
        axisY: {
            title: props.name,
        },
        axisX: {
        },
        data: [{
            type: "line",
            dataPoints: props.signal.slice(props.min, props.max),
            xValueType: "dateTime",
        }],
    }

    return (
        <div style={{margin: '5px', height: props.height}}>
            <CanvasJSChart options = {options}
                /* onRef={ref => this.chart = ref} */
            />
        </div>
    );
}


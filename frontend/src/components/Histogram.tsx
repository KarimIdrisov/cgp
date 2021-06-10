import React, {useEffect} from 'react';

import CanvasJSReact from '../assets/canvasjs.react';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Histogram(props: any) {
    const [signal, setSignal] = React.useState()

    useEffect(() => {

    }, []);


    const options = {
        height: 200,
        width: 200,
        animationEnabled: false,
        exportEnabled: false,
        data: [{
            type: "column",
            color: "#888888",
            dataPoints: props.histogram
        }]
    };
    return (
        <div>
            <div>
                <CanvasJSChart options={options}/>
            </div>
        </div>
    );
}


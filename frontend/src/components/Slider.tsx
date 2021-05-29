import React, {useEffect} from 'react';
// @ts-nocheck

import CanvasJSReact from '../assets/canvasjs.stock.react';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function Slider(props: any) {
    const [signal, setSignal] = React.useState()

    useEffect(() => {
        const tmp = []
        for (let i = 0; i < props.signal.length; i++) {
            tmp.push({
                x: new Date(props.signal[i]['x']),
                y: 0
            })
        }

        // @ts-ignore
        setSignal(tmp)
    }, []);


    const options = {
        height: props.height,
        animationEnabled: false,
        exportEnabled: false,
        rangeChanged: props.sync,
        charts: [{
            data: [{
                dataPoints: signal
            }]
        }],
        navigator: {
            height: 52,
            data: [{
                dataPoints: signal
            }],
        },
    };
    return (
        <div style={{margin: '5px', height: props.height}}>
            <div>
                <CanvasJSStockChart options={options} onRef={(ref: any) => props.updateRef(ref)}
                />
            </div>
        </div>
    );
}


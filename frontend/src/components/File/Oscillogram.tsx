import React, {useEffect, useState} from 'react';

import CanvasJSReact from '../../assets/canvasjs.react';
import {Menu, MenuItem} from "@material-ui/core";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function Oscillogram(props: any) {

    const [state, setState] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialState);

    const handleClose = () => {
        setState(initialState);
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function deleteOscillogram() {
        setState(initialState);
        props.deleteOscillogram(props.name)
    }

    const [data, setData] = useState([])

    useEffect(() => {
        const tmp = []
        if (props.fd > 1) {
            for (let i = 0; i < props.signal.length; i = i + 1) {
                tmp.push({
                    'x': props.speechData[i],
                    'y': props.signal[i]['y'],
                })
            }
            // @ts-ignore
            setData(tmp)
        } else {
            setData(props.signal)
        }
    }, []);


    const options = {
        animationEnabled: false,
        zoomEnabled: true,
        height: props.height,
        theme: "light2", // "light1", "dark1", "dark2"
        axisY: {
            title: props.name,
        },
        rangeChanged: props.sync,
        axisX: {
            gridThickness: 1,
            lineThickness: 1,
            viewportMinimum: props.min !== 0 ? props.min : null,
            viewportMaximum: props.max !== 0 ? props.max : null
        },
        data: [{
            type: (props.source === "Задержанный единичный импульс" || props.source === 'Задержанный единичный скачок') ? 'column' : (props.spline ? 'spline' : 'line'),
            dataPoints: data,
            xValueType: "dateTime",
            markerType: "circle",
            markerSize: props.markers ? 8 : 0,
        }],
    }
    return (
        <div style={{margin: '5px', height: props.height, cursor: 'context-menu'}} onContextMenu={handleClick}>
            <CanvasJSChart id={props.name} options={options} onRef={(ref: any) => props.updateRef(ref)}
            />

            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? {top: state.mouseY, left: state.mouseX}
                        : undefined}>
                <MenuItem onClick={deleteOscillogram}>Удалить осцилограмму</MenuItem>
                {/*<MenuItem onClick={props.getStatistic(props.name)}>Статистика</MenuItem>*/}
            </Menu>
        </div>
    );
}


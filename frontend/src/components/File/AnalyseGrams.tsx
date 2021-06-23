import React from 'react';

import CanvasJSReact from '../../assets/canvasjs.react';
import {Menu, MenuItem, Typography} from "@material-ui/core";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function AnalyseGrams(props: any) {

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
        props.deleteAnalyse(props.name)
    }

    const options = {
        animationEnabled: false,
        zoomEnabled: true,
        height: props.height,
        theme: "light2", // "light1", "dark1", "dark2"
        axisY: {
            title: props.name,
            logarithmic: props.log
        },
        rangeChanged: props.sync,
        axisX: {
            gridThickness: 1,
            lineThickness: 1,
            viewportMinimum: props.min !== 0 ? props.min : null,
            viewportMaximum: props.max !== 0 ? props.max : null
        },
        data: [{
            type: 'line',
            dataPoints: props.current === 'amplitudeSpectre' ? props.signal : props.power,
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


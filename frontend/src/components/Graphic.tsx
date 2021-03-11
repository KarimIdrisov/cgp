import React from 'react';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
    canvas: {
        width: "200px",
        height: "200px",
    }
}));

export default function Graphic(props: any) {
    const classes = useStyles();

    const Chart = require('chart.js');
    console.log(props.id)
    const ctx = document.getElementById(props.id.toString());
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, 1],
            datasets: [{
                label: '# of Votes',
                data: [0, 1],
                borderColor: [
                    'rgb(72,70,70)'
                ],
                pointStyle: "line",
                tension: "0.1",
                cubicInterpolationMode: "monotone",
                fill: "false",
            }]
        },
    });

    return (
        <>
            <div className={classes.border}>
            </div>
        </>
    );
}

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
}));

export default function Graphic(props: any) {
    const classes = useStyles();


    const Chart = require('chart.js');
    const ctx = document.getElementById(props.id.toString());
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: props.times,
            datasets: [{
                label: props.id,
                data: props.data,
                borderColor: [
                    'rgb(72,70,70)'
                ],
                pointStyle: "line",
                tension: "0.1",
                cubicInterpolationMode: "monotone",
                fill: "false",
            }]
        },
        options: {
            legend: {
                onClick: () => {
                    console.log('click')
                }
            },
            scales: {
                xAxes: [ {
                    ticks: {
                        display: true
                    }
                } ],
                yAxes: [ {
                    ticks: {
                        display: false
                    }
                } ]
            },
            animation: {
                duration: 0 // general animation time
            },
            hover: {
                animationDuration: 0 // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0 // animation duration after a resize

        }
    });

    return (
        <></>
    );
}

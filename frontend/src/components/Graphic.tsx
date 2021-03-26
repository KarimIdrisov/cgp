import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import axios from "axios";



const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
}));

export default function Graphic(props: any) {
    const classes = useStyles();
    const [signal, setSignal] = useState({
        signalData: Array,
        times: Array,
    });

    const [loading, setLoading] = useState(false)

    useEffect( () => {
        setLoading(true)
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-signal-sidebar/?file=' + props.file + "&signal=" + props.id);
            setSignal({
                signalData: result.data.signalData,
                times: result.data.times
            });
        }

        getData();
        setLoading(false)

    }, [])

    if (!loading) {

        const Chart = require('chart.js');
        const ctx = document.getElementById(props.id.toString());
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: signal.times,
                datasets: [{
                    label: props.id,
                    data: signal.signalData,
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
                tooltips: {enabled: false},
                scales: {
                    xAxes: [ {
                        ticks: {
                            display: true,
                            stepSize: 10000
                        }
                    } ],
                    yAxes: [ {
                        ticks: {
                            display: false,
                            stepSize: 10000
                        }
                    } ]
                },
                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0,
                    mode: null// duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize

            }
        });
    }

    return (
        <></>
    );
}

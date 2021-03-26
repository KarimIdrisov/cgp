import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import axios from "axios";

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {Button, IconButton} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
    toolbar: {
        margin: "20px",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
}));

interface Signal {
    signalData: number[],
    times: Date[]
}

export default function Oscillogram(props: any) {
    const classes = useStyles();
    const [signal, setSignal] = useState<Signal | any>();
    const history = useHistory();

    let options = {}
    if (signal) {
        options = {
            chart: {
                zoomType: "xy"
            },
            title: {
                text: props.id
            },
            xAxis: {
                title: {
                    text: 'Время'
                },
                categories: signal.times.slice(props.min, props.max),
                type: 'datetime',
                resize: {
                    enabled: true
                }
            },
            yAxis: {
                title: {
                    text: 'F(x)'
                },
                type: 'linear',
            },
            series: [{
                name: props.id,
                data: signal.signalData.slice(props.min, props.max),
            }]
        };
    }

    // console.log(signal.signalData.slice(props.min, props.max),props.min, props.max)

    function deleteOscillogram() {
        const oldChannels = window.location.href.slice(28)
        const newChannels = oldChannels.split(';').filter(item => props.id !== item)
        if (newChannels.length === 0) {
            history.push('/modeling/' + localStorage.getItem("file"))
        } else {
            history.push('/grams/' + newChannels)
        }
    }

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-signal-sidebar/?file=' + props.file + "&signal=" + props.id);
            setSignal({
                signalData: result.data.signalData,
                times: result.data.times
            });
        }

        getData();

    }, [])

    return (
        <>
            {(signal?.signalData && signal.signalData.length > 1) ? (
                    <>
                        <div className={classes.toolbar}>
                            <Button onClick={deleteOscillogram}>
                                <DeleteForeverIcon/>
                            </Button>
                        </div>
                        <HighchartsReact constructorType={'stockChart'} highcharts={Highcharts} options={options}/>
                    </>)
                : <></>}
        </>
    );
}

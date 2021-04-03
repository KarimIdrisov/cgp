import {makeStyles} from '@material-ui/core/styles';
import React, {createRef, useEffect, useState} from 'react';
import axios from "axios";

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
    toolbar: {
        margin: "20px",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    active: {
        backgroundColor: "gray"
    },
    gram: {
        width: "100%",
        position: 'absolute'
    }
}));

interface Signal {
    signalData: number[],
    times: Date[],
    dateTimes: Date[]
}

export default function Minigram(this: any, props: any) {
    const classes = useStyles();
    const [signal, setSignal] = useState<Signal | any>();
    const history = useHistory();
    const [showMarkers, setShow] = useState(false)
    const [send, setState] = useState(false)

    let options = {}
    if (signal) {
        options = {
            plotOptions: {
                series: {
                    marker: {
                        enabled: showMarkers,

                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                line: {
                    color: "white"
                }
            },
            chart: {
                height: "180px",
                borderColor: 'white'
            },
            title: {
                text: ''
            },
            xAxis: {
                visible: false,
                ordinal: false,
                lineColor: "gray",
                lineWidth: 1,
                categories: signal.dateTimes.slice(props.min, props.max),
                type: 'datetime',
                resize: {
                    enabled: true
                },
                tickInterval: 10,
                gridLineWidth: 1,
                labels: {
                    //@ts-ignore
                    formatter: function () {
                        //@ts-ignore
                        return new Date(this.value).getHours() + ':' + new Date(this.value).getMinutes()
                    }
                },
                min: props.min,
                max: props.max,
                events: {
                    // eslint-disable-next-line no-restricted-globals
                    afterSetExtremes: function (event: any){
                        handleChange(event)
                    },
                }
            },
            yAxis: {
                height: 0,
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                visible: false,
                title: {
                    text: 'F(x)'
                },
                type: 'linear',
            },
            series: [{
                name: props.id,
                data: signal.signalData.slice(props.min, props.max),
                dataGrouping: {
                    enabled: false
                },
                type: 'spline',
                color: 'white'
            }],
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            rangeSelector: {
                enabled: false
            },
            credits: {
                enabled: false,
            },
            navigator: {
                adaptToUpdatedData: false,
                //maskInside: false,
                series: {
                    type: 'spline',
                    color: 'black',
                    animation: {
                        duration: 0,
                    },
                },
                height: 100,
                xAxis: {
                    ordinal: false,
                    labels: {
                        enabled: false
                    }
                },

            },
            lineWidth: 0,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
        }
    }
    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-signal-sidebar/?file=' + props.file + "&signal=" + props.id);
            setSignal({
                signalData: result.data.signalData,
                times: result.data.times,
                dateTimes: result.data.dateTimes
            });
        }

        getData();
    }, [])

    function handleRange() {
        if (send) {
            setState(false)
        }
    }
    function handleChange(e: any) {
        if (send) {
            console.log(1)
            // eslint-disable-next-line no-restricted-globals
            props.func(e)
        }
    }

    function sendExtremas() {
        if (!send) {
            setState(true)
        }
    }


    console.log(send)
    return (
        <div className={classes.gram} onMouseDown={handleRange} onMouseUp={sendExtremas}>
            {(signal?.signalData && signal.signalData.length > 1) ? (
                    <>
                        <HighchartsReact constructorType={'stockChart'} highcharts={Highcharts} options={options}/>
                    </>)
                : <></>}
        </div>
    );
}

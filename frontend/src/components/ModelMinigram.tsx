import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

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
    }
}));

export default function ModelMinigram(this: any, props: any) {
    const classes = useStyles();
    const [name, setName] = useState()
    const [data, setData] = useState<Array<any>>()
    const [times, setTimes] = useState<Array<any>>()
    const [send, setState] = useState(false)
    const [id, setId] = useState()
    if (id === undefined) {
        setId(props.id)
    }
    let model: any
    const models = JSON.parse(localStorage.getItem("models") as string)
    for (let i = 0; i < models.length; i++) {
        if (models[i].name === id) {
            model = models[i]
            break
        }
    }

    let options = {}
    if (data) {
        options = {
            plotOptions: {
                series: {
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
                height: "100px",
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
                categories: times,
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
                events: {
                    // eslint-disable-next-line no-restricted-globals
                    afterSetExtremes: function (event: any) {
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
                data: data,
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
                    type: (model.type === 'impulse' || model.type === 'jump') ? 'column' : 'spline',
                    color: 'black',
                    animation: {
                        duration: 0,
                    },
                },
                height: 30,
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
        const dataTmp = []
        const times = []
        const start = new Date(props.start)
        // @ts-ignore
        const samples = +localStorage.getItem("samples")
        // @ts-ignore
        const fd = +localStorage.getItem('fd')
        if (model.type === 'impulse') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push(i === model.args ? 1 : 0)
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'jump') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push(i >= model.args ? 1 : 0)
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'exponent') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push(Math.pow(model.args, i))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'sin') {
            const args = model.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push(args[0] * Math.sin(i * args[1] + +args[2]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'meandr') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push(i % model.args > model.args / 2 ? -1 : 1)
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'pila') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push((i % model.args) / 2)
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'exp_ogub') {
            const args = model.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push(args[0] * Math.exp(-i / args[1]) * Math.cos(2 * Math.PI * args[2] * i + +args[3]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'balance_ogib') {
            const args = model.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push(args[0] * Math.cos(2 * Math.PI * args[1] * i) * Math.cos(2 * Math.PI * args[2] * i + +args[3]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            console.log(dataTmp)
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'tonal_ogib') {
            const args = model.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push(args[0] * (1 + +args[4] * Math.cos(2 * Math.PI * args[1] * i)) * Math.cos(2 * Math.PI * args[2] * i + +args[3]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
        if (model.type === 'linear_module') {
            const args = model.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push(args[0] * Math.cos(2 * Math.PI * ((+args[1] + (args[2] - args[1]) / (samples * fd)) * i) + +args[3]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
    }, [setTimes, setData])

    function handleRange() {
        if (send) {
            setState(false)
        }
    }

    function handleChange(e: any) {
        if (send) {
            // eslint-disable-next-line no-restricted-globals
            props.func(e)
        }
    }

    function sendExtremas() {
        if (!send) {
            setState(true)
        }
    }
    return (
        <div className={classes.gram} onMouseDown={handleRange} onMouseUp={sendExtremas}>
            {(data && data.length > 1) ? (
                    <>
                        <HighchartsReact constructorType={'stockChart'} highcharts={Highcharts} options={options}/>
                    </>)
                : <></>}
        </div>
    );
}

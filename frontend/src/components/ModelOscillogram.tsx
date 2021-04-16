import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import axios from "axios";

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";

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
    },
}));

export default function Oscillogram(props: any) {
    const [name, setName] = useState()
    const [data, setData] = useState<Array<any>>()
    const [times, setTimes] = useState<Array<any>>()

    const [fd, setF] = useState(0)
    const [samples, setSamples] = useState(0)
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [arg, setArg] = useState()
    const history = useHistory();


    if (props.fd !== 0 && fd === 0) {
        setF(props.fd)
    }

    if (props.samples !== 0 && samples === 0) {
        setSamples(props.samples)
    }

    let options = {
        plotOptions: {
            series: {
                marker: {
                    enabled: props.showMarkers,
                },
            }
        },
        chart: {
            zoomType: "xy"
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            title: {
                text: 'Время'
            },
            categories: times?.slice(props.min, props.max),
            type: 'datetime',
            resize: {
                enabled: false
            },
            tickInterval: 50,
            gridLineWidth: 1,
            labels: {
                //@ts-ignore
                formatter: function () {
                    //@ts-ignore
                    return new Date(this.value).getHours() + ':' + new Date(this.value).getMinutes() + ':' + new Date(this.value).getSeconds()
                }
            },
        },
        yAxis: {
            title: {
                text: 'F(x)'
            },
            type: 'linear',
            gridLineWidth: 1
        },
        series: [{
            name: props.id,
            data: data?.slice(props.min, props.max),
            dataGrouping: {
                enabled: true
            },
            type: 'spline',
        }],
    };


    // function deleteOscillogram() {
    //     const oldChannels = window.location.href.slice(28)
    //     const newChannels = oldChannels.split(';').filter(item => props.id !== item)
    //     if (newChannels.length === 0) {
    //         history.push('/modeling/' + localStorage.getItem("file"))
    //     } else {
    //         history.push('/grams/' + newChannels.join(';'))
    //     }
    // }

    useEffect(() => {
        let model: any
        // @ts-ignore
        const models = JSON.parse(localStorage.getItem("models"))
        for (let i = 0; i < models.length; i++) {
            if (models[i].name === props.name) {
                model = models[i]
                break
            }
        }

        const dataTmp = []
        const times = []
        const start = new Date(props.start)
        console.log(model.args)
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
        if (props.id === 'exponent') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': Math.pow(props.args, i), 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'sin') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': args[0] * Math.sin(i * args[1] + args[2]), 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'meandr') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': i % props.args > props.args / 2 ? -1 : 1, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'pila') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': (i % props.args) / 2, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'balance_ogib') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * args[1] * i) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'exp_ogub') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.exp(-i / args[1]) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'tonal_ogib') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * (1 + args[4] * Math.cos(2 * Math.PI * args[1] * i)) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'linear_module') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * ((args[1] + (args[2] - args[1]) / (samples * fd)) * i) + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
    }, [setData, setName]);

    console.log(data)

    return (
        <>
            {(data && data?.length > 1) ? (
                    <>
                        <HighchartsReact constructorType={'chart'} highcharts={Highcharts} options={options}/>
                    </>)
                : <></>}
        </>
    );
}

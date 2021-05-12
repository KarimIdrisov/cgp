import React, {useEffect, useState} from 'react';

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {Menu, MenuItem} from "@material-ui/core";
import {useHistory} from "react-router-dom";

export default function Oscillogram(props: any) {
    const [name, setName] = useState()
    const [data, setData] = useState<Array<any>>()
    const [times, setTimes] = useState<Array<any>>()
    const history = useHistory();

    let model: any
    // @ts-ignore
    const models = JSON.parse(localStorage.getItem("models"))
    for (let i = 0; i < models.length; i++) {
        if (models[i].name === props.name) {
            model = models[i]
            break
        }
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
            zoomType: "xy",
            height: props.height,
            marginLeft: 80,
            spacingLeft: 30
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
                text: props.name
            },
            type: 'linear',
            gridLineWidth: 1
        },
        series: [{
            type: (model.type === 'impulse' || model.type === 'jump') ? 'column' : (props.spline ? 'spline' : 'line'),
            name: props.name,
            data: data?.slice(props.min, props.max),
            dataGrouping: {
                enabled: true
            },
        }],
    };

    function deleteOscillogram() {
        const oldChannels = window.location.href.slice(28)
        const newChannels = oldChannels.split(';').filter(item => props.name !== item)
        if (newChannels.length === 0) {
            if (localStorage.getItem('file') !== null) {
                history.push('/modeling/' + localStorage.getItem("file"))
            } else {
                history.push('/modeling/')
            }
        } else {
            history.push('/grams/' + newChannels.join(';'))
        }
    }

    useEffect(() => {
        const dataTmp = []
        const times = []
        let start = new Date('01-01-2002')
        if (localStorage.getItem('start') !== null) {
            // @ts-ignore
            start = new Date(localStorage.getItem('start'))
        }
        // @ts-ignore
        const samples = +localStorage.getItem('samples')
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
                dataTmp.push(args[0] * Math.cos(2 * Math.PI * ((+args[1] + ((args[2] - args[1]) * i) / (samples * (1/fd))) * i) + +args[3]))
                times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
            }
            setData(dataTmp)
            setTimes(times)
            setName(model.name)
        }
    }, [setData, setName, setTimes]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={deleteOscillogram}>Удалить осциллограмму</MenuItem>
            </Menu>
            {(data && data?.length > 1) ? (
                    <div style={{display: 'absolute'}} onClick={handleClick}>
                        <HighchartsReact constructorType={'chart'} highcharts={Highcharts} options={options}/>
                    </div>)
                : <></>}
        </>
    );
}

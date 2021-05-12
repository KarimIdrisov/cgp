import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import axios from "axios";

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {useHistory} from "react-router-dom";
import {Menu, MenuItem} from "@material-ui/core";

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
    name: {
        display: 'relative',
        top: 10
    }
}));

interface Signal {
    signalData: number[],
    times: Date[],
    dateTimes: Date[],
    interval: number
}

export default function Oscillogram(props: any) {
    const classes = useStyles();
    const [signal, setSignal] = useState<Signal | any>();
    const history = useHistory();

    let options = {}
    if (signal) {
        options = {
            plotOptions: {
                series: {
                    marker: {
                        enabled: props.showMarkers,
                    },
                }
            },
            chart: {
                zoomType: "xy",
                height: props.height
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
                categories: signal.dateTimes.slice(props.min, props.max),
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
                    text: props.id
                },
                type: 'linear',
                gridLineWidth: 1
            },
            series: [{
                name: props.id,
                data: signal.signalData.slice(props.min, props.max),
                dataGrouping: {
                    enabled: true
                },
                type: props.spline ? 'spline' : 'line',
            }],
        };
    }

    function deleteOscillogram() {
        const oldChannels = window.location.href.slice(28)
        const newChannels = oldChannels.split(';').filter(item => props.id !== item)
        if (newChannels.length === 0) {
            history.push('/modeling/' + localStorage.getItem("file"))
        } else {
            history.push('/grams/' + newChannels.join(';'))
        }
    }

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-signal-sidebar/?file=' + props.file + "&signal=" + props.id);
            setSignal({
                signalData: result.data.signalData,
                times: result.data.times,
                dateTimes: result.data.dateTimes,
                interval: result.data.interval
            });
        }

        getData();
        console.log()
    }, [])

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
            {(signal?.signalData && signal.signalData.length > 1) ? (
                    <div onClick={handleClick}>
                        <HighchartsReact constructorType={'chart'} highcharts={Highcharts} options={options}/>
                    </div>)
                : <></>}
        </>
    );
}

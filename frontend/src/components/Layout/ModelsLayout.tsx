import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FileHeader from '../File/FileHeader';
import FileSidebar from "../File/FileSidebar";
import OscillogramsTools from "../File/OscillogramsTools";
import FileOscillogram from "../File/FileOscillogram";
import {CircularProgress} from "@material-ui/core";
import ISODateString from "../../utils/ISODateString";
import getNewSignalData from "../../utils/getNewSignalData";
import getType from "../../utils/getType";
import axios from "axios";
import Slider from "../Slider";

const useStyles = makeStyles((theme) => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    main: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    canvas: {
        width: "300px",
        maxWidth: "300px",
    },
    container: {
        maxWidth: "1050px",
        marginLeft: "10px"
    },
    progress: {
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        height: '700px',
        width: '100%'
    }
}));

interface Data {
    channelsNumber: number,
    samplesNumber: number,
    samplingRate: number,
    start: string,
    end: string,
    channelsName: Array<string>,
    channelsSource: any,
    signals: any,
    signalsXY: any,
    time: Date,
    file: string
}

export default function ModelsLayout(props: any) {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [samples, setSamples] = React.useState()
    const [fd, setFd] = React.useState()
    const [data, setData] = React.useState<Data>()
    const [modelCount, setModelCount] = React.useState<number>(0)

    const [height, setHeight] = React.useState(100)
    const [min, setMin] = React.useState(0)
    const [max, setMax] = React.useState(data?.samplesNumber)
    const [spline, setSpline] = React.useState(false)
    const [charts, setCharts] = React.useState([])

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue(value => value + 1); // update the state to force render
    }

    // channels for oscillogram
    const [oscillograms, setOscillograms] = React.useState<Array<string>>([])

    const [loading, setLoading] = React.useState(true)


    useEffect(() => {
        async function getData() {
            setLoading(true)
            if (localStorage.getItem('samples') !== null && localStorage.getItem('fd') !== null) {
                // @ts-ignore
                const samples: number = localStorage.getItem('samples')
                // @ts-ignore
                const fd: number = localStorage.getItem('fd')
                const end = new Date((new Date("01-01-2000")).getTime() + (1 / fd) * samples * 1000)
                setData({
                    channelsName: [],
                    channelsNumber: 0,
                    channelsSource: [],
                    end: ISODateString(end),
                    file: "",
                    signals: {},
                    signalsXY: {},
                    start: ISODateString(new Date('01-01-2000')),
                    time: new Date('01-01-2000'),
                    samplesNumber: samples,
                    samplingRate: fd,
                })
            }
            setLoading(false)
        }

        getData()
    }, [setData]);


    function addNewSignal(type: string, args: string) {
        let res = []
        if (type === 'linear') {
            const names = args.split(':')[0]
            const channels = []
            for (let key in data?.signals.keys()) {
                if (names.includes(key)) {
                    channels.push(data?.signals[key])
                }
            }
            // @ts-ignore
            res = getNewSignalData(channels, type, args, data?.samplesNumber, data?.samplingRate, new Date(data?.start))
        } else {
            console.log(type)
            // @ts-ignore
            res = getNewSignalData([], type, args, data?.samplesNumber, data?.samplingRate, new Date(data?.start))
        }
        if (data !== undefined) {
            data?.channelsName.push(`Model_${modelCount}`)

            const tmpSources = data?.channelsSource
            tmpSources[`Model_${modelCount}`] = getType(type)

            const tmpChannels = data?.signals
            tmpChannels[`Model_${modelCount}`] = res[0]

            const tmpChannelsXY = data?.signalsXY
            tmpChannelsXY[`Model_${modelCount}`] = res[1]

            setModelCount(modelCount + 1)
            setData({
                channelsNumber: +data?.channelsNumber + 1,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: data?.channelsName,
                channelsSource: tmpSources,
                signals: tmpChannels,
                signalsXY: tmpChannelsXY,
                time: data?.time,
                file: data?.file
            })
            forceUpdate()
        }
    }

    function changeSize(number: number) {
        setHeight(number)
        forceUpdate()
    }

    function newOscillogram(channel: string) {
        let tmp = oscillograms

        if (tmp !== undefined && !tmp.includes(channel)) {
            tmp.push(channel)
            setOscillograms(tmp)
            forceUpdate()
        }
    }

    function syncHandler(e: any) {
        const chartsArr = charts;
        // @ts-ignore
        for (let i = 0; i < chartsArr.length; i++) {
            // @ts-ignore
            const chart = chartsArr[i];

            // @ts-ignore
            if (!chart.options.axisX) chart.options.axisX = {};

            // @ts-ignore
            if (!chart.options.axisY) chart.options.axisY = {};

            if (e.trigger === "reset") {
                // @ts-ignore
                chart.options.axisX.viewportMinimum = chart.options.axisX.viewportMaximum = null;
                // @ts-ignore
                chart.options.axisY.viewportMinimum = chart.options.axisY.viewportMaximum = null;

                // @ts-ignore
                chart.render();
            } else if (chart !== e.chart) {
                // @ts-ignore
                chart.options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
                // @ts-ignore
                chart.options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;

                // @ts-ignore
                chart.options.axisY.viewportMinimum = e.axisY[0].viewportMinimum;
                // @ts-ignore
                chart.options.axisY.viewportMaximum = e.axisY[0].viewportMaximum;

                // @ts-ignore
                chart.render();
            }
        }
    }

    function updateCharts(ref: any) {
        const tmp = charts
        // @ts-ignore
        tmp.push(ref)
        setCharts(tmp)
    }

    function saveNew(names: string, file: string) {
        const savedChannels = names.slice(1).split(';')
        if ( data !== undefined) {
            const savedSignals: any[] = []
            savedChannels.forEach( channel => {
                if (channel in data?.signals) {
                    savedSignals.push(data?.signals[channel])
                }
            })
            const newData = {
                channelsNumber: savedChannels.length,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: savedChannels,
                signals: savedSignals,
                file: file
            }
            axios.post("http://localhost:3081/updateFile", newData).then(r => console.log(r))
        }
    }

    if (loading) {
        return (
            <div className={classes.progress}>
                <CircularProgress size="6rem"/>
            </div>
        )
    }
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container className={classes.container}>
                <FileHeader title="CGP - DSP" samples={data?.samplesNumber} fd={data?.samplingRate}
                            channels={data?.channelsName} file={props.file} addNewSignal={addNewSignal}
                            startTime={data?.start} endTime={data?.end} sources={data?.channelsSource}
                            saveNew={saveNew}
                />
                {oscillograms.length > 0 ? (
                    <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}/>) : <></>}
                {oscillograms.length > 0 ? (
                    <>
                        <Slider signal={data?.signalsXY[oscillograms[0]]}
                                source={data?.channelsSource[oscillograms[0]]}
                                sync={syncHandler}
                                name={oscillograms[0]} height={100} min={min} max={max}
                        />
                    </>) : (<></>)}
                {oscillograms.length > 0 ? (
                    oscillograms.map((channel, number) => {
                        return (
                            <>
                                <FileOscillogram signal={data?.signalsXY[channel]} time={data?.start}
                                                 source={data?.channelsSource[channel]}
                                                 sync={syncHandler} updateRef={updateCharts}
                                                 name={channel} height={height} key={number}/>
                            </>)
                    })
                ) : (<></>)}
                <FileSidebar samples={data?.samplesNumber} fd={data?.samplingRate} addOscillogram={newOscillogram}
                             channels={data?.channelsName} file={props.file} sources={data?.channelsSource}
                             signals={data?.signals} signalsXY={data?.signalsXY}/>
            </Container>
        </React.Fragment>
    )
}



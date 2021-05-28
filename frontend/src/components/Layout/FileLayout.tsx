import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FileHeader from '../File/FileHeader';
import axios from "axios";
import {CircularProgress} from "@material-ui/core";
import FileSidebar from "../File/FileSidebar";
import FileOscillogram from "../File/FileOscillogram";
import OscillogramsTools from "../File/OscillogramsTools";
import getNewSignalData from "../../utils/getNewSignalData";
import getType from "../../utils/getType";
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
        marginLeft: "10px",
        display: 'flex',
        flexDirection: 'column'
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
    start: Date,
    end: Date,
    channelsName: Array<string>,
    channelsSource: any,
    signals: any,
    signalsXY: any,
    time: number,
    file: string
}

export default function FileLayout(props: any) {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [data, setData] = React.useState<Data>()
    const [modelCount, setModelCount] = React.useState<number>(0)

    const [height, setHeight] = React.useState(100)
    const [min, setMin] = React.useState(0)
    const [max, setMax] = React.useState(data?.samplesNumber)
    const [spline, setSpline] = React.useState(false)
    const [markers, setMarkers] = React.useState(false)
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
            const result = await axios.get('http://localhost:3081/get-file/?id=' + props.file);
            setData(result.data)
            setMax(result.data.samplesNumber)
            setLoading(false)
        }

        getData()
    }, [setData, setOscillograms]);

    function newOscillogram(channel: string) {
        let tmp = oscillograms

        if (tmp !== undefined && !tmp.includes(channel)) {
            tmp.push(channel)
            setOscillograms(tmp)
            forceUpdate()
        }
    }

    function changeSize(number: number) {
        setHeight(number)
        forceUpdate()
    }

    function addNewSignal(type: string, args: string) {
        let res = []
        if (type === 'linear' || type === 'multiplicative') {
            const names = args.split(':')[0]
            const channels = []
            for (let key in data?.signals) {
                if (names.includes(key)) {
                    channels.push(data?.signals[key])
                }
            }

            // @ts-ignore
            res = getNewSignalData(channels, type, args, data?.samplesNumber, data?.samplingRate, new Date(data?.start))
        } else {
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

    function setFragment(min: number, max: number) {
        setMin(min)
        setMax(max)
        forceUpdate()
    }

    function dropFragment() {
        setMin(0)
        setMax(data?.samplesNumber)
    }

    function update(names: string) {
        const savedChannels = names.slice(1).split(';')
        if (data !== undefined) {
            const savedSignals: any[] = []
            savedChannels.forEach(channel => {
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
                file: data?.file
            }
            axios.post("http://localhost:3081/updateFile", newData).then(r => console.log(r))
        }
    }

    function updateCharts(ref: any) {
        const tmp = charts
        // @ts-ignore
        tmp.push(ref)
        setCharts(tmp)
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
                if (e.axisX === undefined) {
                    // @ts-ignore
                    chart.options.axisX.viewportMinimum = e.minimum;
                    // @ts-ignore
                    chart.options.axisX.viewportMaximum = e.maximum;

                    // @ts-ignore
                    chart.render();
                } else {
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
    }

    function deleteOscillogram(name: string) {
        const tmp = oscillograms.filter(channel => channel !== name)
        setOscillograms(tmp)
        forceUpdate()
    }

    function deleteSignal(name: string) {
        if (data !== undefined) {

            const tmpSources = data?.channelsSource
            delete tmpSources[name]

            const tmpChannels = data?.signals
            delete tmpChannels[name]

            const tmpChannelsXY = data?.signalsXY
            delete tmpChannelsXY[name]

            setData({
                channelsNumber: +data?.channelsNumber - 1,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: data?.channelsName.filter( channel => channel !== name),
                channelsSource: tmpSources,
                signals: tmpChannels,
                signalsXY: tmpChannelsXY,
                time: data?.time,
                file: data?.file
            })
            forceUpdate()
        }
    }

    function saveNew(names: string, file: string) {
        const savedChannels = names.slice(1).split(';')
        if (data !== undefined) {
            const savedSignals: any[] = []
            savedChannels.forEach(channel => {
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
                channelsName: savedChannels.join(';'),
                signals: savedSignals,
                file: file
            }
            axios.post("http://localhost:3081/updateFile", newData).then(r => console.log(r))
        }
    }

    function turnInterpolation() {
        setMarkers(!markers)
    }

    function turnSpline() {
        setSpline(!spline)
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
                            startTime={data?.start} endTime={data?.end} sources={data?.channelsSource} update={update}
                            addOscillogram={newOscillogram} saveNew={saveNew}
                />
                {oscillograms.length > 0 ? (
                    <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}
                                       setFragment={setFragment} dropFragment={dropFragment}
                                       turnInterpolation={turnInterpolation} turnSpline={turnSpline}/>) : <></>}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {oscillograms.length > 0 ? (
                        <>
                            <Slider signal={data?.signalsXY[oscillograms[0]]}
                                    source={data?.channelsSource[oscillograms[0]]}
                                    sync={syncHandler} updateRef={updateCharts}
                                    name={oscillograms[0]} height={98} min={min} max={max}
                            />
                        </>) : (<></>)}
                    {oscillograms.length > 0 ? (
                        oscillograms.map((channel, number) => {
                            return (
                                <>
                                    <FileOscillogram signal={data?.signalsXY[channel]} key={number}
                                                     source={data?.channelsSource[channel]}
                                                     sync={syncHandler} updateRef={updateCharts}
                                                     name={channel} height={height} min={min} max={max}
                                                     deleteOscillogram={deleteOscillogram}
                                                     spline={spline} markers={markers}
                                    />
                                </>)
                        })
                    ) : (<></>)}
                </div>

                <FileSidebar samples={data?.samplesNumber} fd={data?.samplingRate} addOscillogram={newOscillogram}
                             channels={data?.channelsName} file={props.file} sources={data?.channelsSource}
                             signals={data?.signals} signalsXY={data?.signalsXY} min={min} max={max}
                             deleteSignal={deleteSignal}/>
            </Container>
        </React.Fragment>
    )
}

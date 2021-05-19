import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FileHeader from '../File/FileHeader';
import Footer from '../Footer';
import Sidebar from "../Sidebar";
import axios from "axios";
import {CircularProgress} from "@material-ui/core";
import {Simulate} from "react-dom/test-utils";
import FileSidebar from "../File/FileSidebar";
import FileOscillogram from "../File/FileOscillogram";
import OscillogramsTools from "../File/OscillogramsTools";
import getNewSignalData from "../../utils/getNewSignalData";
import getType from "../../utils/getType";

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
    time: number,
    file: string
}

export default function FileLayout(props: any) {
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
            const result = await axios.get('http://localhost:3081/model-data/?id=' + props.file);
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
        const res = getNewSignalData(type, args, data?.samplesNumber, data?.samplingRate, data?.time)
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
                />
                {oscillograms.length > 0 ? (
                    <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}
                                       setFragment={setFragment} dropFragment={dropFragment}/>) : <></>}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {oscillograms.length > 0 ? (
                        oscillograms.map((channel, number) => {
                            return (
                                <>
                                    <FileOscillogram signal={data?.signalsXY[channel]}
                                                     name={channel} height={height} min={min} max={max}/>
                                </>)
                        })
                    ) : (<></>)}
                </div>
                <FileSidebar samples={data?.samplesNumber} fd={data?.samplingRate} addOscillogram={newOscillogram}
                             channels={data?.channelsName} file={props.file} sources={data?.channelsSource}
                             signals={data?.signals} signalsXY={data?.signalsXY} min={min} max={max}/>
            </Container>
        </React.Fragment>
    )
}

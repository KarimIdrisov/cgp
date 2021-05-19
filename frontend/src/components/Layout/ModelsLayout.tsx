import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FileHeader from '../File/FileHeader';
import Footer from '../Footer';
import Sidebar from "../Sidebar";
import axios from "axios";
import FileSidebar from "../File/FileSidebar";
import OscillogramsTools from "../File/OscillogramsTools";
import FileOscillogram from "../File/FileOscillogram";
import {CircularProgress} from "@material-ui/core";

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
                setData({
                    channelsName: [],
                    channelsNumber: 0,
                    channelsSource: [],
                    end: "",
                    file: "",
                    signals: {},
                    signalsXY: {},
                    start: (new Date('01-01-2000')).getTime().toString(),
                    time: 0,
                    samplesNumber: samples,
                    samplingRate: fd,
                })
            }
            setLoading(false)
        }
        getData()
    }, [setData]);


    function addNewSignal() {

    }

    function changeSize() {

    }

    function newOscillogram() {

    }

    if (loading) {
        return (
            <div className={classes.progress}>
                <CircularProgress size="6rem"/>
            </div>
        )
    }
    console.log(data)
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container className={classes.container}>
                <FileHeader title="CGP - DSP" samples={data?.samplesNumber} fd={data?.samplingRate}
                            channels={data?.channelsName} file={props.file} addNewSignal={addNewSignal}
                            startTime={data?.start} endTime={data?.end} sources={data?.channelsSource}
                />
                {oscillograms.length > 0 ? (
                    <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}/>) : <></>}
                {oscillograms.length > 0 ? (
                    oscillograms.map((channel, number) => {
                        return (
                            <>
                                <FileOscillogram signal={data?.signalsXY[channel]}
                                                 name={channel} height={height}/>
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

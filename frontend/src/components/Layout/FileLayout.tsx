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
    signals: any,
    time: number,
    file: string
}

export default function FileLayout(props: any) {
    const classes = useStyles();
    const [samples, setSamples] = React.useState()
    const [fd, setFd] = React.useState()
    const [data, setData] = React.useState<Data>()

    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        async function getData() {
            setLoading(true)
            const result = await axios.get('http://localhost:3081/model-data/?id=' + props.file);
            setData(result.data)
            setLoading(false)
        }

        getData()
    }, [setData]);


    if (loading) {
        return (
            <div className={classes.progress}>
                <CircularProgress size="6rem"/>
            </div>
        )
    }
    console.log(loading)
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container className={classes.container}>
                <FileHeader title="CGP - DSP" samples={data?.samplesNumber} fd={data?.samplingRate}
                            channels={data?.channelsName} file={props.file}
                            startTime={data?.start} endTime={data?.end}
                />
                <main className={classes.main}>
                    {props.children}
                </main>
                <FileSidebar samples={data?.samplesNumber} fd={data?.samplingRate}
                             channels={data?.channelsName} file={props.file}
                             signals={data?.signals}/>
            </Container>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </React.Fragment>
    )
}

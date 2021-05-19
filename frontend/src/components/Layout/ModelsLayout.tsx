import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FileHeader from '../File/FileHeader';
import Footer from '../Footer';
import Sidebar from "../Sidebar";
import axios from "axios";

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
    }
}));

interface Data {
    channelsNumber: number,
    samplesNumber: number,
    samplingRate: number,
    start: string,
    end: string,
    times: Array<number>,
    channelsName: Array<string>,
    signals: any,
    time: number,
    file: string
}

export default function FileLayout(props: any) {
    const classes = useStyles();
    const [redraw, setRedraw] = useState<number>()
    const [samples, setSamples] = React.useState()
    const [fd, setFd] = React.useState()
    const [data, setData] = React.useState<Data>()


    function refresh() {
        setRedraw(Date.now())
    }

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/model-data/?id=' + props.file);
            if (result.data !== undefined) {
                setData(result.data);
            }
        }

        getData()
        console.log(data)
    }, [setData, setSamples, setFd]);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container className={classes.container}>
                <Sidebar file={null} update={refresh}/>
                <FileHeader title="CGP - DSP" file={null} update={refresh}/>
                <main className={classes.main}>
                    {props.children}
                </main>
            </Container>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </React.Fragment>
    )
}

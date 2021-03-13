import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Layout from "../components/Layout";
import axios from "axios";
import Graphic from "../components/Graphic";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
    canvas: {
        width: "200px",
        height: "200px",
    },
    dialog: {
        color: "black",
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
}

export default function ModelingPage(props: any) {
    const classes = useStyles();
    const [data, setData] = useState<Data>()

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3080/model-data/?id=' + props.match.params.filename);
            setData(result.data);
        }

        getData();
    }, [setData]);

    return (
        <Layout>
            {(data?.channelsName.map((channel: string, number) => (
                <>
                    <Graphic key={channel} id={data?.channelsName[number]} times={data?.times}
                             data={data?.signals[channel]}/>
                </>
            )))}
        </Layout>
    );
}

import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Layout from "../components/Layout";
import {Typography} from "@material-ui/core";
import axios from "axios";
import Graphic from "../components/Graphic";


const useStyles = makeStyles((theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
    canvas: {
        width: "200px",
        height: "200px",
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

}

export default function ModelingPage() {
    const classes = useStyles();
    const [data, setData] = useState<Data>()
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            const result = await axios.get('http://localhost:3080/model-data');
            setData(result.data);
        }

        getData();
    }, [setData]);

    console.log(data?.channelsName)
    return (
        <Layout>

            {(data?.channelsName.map( (channel: string, number) => (
                <>                <canvas id={channel} className={classes.canvas}/>
                <Graphic key={channel} id={data?.channelsName[number]} times={data?.times} data={data?.signals[channel]}/>
                </>
            )))}
        </Layout>
    );
}

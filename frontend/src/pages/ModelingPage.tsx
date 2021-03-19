import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Layout from "../components/Layout";
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
    },
    dialog: {
        color: "black",
    },
    div: {
        height: "400px"
    }
}));

interface Data {
    channelsNumber: number,
    samplesNumber: number,
    samplingRate: number,
    start: string,
    end: string,
    channelsName: Array<string>,
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
                    <Graphic key={number} id={data?.channelsName[number]} file={props.match.params.filename}/>
                </>
            )))}
            <div className={classes.div}> </div>
        </Layout>
    );
}

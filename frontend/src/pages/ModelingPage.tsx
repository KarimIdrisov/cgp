import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Layout from "../components/Layout";
import axios from "axios";

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

export default function ModelingPage() {
    const classes = useStyles();
    const [data, setData] = useState<Data>()
    const file = localStorage.getItem("file")
    const [newModels, setNewModels] = useState<Array<any>>()


    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/model-data/?id=' + file);
            setData(result.data);
        }

        getData();
        //@ts-ignore
        setNewModels(JSON.parse(localStorage.getItem('models')))
    }, [setData]);

    return (
        <Layout file={file}>
            <div className={classes.div}>

            </div>
        </Layout>
    );
}

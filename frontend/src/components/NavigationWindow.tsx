import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import axios from "axios";

interface Data {
    channelsNumber: number,
    channelsName: Array<string>,
}


const useStyles = makeStyles((theme) => ({
    canvas: {
        maxWidth: "300px",
    }
}));

export default function NavigationWindow(props: any) {
    const classes = useStyles();

    const [data, setData] = useState<Data>()

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3080/channels/?id=' + props.file);
            setData(result.data);
        }

        getData();
    }, [setData]);

    console.log(data)
    return (
        <React.Fragment>
            {data?.channelsName.map( (channel) => (
                <>
                    <canvas id={channel} className={classes.canvas}/>
                </>
            ))}

        </React.Fragment>
);
}

import React, {useEffect, useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from "axios";

const drawerWidth = 400;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            marginTop: "1px",
            marginRight: "60px"
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            display: "flex",
            alignItems: "center",
            paddingTop: "50px",
            paddingBottom: "50px",
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
        canvas: {
            maxWidth: "400px",
        }
    }),
);


interface Data {
    channelsNumber: number,
    channelsName: Array<string>,
}

export default function PermanentDrawerRight(props: any) {
    const classes = useStyles();

    const [data, setData] = useState<Data>()

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3080/channels/?id=' + props.file);
            setData(result.data);
        }

        getData();
    }, [setData]);


    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Drawer className={classes.drawer} variant="permanent" classes={{paper: classes.drawerPaper}}
                    anchor="right">
                {data?.channelsName.map( (channel) => (
                    <>
                        <div id={channel} className={classes.canvas}></div>
                    </>
                ))}
            </Drawer>
        </div>
    );
}

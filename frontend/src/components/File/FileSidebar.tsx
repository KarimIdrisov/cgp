import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import FileGraphic from "./FileGraphic";

const drawerWidth = 350;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            marginTop: "1px",
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            padding: "10px"
        },
        drawerPaper: {
            width: drawerWidth,
            display: "flex",
            paddingTop: "50px",
            paddingBottom: "50px",
            paddingLeft: "10px",
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
        canvas: {
            maxWidth: "350px",
            maxHeight: "300px"
        },
        Link: {
            textDecoration: 'none',
            color: "black",
        },
    }),
);

export default function FileSidebar(props: any) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Drawer className={classes.drawer} variant="permanent" classes={{paper: classes.drawerPaper}}
                    anchor="right">
                {props.channels.map((channel: string, number: number) => (
                    <FileGraphic aria-controls="simple-menu" aria-haspopup="true" signal={props.signals[channel]}
                                 source={props.sources[channel]} file={props.file} name={channel} key={number}
                                 addOscillogram={props.addOscillogram} deleteSignal={props.deleteSignal}/>
                ))}
            </Drawer>
        </div>
    );
}

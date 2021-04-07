import React, {useEffect, useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from "axios";
import {Menu, MenuItem} from "@material-ui/core";
import {useHistory} from "react-router-dom";

import NewModelGraphic from "./NewModelGraphic"
import Graphic from "./Graphic";

const drawerWidth = 350;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            marginTop: "1px",
            paddingRight: "50px"
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
            paddingRight: "30px",
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
        },
        Link: {
            textDecoration: 'none',
            color: "black",
        },
    }),
);

interface Data {
    channelsNumber: number,
    channelsName: Array<string>,
}

interface Model {
    name: string,
    args: string
}

export default function PermanentDrawerRight(props: any) {
    const classes = useStyles();
    const history = useHistory();

    const [data, setData] = useState<Data>()
    const [newModels, setNewModels] = useState<Array<any>>()

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/channels/?id=' + props.file);
            setData(result.data);
        }

        getData();
        // @ts-ignore
        setNewModels(JSON.parse(localStorage.getItem('models')))
        // @ts-ignore
        console.log(localStorage.getItem('models'))
    }, [setData]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const newOscillogram = (event: React.MouseEvent<HTMLLIElement>) => {
        // @ts-ignore
        const channel = anchorEl.childNodes[anchorEl.childNodes.length - 1].id;
        setAnchorEl(null);
        if (!window.location.href.includes("grams")) {
            history.push("/grams/" + channel);
        } else {
            const oldChannels = window.location.href.slice(28)
            if (oldChannels.length === 0) {
                history.push("/grams/" + channel)
            }
            if (!oldChannels.includes(channel)) {
                history.push('/grams/' + oldChannels + ';' + channel);
            }
        }
    }

    function newOscillogramByGraph(channel: string) {
        setAnchorEl(null);
        if (!window.location.href.includes("grams")) {
            history.push("/grams/" + channel);
        } else {
            const oldChannels = window.location.href.slice(28)
            if (oldChannels.length === 0) {
                history.push("/grams/" + channel)
            }
            if (!oldChannels.includes(channel)) {
                history.push('/grams/' + oldChannels + ';' + channel);
            }
        }
    }

    return (
        <div className={classes.root}>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={newOscillogram}>Осцилограмма</MenuItem>
            </Menu>
            <CssBaseline/>
            <Drawer className={classes.drawer} variant="permanent" classes={{paper: classes.drawerPaper}}
                    anchor="right">
                {newModels?.map((model: Model, number: number) => (
                    <NewModelGraphic aria-controls="simple-menu" aria-haspopup="true"
                                     id={model.name} args={model.args} key={number}/>
                ))}
                {data?.channelsName.map((channel, number) => (
                    <Graphic aria-controls="simple-menu" aria-haspopup="true" func={newOscillogramByGraph}
                             file={props.file} id={channel} key={number}/>
                ))}
            </Drawer>
        </div>
    );
}

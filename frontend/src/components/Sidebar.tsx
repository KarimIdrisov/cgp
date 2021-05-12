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

interface Data {
    channelsNumber: number,
    channelsName: Array<string>,
    samples: number,
    f: number
}

interface Model {
    type: string,
    args: string,
    name: string
}

export default function PermanentDrawerRight(props: any) {
    const classes = useStyles();
    const history = useHistory();

    const [data, setData] = useState<Data>()
    const [newModels, setNewModels] = useState<Array<any>>()
    const [f, setF] = useState(0)
    const [samples, setSamples] = useState(0)

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/channels/?id=' + props.file);
            setData(result.data);
        }

        getData();
        // @ts-ignore
        setNewModels(JSON.parse(localStorage.getItem('models')))
        // @ts-ignore
    }, [setData, setNewModels]);

    if (!window.location.href.includes("txt") && !window.location.href.includes("grams") && f === 0) {
        // @ts-ignore
        setF(+localStorage.getItem("fd"))
    } else if ( (window.location.href.includes("txt") || window.location.href.includes("grams")) && f === 0) {
        if (data?.f !== undefined) {
            // @ts-ignore
            setF(data?.f)
        }
    }

    if (!window.location.href.includes("txt") && !window.location.href.includes("grams") && samples === 0) {
        // @ts-ignore
        setSamples(+localStorage.getItem("samples"))
    } else if ( (window.location.href.includes("txt") || window.location.href.includes("grams")) && samples === 0) {
        if (data?.f !== undefined) {
            // @ts-ignore
            setSamples(data?.samples)
        }
    }

    if (JSON.parse(localStorage.getItem('models') as string)?.length !== newModels?.length) {
        // @ts-ignore
        setNewModels(JSON.parse(localStorage.getItem('models')))
    }

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
                {newModels?.map((model: Model, number) => (
                    <NewModelGraphic aria-controls="simple-menu" aria-haspopup="true" file={props.file} num={number}
                                     id={model.type} name={model.name} args={model.args} key={model.name} fd={f} samples={samples}/>
                ))}
                {data?.channelsName.map((channel, number) => (
                    <Graphic aria-controls="simple-menu" aria-haspopup="true" func={newOscillogramByGraph}
                             file={props.file} id={channel} key={number}/>
                ))}
            </Drawer>
        </div>
    );
}

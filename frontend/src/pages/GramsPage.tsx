import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Layout from "../components/Layout";
import axios from "axios";
import Oscillogram from "../components/Oscillogram";
import Navigator from "../components/Navigator";

import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    TextField
} from "@material-ui/core";
import {useAlert} from "react-alert";
import Minigram from "../components/Minigram";

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
    },
    tools: {
        margin: 'auto',
        display: 'flex',
        justifyContent: "center"
    },
    btn: {
        textTransform: 'none'
    },
    fragment: {
        display: "flex",
    },
    abs: {
        marginTop: '40px',
        marginBottom: '40px',
        position: 'relative',
        height: '160px',
        width: '100%'
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
    min: number,
    max: number
}

export default function GramsPage(props: any) {
    const classes = useStyles();
    const [data, setData] = useState<Data>()
    const file = localStorage.getItem("file")
    const reqChannels = props.match.params.channels
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [min, setMin] = useState(data?.min)
    const [max, setMax] = useState(data?.max)
    const [valueMin, setMinValue] = useState(0)
    const [valueMax, setMaxValue] = useState(0)
    const alert = useAlert()


    const [anchorTools, setAnchorTools] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/model-data/?id=' + file);
            setData(result.data);
        }

        getData();
    }, [setData]);

    const handleClickTools = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorTools(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorTools(null)
    };

    function getFragment() {
        setOpen(true);
    }

    const handleCloseDialog = () => {
        setOpen(false);
    };

    function getFragmentDialog() {
        if (min!! < data!!.min || min!! > data!!.max || max!! < data!!.min || max!! > data!!.max) {
            alert.show('Неверные значения промежутка')
            setAnchorTools(null)
        } else {
            if (valueMin > valueMax) {
                let tmp = valueMin
                setMinValue(valueMax)
                setMaxValue(tmp)
            }
            setMin(valueMin)
            setMax(valueMax)
            setOpen(false);
            setAnchorTools(null)
        }
    }

    function dropFragment() {
        setMin(data?.min)
        setMax(data?.max)
        setAnchorTools(null)
    }

    function handleChange(event: any) {
        if (event !== undefined) {
            setMin(event.min)
            setMax(event.max)
        }
    }

    return (
        <Layout file={file}>
            <Menu
                id="tools"
                anchorEl={anchorTools}
                keepMounted
                open={Boolean(anchorTools)}
                onClose={handleClose}>
                <MenuItem onClick={getFragment}>Фрагмент</MenuItem>
                <MenuItem onClick={dropFragment}>Сбросить фрагмент</MenuItem>

            </Menu>
            <div className={classes.tools}>
                <Button color="inherit" aria-controls="tools" aria-haspopup="true" onClick={handleClickTools}
                        className={classes.btn}>
                    <Typography variant="h6">Инструменты</Typography>
                </Button>
            </div>
            <div className={classes.abs}>
                <Navigator/>
                <Minigram func={handleChange} min={min} max={max} file={file} id={reqChannels.split(";")[0]}/>
            </div>
            {(reqChannels.split(";").map((channel: string, number: number) => (
                <Oscillogram func={handleChange} min={min} max={max} file={file} id={channel} key={number}/>
            )))}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Отсчеты</DialogTitle>
                <DialogContent className={classes.fragment}>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="От"
                        type="number"
                        defaultValue={data?.min}
                        onChange={num => setMinValue(+num.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="to"
                        label="До"
                        type="number"
                        defaultValue={data?.max}
                        onChange={num => setMaxValue(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getFragmentDialog} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

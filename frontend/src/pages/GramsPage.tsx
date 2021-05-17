import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import axios from "axios";
import clsx from "clsx";
import {useAlert} from "react-alert";


import Typography from "@material-ui/core/Typography";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    TextField
} from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";

import Layout from "../components/Layout";
import Oscillogram from "../components/Oscillogram";
import ModelOscillogram from "../components/ModelOscillogram";


const useStyles = makeStyles((theme) => ({
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
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%'
    },
    active: {
        backgroundColor: "gray"
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
    let reqChannels = undefined
    if (reqChannels === undefined) {
        reqChannels = props.match.params.channels
    }
    const [open, setOpen] = React.useState(false);
    const [sizeDialog, setSizeDialog] = React.useState(false);
    const [min, setMin] = useState(data?.min)
    const [max, setMax] = useState(data?.max)
    const [valueMin, setMinValue] = useState(0)
    const [valueMax, setMaxValue] = useState(0)
    const alert = useAlert()
    const [showMarkers, setShow] = useState(false)
    const [showSpline, setShowSpline] = useState(false)

    const [f, setF] = useState(0)
    const [samples, setSamples] = useState(0)

    const [height, setHeight] = useState(200)
    const [tempHeight, setTempHeight] = useState(200)

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
        setSizeDialog(false)
    };

    function getFragmentDialog() {
        if (localStorage.getItem('file') !== null) {
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
        } else {
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

    function turnInterpolation() {
        if (!showMarkers) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    function turnSpline() {
        if (!showSpline) {
            setShowSpline(true)
        } else {
            setShowSpline(false)
        }
    }

    if (!window.location.href.includes("txt") && !window.location.href.includes("grams") && f === 0) {
        // @ts-ignore
        setF(+localStorage.getItem("fd"))
    } else if ((window.location.href.includes("txt") || window.location.href.includes("grams")) && f === 0) {
        if (data?.samplingRate !== undefined) {
            // @ts-ignore
            setF(data?.samplingRate)
        }
    }

    if (!window.location.href.includes("txt") && !window.location.href.includes("grams") && samples === 0) {
        // @ts-ignore
        setSamples(+localStorage.getItem("samples"))
    } else if ((window.location.href.includes("txt") || window.location.href.includes("grams")) && samples === 0) {
        if (data?.samplesNumber !== undefined) {
            // @ts-ignore
            setSamples(data?.samplesNumber)
        }
    }

    function handleChangeSize() {
        setSizeDialog(true)
        setAnchorTools(null)
    }

    function changeSize() {
        setSizeDialog(false);
        setAnchorTools(null)
        setHeight(tempHeight)
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
                <MenuItem onClick={handleChangeSize}>Изменение высоты графика</MenuItem>
            </Menu>
            <div className={classes.tools}>
                <Button color="inherit" aria-controls="tools" aria-haspopup="true" onClick={handleClickTools}
                        className={classes.btn}>
                    <Typography variant="h6">Инструменты</Typography>
                </Button>
                <ToggleButtonGroup>
                    <ToggleButton className={clsx({[classes.active]: showMarkers})} onClick={turnInterpolation}>
                        <TimelineIcon/>
                    </ToggleButton>
                    <ToggleButton className={clsx({[classes.active]: showSpline})} onClick={turnSpline}>
                        <ShowChartIcon/>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Typography>Начало - {min?.toFixed() ? min?.toFixed() : 0}, Конец - {max?.toFixed() ? max?.toFixed() : localStorage.getItem('samples') as string}</Typography>
            {(reqChannels.split(";").map((channel: string, number: number) => {
                if (localStorage.getItem('models') !== null && channel.includes('Model')) {
                    return <ModelOscillogram start={data?.start} showMarkers={showMarkers} func={handleChange} min={min}
                                             max={max} file={file} name={channel} height={height} spline={showSpline}
                                             fd={f}
                                             samples={samples}
                                             key={number}/>
                } else {
                    return <Oscillogram showMarkers={showMarkers} func={handleChange} min={min} max={max} file={file}
                                        id={channel} height={height} spline={showSpline}
                                        key={number}/>
                }
            }))}
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

            <Dialog open={sizeDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Изменение высоты</DialogTitle>
                <DialogContent>
                    <Typography>Текущая высота: {height}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Высота графика"
                        type="number"
                        defaultValue={height}
                        onChange={num => setTempHeight(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={changeSize} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

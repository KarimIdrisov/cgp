import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import clsx from "clsx";

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

export default function OscillogramsTools(props: any) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [sizeDialog, setSizeDialog] = React.useState(false);
    const [showMarkers, setShow] = useState(false)
    const [showSpline, setShowSpline] = useState(false)

    const [height, setHeight] = React.useState(props.height)
    const [min, setMin] = React.useState<number>(props.min)
    const [max, setMax] = React.useState<number>(props.max)
    const [spline, setSpline] = React.useState(props.spline)

    const [anchorTools, setAnchorTools] = React.useState<null | HTMLElement>(null);

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

    function setUpFragment() {
        setAnchorTools(null)
        setOpen(false)
        props.setFragment(min, max)
    }

    function dropFragment() {
        setAnchorTools(null)
        props.dropFragment()
    }


    function turnInterpolation() {
        props.turnInterpolation()
    }

    function turnSpline() {
        props.turnSpline()
    }

    function handleChangeSize() {
        setSizeDialog(true)
        setAnchorTools(null)
    }

    function changeSize() {
        setSizeDialog(false);
        setAnchorTools(null)
        props.changeSize(height)
    }

    return (
        <div style={{marginTop: '5px'}}>
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
                    <ToggleButton className={clsx({[classes.active]: props.markers})} onClick={turnInterpolation}>
                        <TimelineIcon/>
                    </ToggleButton>
                    <ToggleButton className={clsx({[classes.active]: props.spline})} onClick={turnSpline}>
                        <ShowChartIcon/>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Typography>Начало - {props.min}, Конец - {props.max}</Typography>
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
                        defaultValue={min}
                        onChange={num => setMin(+num.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="to"
                        label="До"
                        type="number"
                        defaultValue={max}
                        onChange={num => setMax(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={setUpFragment} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={sizeDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Изменение высоты</DialogTitle>
                <DialogContent>
                    <Typography>Текущая высота: {props.height}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Высота графика"
                        type="number"
                        defaultValue={height}
                        onChange={num => setHeight(+num.target.value)}
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
        </div>
    );
}

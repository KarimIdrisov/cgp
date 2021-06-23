import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Typography from "@material-ui/core/Typography";
import {
    Button, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import clsx from "clsx";
import TimelineIcon from "@material-ui/icons/Timeline";
import {ToggleButton} from "@material-ui/lab";

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

export default function AnalyseTools(props: any) {
    const classes = useStyles();

    const [anchorTools, setAnchorTools] = React.useState<null | HTMLElement>(null);

    const handleClickTools = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorTools(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorTools(null)
    };

    function changeL() {
        setOpenL(true)
        setAnchorTools(null)
    }

    const [openL, setOpenL] = React.useState(false);
    const [l, setL] = React.useState(0)
    const [height, setHeight] = React.useState(props.height)


    const [spectre, setSpectre] = React.useState('amplitudeSpectre')
    const [current, setCurrent] = useState('amplitudeSpectre')

    function handleChangeSpectre(event: React.ChangeEvent<{ value: unknown }>) {
        setSpectre(event.target.value as string)
        setCurrent(event.target.value as string)
        props.changeSpectre(event.target.value)
    }

    function handleChangeSize() {
        setSizeDialog(true)
        setAnchorTools(null)
    }

    const [nullSample, setNullSample] = React.useState('zero')

    function handleChangeSample(event: React.ChangeEvent<{ value: unknown }>) {
        props.nullSample(event.target.value as string)
        setNullSample(event.target.value as string)
        setCurrent(event.target.value as string)
    }

    function setNewL() {
        props.changeL(l);
        setOpenL(false)
    }

    function logarithmic() {
        props.logarithmic()
    }

    const [open, setOpen] = React.useState(false);

    const [sizeDialog, setSizeDialog] = React.useState(false);

    function changeSize() {
        setSizeDialog(false);
        setAnchorTools(null)
        props.changeSize(height)
    }

    const handleCloseDialog = () => {
        setOpen(false);
        setSizeDialog(false)
    };

    return (
        <div style={{marginTop: '5px'}}>

            <Menu
                id="tools"
                anchorEl={anchorTools}
                keepMounted
                open={Boolean(anchorTools)}
                onClose={handleClose}>
                <MenuItem>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={nullSample}
                        onChange={handleChangeSample}>
                        <MenuItem value='nothing'>Ничего не делать</MenuItem>
                        <MenuItem value='zero'>Обнулить</MenuItem>
                        <MenuItem value='neighbor'>Уровнять с соседним</MenuItem>
                    </Select>
                </MenuItem>
                <MenuItem onClick={changeL}>
                    Параметр сглаживания
                </MenuItem>
                <MenuItem onClick={handleChangeSize}>
                    Изменить высоту
                </MenuItem>
            </Menu>
            <div className={classes.tools}>
                <Button color="inherit" aria-controls="tools" aria-haspopup="true" onClick={handleClickTools}
                        className={classes.btn}>
                    <Typography variant="h6">Настройки</Typography>
                </Button>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={spectre}
                    onChange={handleChangeSpectre}>
                    <MenuItem value={'amplitudeSpectre'}>Амплитудный спектр</MenuItem>
                    <MenuItem value={'spm'}>Спектральная плотность мощности</MenuItem>
                </Select>

                <ToggleButton className={clsx({[classes.active]: props.log})} onClick={logarithmic}>
                    <TimelineIcon/>
                </ToggleButton>
            </div>
            <Typography>Начало - {props.min}, Конец - {props.max}</Typography>

            <Dialog open={openL} onClose={handleClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Параметр сглаживания</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography>Текущее - {props.l}</Typography>
                        <TextField
                            style={{marginRight: '10px'}}
                            autoFocus
                            margin="dense"
                            variant='outlined'
                            type="number"
                            defaultValue={props.l}
                            onChange={num => setL(+num.target.value)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setNewL} color="primary" autoFocus>
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

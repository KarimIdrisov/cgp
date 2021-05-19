import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import getType from "../../utils/getType";
import getParamsNames from "../../utils/getParamsNames";


const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(6, 0),
    },
    menu: {
        marginLeft: 180,
        marginTop: 20
    }
}));

export default function Sinusoida(props: any) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [current, setCurrent] = useState('')
    const [open, setOpen] = React.useState(false);

    const [amplitude, setAmplitude] = useState(1)
    const [circle, setCircle] = useState(0)
    const [startPhase, setStartPhase] = useState(3.14)

    useEffect(() => {
        if (props.samples < 100000) {
            setCircle(35 / (Math.pow(10, (props.samples.toString().split('').length - 1))))
        } else {
            setCircle(35 / (Math.pow(10, (props.samples.toString().split('').length - 2))))
        }
    }, [])

    function handleClick(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorEl(null);
        setOpen(true);
        props.close()
    }

    const handleClose = () => {
        setAnchorEl(null)
    };

    const handleCloseDialog = () => {
        setOpen(false)
    };

    function addSignal() {
        props.addNewSignal(current, `${amplitude}:${circle}:${startPhase}`)
        setOpen(false)
    }

    return (
        <>
            <MenuItem onClick={handleClick} id={'sin'}>Дискретизированная синусоида</MenuItem>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Тип: {getType(current)}</Typography>
                    <Typography>Частота
                        дискретизации: {props.fd}</Typography>
                    <Typography>Кол-во
                        отсчетов: {props.samples}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[0] : ''}
                        type="number"
                        defaultValue={amplitude}
                        onChange={num => setAmplitude(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={circle}
                        onChange={num => setCircle(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[2] : ''}
                        type="number"
                        defaultValue={startPhase}
                        onChange={num => setStartPhase(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={addSignal} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
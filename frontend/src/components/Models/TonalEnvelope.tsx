import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from "@material-ui/core";
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

export default function TonalEnvelope(props: any) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [current, setCurrent] = useState('')
    const [open, setOpen] = React.useState(false);

    const [ampl, setAmpl] = useState(1)
    const [startPhase, setStartPhase] = useState(3.14)
    const [ogib, setOgib] = useState(0)
    const [nesuch, setNesuch] = useState(0)
    const [glubina, setGlubina] = useState(0)

    useEffect(() => {
        if (props.samples < 100000) {
            setNesuch(props.fd / 20 / (props.samples / 1000))
            setOgib(props.fd / 400 / (props.samples / 1000))
            setGlubina(0.5)
        } else {
            setGlubina(0.5)
            setOgib((props.fd / 2) / (props.samples / 10))
            setNesuch((props.fd / 2) / 1000 / (props.samples / 100000))
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
        props.addNewSignal(current, `${ampl}:${ogib}:${nesuch}:${startPhase}:${glubina}`)
        setOpen(false)
    }

    return (
        <>
            <MenuItem onClick={handleClick} id={'tonal_ogib'}>Сигнал с тональной огибающей</MenuItem>
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
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[4] : ''}
                        type="number"
                        defaultValue={glubina}
                        onChange={num => setGlubina(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[0] : ''}
                        type="number"
                        defaultValue={ampl}
                        onChange={num => setAmpl(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={ogib}
                        onChange={num => setOgib(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[2] : ''}
                        type="number"
                        defaultValue={nesuch}
                        onChange={num => setNesuch(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px', width: '200px'}}
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant='outlined'
                        id="from"
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[3] : ''}
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
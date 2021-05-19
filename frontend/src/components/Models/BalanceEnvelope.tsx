import React, {useState} from 'react';
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

export default function BalanceEnvelope(props: any) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [current, setCurrent] = useState('')
    const [open, setOpen] = React.useState(false);

    const [ampl, setAmpl] = useState(0)
    const [startPhase, setStartPhase] = useState(0)
    const [ogib, setOgib] = useState(0)
    const [nesuch, setNesuch] = useState(0)

    function handleClick(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorEl(null);
        setOpen(true);
    }

    const handleClose = () => {
        setAnchorEl(null)
    };

    const handleCloseDialog = () => {
        setOpen(false)
    };

    function addSignal() {
        props.addNewSignal(current, `${ampl}:${ogib}:${nesuch}:${startPhase}`)
        setOpen(false)
    }

    return (
        <>
            <MenuItem onClick={handleClick}  id={'balance_ogib'}>Сигнал с балансной огибающей</MenuItem>
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

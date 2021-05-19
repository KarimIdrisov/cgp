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

export default function Pila(props: any) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [current, setCurrent] = useState('')
    const [open, setOpen] = React.useState(false);

    const [argument, setArgument] = useState(0)

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
        props.addNewSignal(current, `${argument}`)
        setOpen(false)
    }

    return (
        <>
            <MenuItem onClick={handleClick} id={'pila'}>“Пила” с периодом L</MenuItem>
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
                        label={getParamsNames(current)}
                        type="number"
                        defaultValue={argument}
                        onChange={num => setArgument(+num.target.value)}
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

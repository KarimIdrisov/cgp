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

export default function RandomSignals(props: any) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [openWhiteEqual, setOpenWhiteEqual] = React.useState(false);
    const [openWhiteLaw, setOpenWhiteLaw] = React.useState(false);
    const [openRegression, setOpenRegression] = React.useState(false);

    const [startInterval, setStartInterval] = React.useState(0)
    const [endInterval, setEndInterval] = React.useState(0)

    const [averageLaw, setAverageLaw] = React.useState(0)
    const [dispersionLaw, setDispersionLaw] = React.useState(0)

    const [dispersionRegression, setDispersionRegression] = React.useState(0)
    const [p, setP] = React.useState(0)
    const [r, setR] = React.useState(0)
    const [pNums, setPNums] = React.useState(' ')
    const [rNums, setRNums] = React.useState(' ')

    const handleCloseDialog = () => {
        setOpenWhiteEqual(false);
        setOpenWhiteLaw(false);
        setOpenRegression(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function openWhiteEqualDialog(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorEl(null);
        setOpenWhiteEqual(true)
    }
    function openWhiteLawDialog(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorEl(null);
        setOpenWhiteLaw(true)
    }
    function openRegressionDialog(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorEl(null);
        setOpenRegression(true)
    }

    function getNewModelWhiteEqual() {
        props.close()
        setOpenWhiteEqual(false)
        const oldSignals = JSON.parse(localStorage.getItem('models') as string)
        const signal = [{
            type: current,
            args: `${startInterval}:${endInterval}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function getNewModelWhiteLaw() {
        props.close()
        setOpenWhiteLaw(false)
        const oldSignals = JSON.parse(localStorage.getItem('models') as string)
        const signal = [{
            type: current,
            args: `${averageLaw}:${dispersionLaw}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }
    function getNewModelRegression() {
        props.close()
        setOpenRegression(false)
        const oldSignals = JSON.parse(localStorage.getItem('models') as string)
        const signal = [{
            type: current,
            args: `${dispersionRegression}:${p}:${r}:${pNums}:${rNums}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    const [current, setCurrent] = useState('')

    return (
        <>
            <MenuItem onClick={handleClick}>Случайные модели</MenuItem>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menu}>
                <MenuItem onClick={openWhiteEqualDialog} id='whiteEqual'>Сигнал белого шума, равномерно распределенный в интервале [a,b]</MenuItem>
                <MenuItem onClick={openWhiteLawDialog} id='whiteLaw'>Сигнал белого шума, распределенный по нормальному закону с заданными средним и дисперсией</MenuItem>
                <MenuItem onClick={openRegressionDialog} id='regression'>Случайный сигнал авторегрессии</MenuItem>
            </Menu>

            <Dialog open={openWhiteEqual} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Тип: {getType(current)}</Typography>
                    <Typography>Частота
                        дискретизации: {localStorage.getItem('fd')}</Typography>
                    <Typography>Кол-во
                        отсчетов: {localStorage.getItem('samples')}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[0] : ''}
                        type="number"
                        defaultValue={startInterval}
                        onChange={num => setStartInterval(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={endInterval}
                        onChange={num => setEndInterval(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewModelWhiteEqual} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openWhiteLaw} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Тип: {getType(current)}</Typography>
                    <Typography>Частота
                        дискретизации: {localStorage.getItem('fd')}</Typography>
                    <Typography>Кол-во
                        отсчетов: {localStorage.getItem('samples')}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[0] : ''}
                        type="number"
                        defaultValue={averageLaw}
                        onChange={num => setAverageLaw(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={dispersionLaw}
                        onChange={num => setDispersionLaw(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewModelWhiteLaw} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openRegression} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Тип: {getType(current)}</Typography>
                    <Typography>Частота
                        дискретизации: {localStorage.getItem('fd')}</Typography>
                    <Typography>Кол-во
                        отсчетов: {localStorage.getItem('samples')}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={p}
                        onChange={num => setP(+num.target.value)}
                    />
                    <TextField
                        style={{marginTop: '10px'}}
                        id="standard-multiline-static"
                        label="Введите числа разделленые пробелом"
                        multiline
                        rows={3}
                        onChange={nums => setPNums(nums.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[1] : ''}
                        type="number"
                        defaultValue={r}
                        onChange={num => setR(+num.target.value)}
                    />
                    <TextField
                        style={{marginTop: '10px'}}
                        id="standard-multiline-static"
                        label="Введите числа разделленые пробелом"
                        multiline
                        variant="outlined"
                        rows={3}
                        onChange={nums => setRNums(nums.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[0] : ''}
                        type="number"
                        defaultValue={dispersionRegression}
                        onChange={num => setDispersionRegression(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewModelRegression} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

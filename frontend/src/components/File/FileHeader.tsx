import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link, useHistory} from 'react-router-dom';
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField
} from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import {Alert, AlertTitle} from "@material-ui/lab";
import RandomSignals from "../Models/RandomSignals";
import getType from "../../utils/getType";
import getParamsNames from "../../utils/getParamsNames";
import dropData from '../../utils/dropData';

interface Channel {
    name: string,
    type: string,
}

const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
        fontSize: "1.3rem",
        color: "#333",
        textDecoration: "none",
        margin: "auto",
    },
    toolbarBtn: {
        height: "30px",
        width: "100px",
        textTransform: "none",
    },
    Link: {
        textDecoration: 'none',
        color: "black",
    },
    dialog: {
        color: "black",
    },
    width1300px: {
        width: "1350px"
    },
    width1000px: {
        width: "1000px"
    },
    grams: {
        height: "30px",
        width: "200px",
        margin: "auto",
        textTransform: 'none',
    },
    hide: {
        display: 'none'
    },
    channels: {}
}));

interface Section {
    title: string,
    url: string,
}

const sections = [
    {title: 'Фильтрация', url: '#'},
    {title: 'Настройки', url: '#'},
    {title: 'Моделирование', url: '#'},
];

export default function FileHeader(props: any) {
    const classes = useStyles();
    const history = useHistory();

    const [argument, setArgument] = useState(0)
    const [exponent, setExponent] = useState(0)
    const [current, setCurrent] = useState('')
    const [f, setF] = useState(1)
    const [samples, setSamples] = useState(1000)
    const [ampl, setAmpl] = useState(0)
    const [circle, setCircle] = useState(0)
    const [startPhase, setStartPhase] = useState(0)
    const [ogib, setOgib] = useState(0)
    const [nesuch, setNesuch] = useState(0)
    const [startNesuch, setStartNesuch] = useState(0)
    const [glubina, setGlubina] = useState(0)
    const [modelsFile, setModelsFile] = useState('')

    const [balanceOgib, setBalanceOgib] = useState(0)
    const [balanceNesuch, setBalanceNesuch] = useState(0)
    const [tonalOgib, setTonalOgib] = useState(0)
    const [tonalNesuch, setTonalNesuch] = useState(0)

    const [linearOgib, setLinearOgib] = useState(0)
    const [linearNesuch, setLinearNesuch] = useState(0)

    const [anchorFile, setAnchorFile] = React.useState<null | HTMLElement>(null);
    const [anchorGrams, setAnchorGrams] = React.useState<null | HTMLElement>(null);
    const [anchorModels, setAnchorModels] = React.useState<null | HTMLElement>(null);
    const [anchorNewParams, setAnchorNewParams] = React.useState<null | HTMLElement>(null);

    const handleClickFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFile(event.currentTarget);
    };

    const handleClickGrams = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorGrams(event.currentTarget);
    };

    const handleClickModels = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!window.location.href.includes("model") && !window.location.href.includes("grams")) {
            setOpenNewModelParams(true)
        } else {
            setAnchorModels(event.currentTarget);

        }
    };

    const handleClose = () => {
        setAnchorFile(null)
        setAnchorGrams(null)
        setAnchorModels(null)
        setAnchorNewParams(null)
    };

    useEffect(() => {
        setArgument(+(props.samples / 8).toFixed())
        setAmpl(1)
        setExponent(0.99)
        setStartPhase(3.14)
        if (props.samples < 100000) {
            setCircle(35 / (Math.pow(10, (props.samples.toString().split('').length - 1))))
        } else {
            setCircle(35 / (Math.pow(10, (props.samples.toString().split('').length - 2))))
        }
        setOgib(props.samples / 5)
        setNesuch(25 / (Math.pow(10, (props.samples.toString().split('').length - 1))))

        setBalanceNesuch(f / 20 / (props.samples / 1000))
        setBalanceOgib(f / 400 / (props.samples / 1000))

        if (props.samples < 100000) {
            setTonalNesuch(f / 20 / (props.samples / 1000))
            setTonalOgib(f / 400 / (props.samples / 1000))
            setGlubina(0.5)
        } else {
            setGlubina(0.5)
            setTonalOgib((f / 2) / (props.samples / 10))
            setTonalNesuch((f / 2) / 1000 / (props.samples / 100000))
        }

        setLinearNesuch((f / 2) / (props.samples / 100))
        setLinearOgib((f / 4) / (props.samples / 10))
    }, []);

    function getInfo() {
        setOpenInfo(true);
        setAnchorFile(null);
    }

    const [openInfo, setOpenInfo] = React.useState(false);
    const [openModels, setOpenModels] = React.useState(false);
    const [openExponent, setOpenExponent] = React.useState(false);
    const [openComplexModels, setOpenComplexModels] = React.useState(false);
    const [openTonal, setOpenTonal] = React.useState(false);
    const [openNewModelParams, setOpenNewModelParams] = React.useState(false);
    const [openSinusoida, setOpenSinusoida] = React.useState(false);
    const [saveModels, setSaveModels] = React.useState(false);
    const [hide, setHide] = useState(true)
    const [saveNewFile, setSaveNewFile] = useState(false)

    const [names, setNames] = React.useState<string>()

    const handleCloseDialog = () => {
        setNames('')
        setOpenInfo(false);
        setOpenModels(false);
        setOpenComplexModels(false);
        setOpenNewModelParams(false);
        setOpenSinusoida(false);
        setSaveModels(false)
        setOpenTonal(false)
        setSaveNewFile(false)
        setOpenExponent(false)
    };

    const newOscillogram = (event: React.MouseEvent<HTMLLIElement>) => {
        // @ts-ignore
        const channel = event.target.id;
        setAnchorGrams(null);
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

    function newSignal(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorModels(null);
        setOpenModels(true);
    }

    function newExponent(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorModels(null);
        setOpenExponent(true);
    }

    function newComplexSignal(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorModels(null)
        setOpenComplexModels(true)
    }

    function newTonalOgib(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorModels(null)
        setOpenTonal(true)
    }

    function getNewSignal() {
        setOpenModels(false);
        setOpenExponent(false)
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: current === 'exponent' ? exponent : argument,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function getNewComplexSignal() {
        setOpenComplexModels(false);
        const ogib = getOgibNesuch(current)[0]
        const nesuch = getOgibNesuch(current)[1]
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: `${ampl}:${ogib}:${nesuch}:${startNesuch}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function getNewTonalModel() {
        setOpenTonal(false);
        const ogib = getOgibNesuch(current)[0]
        const nesuch = getOgibNesuch(current)[1]
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: `${ampl}:${ogib}:${nesuch}:${startNesuch}:${glubina}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function deleteSignals() {
        if (window.location.href.includes('grams')) {
            let channels = (window.location.href.slice(28)).split(';')
            channels = channels.filter(channel => !channel.includes("Model"))
            if (channels.length === 0) {
                history.push('/modeling/' + localStorage.getItem("file"))
            } else {
                history.push('/grams/' + channels.join(';'))
            }
        }
        localStorage.removeItem("models")
        setAnchorModels(null)
        props.update()
    }

    function redirect() {
        localStorage.setItem("fd", f.toString())
        localStorage.setItem("samples", samples.toString())
        history.push('/modeling/')
        setOpenNewModelParams(false)
    }

    function getSinusoida(event: React.MouseEvent<HTMLLIElement>) {
        //@ts-ignore
        setCurrent(event.target.id)
        setAnchorModels(null);
        setOpenSinusoida(true);
    }

    function newSinusoida() {
        setOpenSinusoida(false);
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: `${ampl}:${circle}:${startPhase}`,
            name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`
        }]
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function saveFile() {
        if ((JSON.parse(localStorage.getItem('models') as string) !== null && localStorage.getItem('file') !== null)) {
            setSaveModels(true)
            setAnchorFile(null)
        } else {
            setHide(false)
            setAnchorFile(null)
        }
    }

    function updateFile() {
        let models = JSON.parse(localStorage.getItem('models') as string)
        const local_names: any[] = []
        const types: any[] = []
        const args: any[] = []
        const file = localStorage.getItem('file')
        models = models.filter((model: any) => names?.split(';').includes(model.name))
        setNames('')
        models.forEach((model: any) => {
            local_names.push(model.name)
            types.push(model.type)
            args.push(model.args)
        })

        axios.post(`http://localhost:3081/updateFile/?id=${file}&names=${local_names.join(';')}&types=${types.join(';')}&args=${args.join(';')}`)
        setSaveModels(false)

    }

    function saveFileAs() {
        if (JSON.parse(localStorage.getItem('models') as string) !== null) {
            setAnchorFile(null)
            setSaveNewFile(true)
        } else {
            setHide(false)
            setAnchorFile(null)
        }
    }

    function saveNewFileAs() {
        setSaveNewFile(false)
        let models = JSON.parse(localStorage.getItem('models') as string)
        const local_names: any[] = []
        const types: any[] = []
        const args: any[] = []
        models = models.filter((model: any) => names?.split(';').includes(model.name))
        setNames('')
        models.forEach((model: any) => {
            local_names.push(model.name)
            types.push(model.type)
            args.push(model.args)
        })
        const f = localStorage.getItem('fd')
        const samples = localStorage.getItem('samples')
        axios.post(`http://localhost:3081/saveNewFile/?id=${modelsFile}&fd=${f}&samples=${samples}&names=${local_names.join(';')}&types=${types.join(';')}&args=${args.join(';')}`)
    }

    function getOgibNesuch(name: string) {
        if (name === 'exp_ogub') {
            return [ogib, nesuch]
        }
        if (name === 'balance_ogib') {
            return [balanceOgib, balanceNesuch]
        }
        if (name === 'tonal_ogib') {
            return [tonalOgib, tonalNesuch]
        }
        if (name === 'linear_module') {
            return [linearOgib, linearNesuch]
        }
        return [0, 0]
    }


    function getDefaultOgib(name: string) {
        if (name === 'exp_ogub') {
            return ogib
        }
        if (name === 'balance_ogib') {
            return balanceOgib
        }
        if (name === 'tonal_ogib') {
            return tonalOgib
        }
        if (name === 'linear_module') {
            return linearOgib
        }
    }

    function setDefaultOgib(name: string, num: number) {
        if (name === 'exp_ogub') {
            setOgib(num)
            return
        }
        if (name === 'balance_ogib') {
            setBalanceOgib(num)
            return
        }
        if (name === 'tonal_ogib') {
            setTonalOgib(num)
            return
        }
        if (name === 'linear_module') {
            setLinearOgib(num)
            return
        }
    }

    function setDefaultNesuch(name: string, num: number) {
        if (name === 'exp_ogub') {
            setNesuch(num)
            return
        }
        if (name === 'balance_ogib') {
            setBalanceNesuch(num)
            return
        }
        if (name === 'tonal_ogib') {
            setTonalNesuch(num)
            return
        }
        if (name === 'linear_module') {
            setLinearNesuch(num)
            return
        }
    }

    function getDefaultNesuch(name: string) {
        if (name === 'exp_ogub') {
            return nesuch
        }
        if (name === 'balance_ogib') {
            return balanceNesuch
        }
        if (name === 'tonal_ogib') {
            return tonalNesuch
        }
        if (name === 'linear_module') {
            return linearNesuch
        }
    }

    const handleChangeNames = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tmp_names: any[] = []

        if (names !== undefined && names.split(';').length > 0) {
            tmp_names = names.split(';')
        }

        const name = event.target.id.toString()

        if (tmp_names.includes(name)) {
            tmp_names = tmp_names.filter(channel => channel !== name)
            setNames(tmp_names.join(';'))
            return
        }
        tmp_names.push(name)
        setNames(tmp_names.join(';'))
    };

    return (
        <>
            <Alert className={clsx({[classes.hide]: hide})} onClose={() => {
                setHide(!hide)
            }} severity="error">
                <AlertTitle>Ошибка</AlertTitle>Моделей нет или не загружен файл</Alert>
            <Dialog open={saveNewFile} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Сохранение моделей</DialogTitle>
                <DialogContent>
                    <Typography>Частота дискретизации
                        - {props.fd}</Typography>
                    <Typography>Кол-во отсчетов
                        - {props.samples}</Typography>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Имя сигнала</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/*{(props.channels.map((channel: string) => (*/}
                            {/*    <TableRow key={channel}>*/}
                            {/*        <TableCell component="th" scope="row">*/}
                            {/*            {channel}*/}
                            {/*        </TableCell>*/}
                            {/*        <TableCell align="center">*/}
                            {/*            <Checkbox*/}
                            {/*                id={channel}*/}
                            {/*                color="primary"*/}
                            {/*                inputProps={{'aria-label': 'secondary checkbox'}}*/}
                            {/*                onChange={handleChangeNames}*/}
                            {/*            />*/}
                            {/*        </TableCell>*/}
                            {/*    </TableRow>*/}
                            {/*)))}*/}
                        </TableBody>
                    </Table>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        variant='outlined'
                        margin="dense"
                        id="from"
                        label={'Название файла'}
                        type="text"
                        defaultValue={modelsFile}
                        onChange={name => setModelsFile(name.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={saveNewFileAs} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={saveModels} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Сохранение моделей</DialogTitle>
                <DialogContent>
                    <Typography>Текущий файл - {localStorage.getItem('file')}</Typography>
                    <Typography>Частота дискретизации
                        - {props.fd}</Typography>
                    <Typography>Кол-во отсчетов
                        - {props.samples}</Typography>
                    <Typography>Добавление моделей</Typography>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Имя сигнала</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/*{props.channels.map((channel: string) => (*/}
                            {/*    <TableRow key={channel}>*/}
                            {/*        <TableCell component="th" scope="row">*/}
                            {/*            {channel}*/}
                            {/*        </TableCell>*/}
                            {/*        <TableCell align="center">*/}
                            {/*            <Checkbox*/}
                            {/*                id={channel}*/}
                            {/*                color="primary"*/}
                            {/*                inputProps={{'aria-label': 'secondary checkbox'}}*/}
                            {/*                onChange={handleChangeNames}*/}
                            {/*            />*/}
                            {/*        </TableCell>*/}
                            {/*    </TableRow>*/}
                            {/*))}*/}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={updateFile} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openNewModelParams} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Задание данных</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label="Частота дискретизации"
                        type="number"
                        defaultValue={f}
                        onChange={num => setF(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label="Кол-во отсчетов"
                        type="number"
                        defaultValue={samples}
                        onChange={num => setSamples(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={redirect} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSinusoida} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                    <Button onClick={newSinusoida} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openInfo} onClose={handleClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Текущее состояние многоканального сигнала"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className={classes.dialog}>
                        <p>Общее число каналов - {props.channels.length}</p>
                        <p>Общее количество отсчетов – {props.samples}</p>
                        <p>Частота дискретизации – {props.fd} Гц(шаг между отсчетами {1/props.fd} сек.)</p>
                        <p>Дата и время начала записи - {props.startTime}</p>
                        <p>Дата и время окончания записи - {props.endTime}</p>
                        <p>Информация о каналах</p>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Имя сигнала</TableCell>
                                    <TableCell align="center">Источник</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.channels.map((channel: string) => (
                                    <TableRow key={channel}>
                                        <TableCell component="th" scope="row">
                                            {channel}
                                        </TableCell>
                                        <TableCell align="center">Файл: {props.file}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openModels} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                    <Button onClick={getNewSignal} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openExponent} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                        defaultValue={exponent}
                        onChange={num => setExponent(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewSignal} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openComplexModels} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                        defaultValue={getDefaultOgib(current)}
                        onChange={num => setDefaultOgib(current, +num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[2] : ''}
                        type="number"
                        defaultValue={getDefaultNesuch(current)}
                        onChange={num => setDefaultNesuch(current, +num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[3] : ''}
                        type="number"
                        defaultValue={startNesuch}
                        onChange={num => setStartNesuch(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewComplexSignal} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openTonal} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                        defaultValue={tonalOgib}
                        onChange={num => setTonalOgib(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        variant='outlined'
                        label={getParamsNames(current) !== undefined ? getParamsNames(current)[2] : ''}
                        type="number"
                        defaultValue={tonalNesuch}
                        onChange={num => setTonalNesuch(+num.target.value)}
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
                        defaultValue={startNesuch}
                        onChange={num => setStartNesuch(+num.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getNewTonalModel} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
            <Toolbar className={classes.toolbar}>
                <Link color="inherit" className={classes.toolbarLink} to="/" onClick={dropData}>
                    <Typography component="h2" variant="h5" color="inherit" align="center"
                                className={classes.toolbarTitle}>
                        {props.title}
                    </Typography>
                </Link>
            </Toolbar>
            <Toolbar component="nav" variant="dense" className={clsx(classes.toolbarSecondary, {
                [classes.width1300px]: !(window.location.href.includes("mod") || window.location.href.includes("gram")),
                [classes.width1000px]: (window.location.href.includes("mod") || window.location.href.includes("gram"))
                
            })}>
                <Button color="inherit" aria-controls="file" aria-haspopup="true" onClick={handleClickFile}
                        className={classes.toolbarBtn}>
                    <Typography variant="h6">Файл</Typography>
                </Button>
                <Button color="inherit" aria-controls="grams" aria-haspopup="true" onClick={handleClickGrams}
                        className={classes.grams}>
                    <Typography variant="h6">Осцилограммы</Typography>
                </Button>
                <Button color="inherit" aria-controls="models" aria-haspopup="true" onClick={handleClickModels}
                        className={classes.grams}>
                    <Typography variant="h6">Моделирование</Typography>
                </Button>
                {sections.map((section: Section, number) => (
                    <Link color="inherit" key={number} to={section.url}
                          className={classes.toolbarLink}>
                        <Typography variant="h6">{section.title}</Typography>
                    </Link>
                ))}
            </Toolbar>
            <Menu
                id="grams"
                anchorEl={anchorGrams}
                keepMounted
                open={Boolean(anchorGrams)}
                onClose={handleClose}>
                {props.channels.map((channel: string, number: number) => (
                    <MenuItem onClick={newOscillogram} key={number} id={channel}>{channel}</MenuItem>
                ))}
            </Menu>
            <Menu
                id="file"
                anchorEl={anchorFile}
                keepMounted
                open={Boolean(anchorFile)}
                onClose={handleClose}>
                <Link color="inherit" to={"/upload-file"}
                      className={classes.Link}><MenuItem onClick={handleClose}>Загрузить файл</MenuItem></Link>
                <MenuItem onClick={getInfo}>Информация о файле</MenuItem>
                <MenuItem onClick={saveFile}>Сохранить файл</MenuItem>
                <MenuItem onClick={saveFileAs}>Сохранить как...</MenuItem>
            </Menu>
            <Menu
                id="models"
                anchorEl={anchorModels}
                keepMounted
                open={Boolean(anchorModels)}
                onClose={handleClose}>
                <MenuItem onClick={deleteSignals}>Удалить все сигналы</MenuItem>
                <MenuItem onClick={newSignal} id={'impulse'}>Задержанный единичный имульс</MenuItem>
                <MenuItem onClick={newSignal} id={'jump'}>Задержанный единичный скачок </MenuItem>
                <MenuItem onClick={newExponent} id={'exponent'}>Дискретизированная убывающая экспонента</MenuItem>
                <MenuItem onClick={getSinusoida} id={'sin'}>Дискретизированная синусоида</MenuItem>
                <MenuItem onClick={newSignal} id={'meandr'}>«Меандр» с периодом L </MenuItem>
                <MenuItem onClick={newSignal} id={'pila'}>“Пила” с периодом L</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'exp_ogub'}>Сигнал с экспоненциальной огибающей </MenuItem>
                <MenuItem onClick={newComplexSignal} id={'balance_ogib'}>Сигнал с балансной огибающей </MenuItem>
                <MenuItem onClick={newTonalOgib} id={'tonal_ogib'}>Сигнал с тональной огибающей</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'linear_module'}>Сигнал с линейной частотной
                    модуляцией</MenuItem>
                <RandomSignals update={props.update} close={handleClose}/>
                {/*<Superposition channelsFile={data?.channelsName} update={props.update} close={handleClose}/>*/}
            </Menu>
        </>
    );
}

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link, useHistory} from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem, TextField
} from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import {Alert, AlertTitle} from "@material-ui/lab";

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
    }
}));

interface Section {
    title: string,
    url: string,
}

interface Data {
    channelsNumber: number,
    samplesNumber: number,
    samplingRate: number,
    start: string,
    end: string,
    times: Array<number>,
    channelsName: Array<string>,
    signals: any,
    time: number,
    file: string
}

const sections = [
    {title: 'Фильтрация', url: '#'},
    {title: 'Настройки', url: '#'},
];

export default function Header(props: { title: any, file: any, update: any }) {
    const classes = useStyles();
    const title = props.title;
    const history = useHistory();

    const [argument, setArgument] = useState(1)
    const [discrete, setDiscrete] = useState(1)
    const [interval, setInterval] = useState(1)
    const [current, setCurrent] = useState('')
    const [f, setF] = useState(1)
    const [samples, setSamples] = useState(1)
    const [ampl, setAmpl] = useState(0)
    const [circle, setCircle] = useState(0)
    const [startPhase, setStartPhase] = useState(0)
    const [ogib, setOgib] = useState(0)
    const [nesuch, setNesuch] = useState(0)
    const [startNesuch, setStartNesuch] = useState(0)
    const [glubina, setGlubina] = useState(0)

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
        // if (!window.location.href.includes("model") && !window.location.href.includes("grams")) {
        //     history.push('/modeling/')
        // }
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

    const [data, setData] = useState<Data>()

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/model-data/?id=' + props.file);
            setData(result.data);
        }

        getData();
    }, [setData]);

    function getInfo() {
        setOpenInfo(true);
        setAnchorFile(null);
    }

    const [openInfo, setOpenInfo] = React.useState(false);
    const [openModels, setOpenModels] = React.useState(false);
    const [openComplexModels, setOpenComplexModels] = React.useState(false);
    const [openTonal, setOpenTonal] = React.useState(false);
    const [openNewModelParams, setOpenNewModelParams] = React.useState(false);
    const [openSinusoida, setOpenSinusoida] = React.useState(false);
    const [hide, setHide] = useState(true)

    const handleCloseDialog = () => {
        setOpenInfo(false);
        setOpenModels(false);
        setOpenComplexModels(false);
        setOpenNewModelParams(false);
        setOpenSinusoida(false);
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
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{type: current, args: argument, name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`}]
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
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: `${ampl}:${ogib}:${nesuch}:${startNesuch}`,
            name: `Model_${oldSignals.length}_0`
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
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        const signal = [{
            type: current,
            args: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`,
            name: `Model_${oldSignals.length}_0`
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
        const signal = [{type: current, args: `${ampl}:${circle}:${startPhase}`, name: `Model_${oldSignals === null ? 0 : oldSignals.length}_0`}]
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signal.concat(oldSignals)))
        } else {
            localStorage.setItem('models', JSON.stringify(signal))
        }
        props.update()
    }

    function saveFile() {
        if (JSON.parse(localStorage.getItem('models') as string) !== null) {
            console.log(localStorage.getItem("fd"), localStorage.getItem('samples'))
            const response = axios.post('http://localhost:3081/sendModels', {fd: 1})
        } else {
            setHide(false)
        }
    }

    const types = {
        'impulse': 'Задержанный единичный импульс',
        'jump': 'Задержанный единичный скачок',
        'exponent': 'Дискретизированная убывающая экспонента',
        'sin': 'Дискретизированная синусоида',
        'meandr': "'Меандр'",
        'pila': "'Пила'",
        'exp_ogub': 'Сигнал с экспоненциальной огибающей',
        'balance_ogib': 'Сигнал с балансной огибающей',
        'tonal_ogib': 'Сигнал с тональной огибающей',
        'linear_module': 'Сигнал с линейной частотной модуляцией'
    }

    function getType(name: string) {
        // @ts-ignore
        return types[name];
    }

    return (
        <React.Fragment>
            <Alert className={clsx({[classes.hide]: hide})} onClose={() => {
                setHide(!hide)
            }} severity="error">
                <AlertTitle>Ошибка</AlertTitle>Моделей нет</Alert>
            <Dialog open={openNewModelParams} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Задание данных</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
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
                <DialogTitle id="form-dialog-title">Задание данных</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Амплитуда"
                        type="number"
                        defaultValue={ampl}
                        onChange={num => setAmpl(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Круговая частота"
                        type="number"
                        defaultValue={circle}
                        onChange={num => setCircle(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Начальная фаза"
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
                        <p>Общее число каналов - {data?.channelsNumber}</p>
                        <p>Общее количество отсчетов – {data?.samplesNumber}</p>
                        <p>Частота дискретизации – {data?.samplingRate} Гц(шаг между отсчетами {data?.time})</p>
                        <p>Дата и время начала записи - {data?.start.replace("T", " ")}</p>
                        <p>Дата и время окончания записи - {data?.end.replace("T", " ")}</p>
                        <p>Информация о каналах</p>
                        <div>{data?.channelsName.map((channel, number) => (
                            <Typography component={"p"} key={number}>{channel}</Typography>
                        ))}</div>
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
                    <Typography>Частота дискретизации: {data?.samplingRate !== undefined ? data?.samplingRate : localStorage.getItem('fd')}</Typography>
                    <Typography>Кол-во отсчетов: {data?.samplesNumber !== undefined ? data?.samplesNumber : localStorage.getItem('samples')}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Параметр n0"
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
            <Dialog open={openComplexModels} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Тип: {getType(current)}</Typography>
                    <Typography>Частота дискретизации: {data?.samplingRate !== null ? data?.samplingRate : f}</Typography>
                    <Typography>Кол-во отсчетов: {data?.samplesNumber !== null ? data?.samplesNumber : samples}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Амплитуда сигнала"
                        type="number"
                        defaultValue={ampl}
                        onChange={num => setAmpl(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Частота огибающей"
                        type="number"
                        defaultValue={ogib}
                        onChange={num => setOgib(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Частота несущей"
                        type="number"
                        defaultValue={nesuch}
                        onChange={num => setNesuch(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Начальная фаза несущей"
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
                    <Typography>Частота дискретизации: {data?.samplingRate !== null ? data?.samplingRate : f}</Typography>
                    <Typography>Кол-во отсчетов: {data?.samplesNumber !== null ? data?.samplesNumber : samples}</Typography>
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Индекс глубины модуляции"
                        type="number"
                        defaultValue={glubina}
                        onChange={num => setGlubina(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Амплитуда сигнала"
                        type="number"
                        defaultValue={ampl}
                        onChange={num => setAmpl(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Частота огибающей"
                        type="number"
                        defaultValue={ogib}
                        onChange={num => setOgib(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Частота несущей"
                        type="number"
                        defaultValue={nesuch}
                        onChange={num => setNesuch(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Начальная фаза несущей"
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
                <Link color="inherit" className={classes.toolbarLink} to="/">
                    <Typography component="h2" variant="h5" color="inherit" align="center"
                                className={classes.toolbarTitle}>
                        {title}
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
                {(data?.channelsName && data?.channelsName.length > 0) ? (data?.channelsName.map((channel, number) => (
                    <MenuItem onClick={newOscillogram} key={number} id={channel}>{channel}</MenuItem>
                ))) : <MenuItem>Файл не загружен</MenuItem>}
            </Menu>
            <Menu
                id="file"
                anchorEl={anchorFile}
                keepMounted
                open={Boolean(anchorFile)}
                onClose={handleClose}>
                <Link color="inherit" to={"/file"}
                      className={classes.Link}><MenuItem onClick={handleClose}>Загрузить файл</MenuItem></Link>
                <MenuItem onClick={getInfo}>Информация о файле</MenuItem>
                <MenuItem onClick={saveFile}>Сохранить файл</MenuItem>
                <MenuItem onClick={getInfo}>Сохранить как...</MenuItem>
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
                <MenuItem onClick={newSignal} id={'exponent'}>Дискретизированная убывающая экспонента</MenuItem>
                <MenuItem onClick={getSinusoida} id={'sin'}>Дискретизированная синусоида</MenuItem>
                <MenuItem onClick={newSignal} id={'meandr'}>«Меандр» с периодом L </MenuItem>
                <MenuItem onClick={newSignal} id={'pila'}>“Пила” с периодом L</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'exp_ogub'}>Сигнал с экспоненциальной огибающей </MenuItem>
                <MenuItem onClick={newComplexSignal} id={'balance_ogib'}>Сигнал с балансной огибающей </MenuItem>
                <MenuItem onClick={newTonalOgib} id={'tonal_ogib'}>Сигнал с тональной огибающей</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'linear_module'}>Сигнал с линейной частотной
                    модуляцией</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

Header.propTypes = {
    sections: PropTypes.array,
    title: PropTypes.string,
};

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


export default function Header(props: { title: any, file : any }) {
    const classes = useStyles();
    const title = props.title;
    const history = useHistory();

    const [argument, setArgument] = useState(1)
    const [discrete, setDiscrete] = useState(1)
    const [interval, setInterval] = useState(1)
    const [signals, setSignals] = useState([])
    const [current, setCurrent] = useState('')

    const [anchorFile, setAnchorFile] = React.useState<null | HTMLElement>(null);
    const [anchorGrams, setAnchorGrams] = React.useState<null | HTMLElement>(null);
    const [anchorModels, setAnchorModels] = React.useState<null | HTMLElement>(null);

    const handleClickFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFile(event.currentTarget);
    };

    const handleClickGrams = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorGrams(event.currentTarget);
    };

    const handleClickModels = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorModels(event.currentTarget);
        if (!window.location.href.includes("model")) {
            history.push('/modeling/')
        }
    };

    const handleClose = () => {
        setAnchorFile(null);
        setAnchorGrams(null);
        setAnchorModels(null)
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



    const handleCloseDialog = () => {
        setOpenInfo(false);
        setOpenModels(false);
        setOpenComplexModels(false);
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
    function getNewSignal() {
        setOpenModels(false);
        //@ts-ignore
        const oldSignals = JSON.parse(localStorage.getItem('models'))
        //@ts-ignore
        setSignals([{name: current, args: argument}])
        if (oldSignals !== null) {
            //@ts-ignore
            localStorage.setItem('models', JSON.stringify(signals.concat(oldSignals)))
        } else if (signals.length > 0) {
            localStorage.setItem('models', JSON.stringify(signals))
        }
    }
    function getNewComplexSignal() {
        setOpenComplexModels(false);
        //@ts-ignore
        setSignals(signals.concat([{name: current, args: discrete + ':' + interval}]))
    }

    function deleteSignals() {
        console.log("calls")
        setSignals([])
        setAnchorModels(null)
    }

    return (
        <React.Fragment>
            <Dialog
                open={openInfo}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
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
                        <div>{data?.channelsName.map( (channel, number) => (
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
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Дискретный аргумент"
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
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Частота дискретизации"
                        type="number"
                        defaultValue={discrete}
                        onChange={num => setDiscrete(+num.target.value)}
                    />
                    <TextField
                        style={{marginRight: '10px'}}
                        autoFocus
                        margin="dense"
                        id="from"
                        label="Временный интервал"
                        type="number"
                        defaultValue={interval}
                        onChange={num => setInterval(+num.target.value)}
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
                {(data?.channelsName && data?.channelsName.length > 0) ? (data?.channelsName.map( (channel, number) => (
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
                <MenuItem onClick={newSignal} id={'sin'}>Дискретизированная синусоида</MenuItem>
                <MenuItem onClick={newSignal} id={'meandr'}>«Меандр» с периодом L </MenuItem>
                <MenuItem onClick={newSignal} id={'pila'}>“Пила” с периодом L</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'exp_ogub'}>Сигнал с экспоненциальной огибающей </MenuItem>
                <MenuItem onClick={newComplexSignal} id={'balance_ogib'}>Сигнал с балансной огибающей </MenuItem>
                <MenuItem onClick={newComplexSignal} id={'tonal_ogib'}>Сигнал с тональной огибающей</MenuItem>
                <MenuItem onClick={newComplexSignal} id={'linear_modul'}>Сигнал с линейной частотной модуляцией</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

Header.propTypes = {
    sections: PropTypes.array,
    title: PropTypes.string,
};

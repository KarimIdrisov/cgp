import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
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
import clsx from "clsx";
import {Alert, AlertTitle} from "@material-ui/lab";

import dropData from '../../utils/dropData';
import Impulse from "../Models/Impulse";
import Leap from "../Models/Leap";
import Exponent from "../Models/Exponent";
import Sinusoida from "../Models/Sinusoida";
import Meandr from "../Models/Meandr";
import Pila from "../Models/Pila";
import ExpEnvelope from "../Models/ExpEnvelope";
import BalanceEnvelope from "../Models/BalanceEnvelope";
import TonalEnvelope from "../Models/TonalEnvelope";
import LinearModule from "../Models/LinearModule";
import RandomSignals from "../Models/RandomSignals";
import Superposition from "../Models/Superposition";
import DiscreteSignals from "../Models/DiscreteSignals";
import {red} from "@material-ui/core/colors";
import getParamsNames from "../../utils/getParamsNames";

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

export default function Header(props: any) {
    const classes = useStyles();
    const [modelsFile, setModelsFile] = useState('')
    const [k, setK] = useState(0)

    const [anchorFile, setAnchorFile] = React.useState<null | HTMLElement>(null);
    const [anchorGrams, setAnchorGrams] = React.useState<null | HTMLElement>(null);
    const [anchorModels, setAnchorModels] = React.useState<null | HTMLElement>(null);
    const [anchorStatistic, setAnchorStatistic] = React.useState<null | HTMLElement>(null);
    const [anchorAnalyse, setAnchorAnalyse] = React.useState<null | HTMLElement>(null);
    const [anchorSpectreAnalyse, setAnchorSpectreAnalyse] = React.useState<null | HTMLElement>(null);
    const [anchorSettings, setAnchorSettings] = React.useState<null | HTMLElement>(null);

    const [names, setNames] = React.useState('')

    const handleClickFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFile(event.currentTarget);
    };

    const handleClickGrams = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorGrams(event.currentTarget);
    };

    const handleClickModels = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.checkAnalyse()
        setAnchorModels(event.currentTarget);
    };

    const handleClickStatistics = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorStatistic(event.currentTarget);
    };

    const handleClickAnalyse = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorAnalyse(event.currentTarget);
    };

    const handleClickSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorSettings(event.currentTarget);
    };

    const handleClickSpectreAnalyse = (event: React.MouseEvent<HTMLLIElement>) => {
        if (props.haveOscillogram) {
            redirectOnAnalyse()
            setAnchorAnalyse(null)
            return;
        }
        setAnchorSpectreAnalyse(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorFile(null)
        setAnchorGrams(null)
        setAnchorModels(null)
        setAnchorStatistic(null)
        setAnchorAnalyse(null)
        setAnchorSpectreAnalyse(null)
        setAnchorSettings(null)
    };

    const handleCloseDialog = () => {
        setOpenInfo(false);
        setSaveModels(false)
        setSaveNewFile(false)
    };

    function getInfo() {
        setOpenInfo(true);
        setAnchorFile(null);
    }

    function changeK() {
        setOpenK(true)
        setAnchorSettings(null)
    }

    const [openInfo, setOpenInfo] = React.useState(false);
    const [openK, setOpenK] = React.useState(false);
    const [saveModels, setSaveModels] = React.useState(false);
    const [hide, setHide] = useState(true)
    const [saveNewFile, setSaveNewFile] = useState(false)


    function saveFile() {
        if (props.file === undefined) {
            setAnchorFile(null)
            setHide(false)
            return
        }
        setSaveModels(true)
        setAnchorFile(null)
    }
    function updateFile() {
        setSaveModels(false)
        props.update(names)
        setNames('')
    }

    function saveFileAs() {
        if (props.channels.length > 0) {
            setAnchorFile(null)
            setSaveNewFile(true)
        } else {
            setHide(false)
            setAnchorFile(null)
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

    function deleteSignals() {
        setAnchorFile(null)
        props.delete()
    }

    function addOscillogram(event: any) {
        props.addOscillogram(event.target.id)
        setAnchorGrams(null)
    }

    function getStatistic(event: any) {
        props.getStatistic(event.target.id)
        setAnchorStatistic(null)
    }

    function saveNewFileAs() {
        setSaveNewFile(false)
        props.saveNew(names, modelsFile)
        setNames('')
    }

    function redirectOnAnalyse() {
        props.newAnalyseFromOscillograms()
    }

    function getAnalyse(event: any) {
        props.newAnalyseFromName(event.target.id)
        setAnchorSpectreAnalyse(null)
    }

    function setNewK() {
        props.updateK(k)
        setOpenK(false)
    }


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
                            {props.channels.map((channel: string) => (
                                <TableRow key={channel}>
                                    <TableCell component="th" scope="row">
                                        {channel}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            id={channel}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            onChange={handleChangeNames}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
                    <Typography>Текущий файл - {props.file}</Typography>
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
                            {props.channels.map((channel: string) => (
                                <TableRow key={channel}>
                                    <TableCell component="th" scope="row">
                                        {channel}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            id={channel}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            onChange={handleChangeNames}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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

            <Dialog open={openInfo} onClose={handleClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Текущее состояние многоканального сигнала"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className={classes.dialog}>
                        <p>Общее число каналов - {props.channels.length}</p>
                        <p>Общее количество отсчетов – {props.samples}</p>
                        <p>Частота дискретизации – {props.fd} Гц(шаг между отсчетами {1 / props.fd} сек.)</p>
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
                                        <TableCell
                                            align="center">{channel.includes('Model') ? (props.sources[channel]) : (props.file)}</TableCell>
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

            <Dialog open={openK} onClose={handleClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Текущее состояние многоканального сигнала"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className={classes.dialog}>
                        <Typography>Текущее - {props.k}</Typography>
                        <TextField
                            style={{marginRight: '10px'}}
                            autoFocus
                            margin="dense"
                            variant='outlined'
                            type="number"
                            defaultValue={props.k}
                            onChange={num => setK(+num.target.value)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setNewK} color="primary" autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>

            <Toolbar className={classes.toolbar}>
                <Link color="inherit" className={classes.toolbarLink} to="/" onClick={dropData}>
                    <Typography component="h2" variant="h5" color="inherit" align="center"
                                className={classes.toolbarTitle}>
                        CGP-DSP
                    </Typography>
                </Link>
                <Toolbar>

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
                    <Button color="inherit" aria-controls="models" aria-haspopup="true" onClick={handleClickAnalyse}
                            className={classes.grams}>
                        <Typography variant="h6">Анализ</Typography>
                    </Button>
                    <Button color="inherit" aria-controls="models" aria-haspopup="true" onClick={handleClickSettings}
                            className={classes.grams}>
                        <Typography variant="h6">Настройки</Typography>
                    </Button>
                </Toolbar>
            </Toolbar>
            <Menu
                id="grams"
                anchorEl={anchorGrams}
                keepMounted
                open={Boolean(anchorGrams)}
                onClose={handleClose}>
                {props.channels.map((channel: string, number: number) => (
                    <MenuItem key={number} id={channel} onClick={addOscillogram}>{channel}</MenuItem>
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
                id="file"
                anchorEl={anchorSettings}
                keepMounted
                open={Boolean(anchorSettings)}
                onClose={handleClose}>
                <MenuItem onClick={changeK}>Изменить кол-во интервалов</MenuItem>
            </Menu>

            <Menu
                id="models"
                anchorEl={anchorModels}
                keepMounted
                open={Boolean(anchorModels)}
                onClose={handleClose}>
                <DiscreteSignals samples={props.samples} close={handleClose} fd={props.fd}
                                 addNewSignal={props.addNewSignal}/>
                <RandomSignals samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal}/>
                <Superposition samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal} channels={props.channels}/>
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
                id="statistic"
                anchorEl={anchorAnalyse}
                keepMounted
                open={Boolean(anchorAnalyse)}
                onClose={handleClose}>
                <MenuItem onClick={handleClickStatistics}>Статистика</MenuItem>
                <MenuItem onClick={handleClickSpectreAnalyse}>Спектральный анализ</MenuItem>
            </Menu>

            <Menu
                id="statistic"
                anchorEl={anchorSpectreAnalyse}
                keepMounted
                open={Boolean(anchorSpectreAnalyse)}
                onClose={handleClose}>
                {props.channels.map((channel: string, number: number) => (
                            <MenuItem key={number} id={channel} onClick={getAnalyse}>{channel}</MenuItem>
                    ))}
            </Menu>

            <Menu
                id="statistic"
                anchorEl={anchorStatistic}
                keepMounted
                open={Boolean(anchorStatistic)}
                onClose={handleClose}>
                {props.channels.map((channel: string, number: number) => (
                    <MenuItem key={number} id={channel} onClick={getStatistic}>{channel}</MenuItem>
                ))}
            </Menu>
        </>
    );
}

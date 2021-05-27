import React, {useState} from 'react';
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
import axios from "axios";
import RandomSignals from "../Models/RandomSignals";
import Superposition from "../Models/Superposition";

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
];

export default function FileHeader(props: any) {
    const classes = useStyles();
    const [modelsFile, setModelsFile] = useState('')

    const [anchorFile, setAnchorFile] = React.useState<null | HTMLElement>(null);
    const [anchorGrams, setAnchorGrams] = React.useState<null | HTMLElement>(null);
    const [anchorModels, setAnchorModels] = React.useState<null | HTMLElement>(null);

    const [names, setNames] = React.useState('')

    const handleClickFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFile(event.currentTarget);
    };

    const handleClickGrams = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorGrams(event.currentTarget);
    };

    const handleClickModels = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorModels(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorFile(null)
        setAnchorGrams(null)
        setAnchorModels(null)
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
    const [openInfo, setOpenInfo] = React.useState(false);
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

    function saveNewFileAs() {
        setSaveNewFile(false)
        props.saveNew(names, modelsFile)
        setNames('')
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

            <Toolbar className={classes.toolbar}>
                <Link color="inherit" className={classes.toolbarLink} to="/" onClick={dropData}>
                    <Typography component="h2" variant="h5" color="inherit" align="center"
                                className={classes.toolbarTitle}>
                        {props.title}
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
                    {sections.map((section: Section, number) => (
                        <Link color="inherit" key={number} to={section.url}
                              className={classes.toolbarLink}>
                            <Typography variant="h6">{section.title}</Typography>
                        </Link>
                    ))}
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
                id="models"
                anchorEl={anchorModels}
                keepMounted
                open={Boolean(anchorModels)}
                onClose={handleClose}>
                <MenuItem onClick={deleteSignals}>Удалить все сигналы</MenuItem>
                <Impulse samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Leap samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Exponent samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Sinusoida samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Meandr samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Pila samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <ExpEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                             addNewSignal={props.addNewSignal}/>
                <BalanceEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                                 addNewSignal={props.addNewSignal}/>
                <TonalEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal}/>
                <LinearModule samples={props.samples} close={handleClose} fd={props.fd}
                              addNewSignal={props.addNewSignal}/>
                <RandomSignals samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal}/>
                <Superposition samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal} channels={props.channels}/>
            </Menu>
        </>
    );
}

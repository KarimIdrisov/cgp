import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link, useHistory} from 'react-router-dom';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField
} from "@material-ui/core";
import clsx from "clsx";
import dropData from '../utils/dropData';

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
        overflowX: 'auto',

    },
    toolbarLink: {
        padding: theme.spacing(0.5),
        flexShrink: 0,
        fontSize: "1.2rem",
        color: "#333",
        textDecoration: "none",
    },
    toolbarBtn: {
        height: "30px",
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

export default function Header(props: any) {
    const classes = useStyles();
    const history = useHistory();

    const [anchorFile, setAnchorFile] = React.useState<null | HTMLElement>(null);
    const [openNewModelParams, setOpenNewModelParams] = React.useState(false);

    const [f, setF] = React.useState(1)
    const [samples, setSamples] = React.useState(1000)

    const handleClickFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFile(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorFile(null)
    };

    const handleCloseDialog = () => {
        setOpenNewModelParams(false);
    };

    const handleClickModels = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenNewModelParams(true)
    };

    function redirect() {
        localStorage.setItem('samples', samples.toString())
        localStorage.setItem('fd', f.toString())
        history.push('/model')
    }

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Link color="inherit" className={classes.toolbarLink} to="/" onClick={dropData}>
                    <Typography component="h2" variant="h5" color="inherit" align="center"
                                className={classes.toolbarTitle}>
                        CGP-DSP
                    </Typography>
                </Link>

                <Toolbar component="nav" variant="dense" className={clsx(classes.toolbarSecondary, {
                    [classes.width1300px]: !(window.location.href.includes("mod") || window.location.href.includes("gram")),
                    [classes.width1000px]: (window.location.href.includes("mod") || window.location.href.includes("gram"))
                })}>
                    <Button color="inherit" aria-controls="file" aria-haspopup="true" onClick={handleClickFile}
                            className={classes.toolbarBtn}>
                        <Typography variant="h6">Файл</Typography>
                    </Button>
                    <Button color="inherit" aria-controls="file" aria-haspopup="true" onClick={handleClickModels}
                            className={classes.toolbarBtn}>
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

            <Dialog open={openNewModelParams} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Задание данных</DialogTitle>
                <DialogContent>
                    <Typography>Файл не загружен</Typography>
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

            <Menu
                id="file"
                anchorEl={anchorFile}
                keepMounted
                open={Boolean(anchorFile)}
                onClose={handleClose}>
                <Link color="inherit" to={"/upload-file"}
                      className={classes.Link}><MenuItem onClick={handleClose}>Загрузить файл</MenuItem></Link>
            </Menu>
        </>
    );
}

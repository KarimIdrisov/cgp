import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem
} from "@material-ui/core";
import axios from "axios";
import Layout from "./Layout";

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
        width: "100px"
    },
    Link: {
        textDecoration: 'none',
        color: "black",
    },
    dialog: {
        color: "black",
    }
}));

interface Props {
    sections: Array<Section>,
    title: string,
}

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

export default function Header(props: Props) {
    const classes = useStyles();
    const {sections, title} = props;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [data, setData] = useState<Data>()
    const file = window.location.href.slice(31)


    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3080/model-data/?id=' + file);
            setData(result.data);
        }

        getData();
    }, [setData]);

    function getInfo() {
        setOpen(true);
        setAnchorEl(null);

    }

    const [open, setOpen] = React.useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Текущее состояние многоканального сигнала"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className={classes.dialog}>
                        {data?.file ? (<p>{file}</p>) : (<p>Файл не загружен</p>)}
                        <p>Общее число каналов - {data?.channelsNumber}</p>
                        <p>Общее количество отсчетов – {data?.samplesNumber}</p>
                        <p>Частота дискретизации – {data?.samplingRate} Гц(шаг между отсчетами {data?.time})</p>
                        <p>Дата и время начала записи - {data?.start.replace("T", " ")}</p>
                        <p>Дата и время окончания записи - {data?.end.replace("T", " ")}</p>
                        <p>Информация о каналах</p>
                        <p>{data?.channelsName.map( channel => (
                            <p>{channel}</p>
                        ))}</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
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
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                <Button color="inherit"  aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}
                      className={classes.toolbarBtn}>
                    <Typography variant="h6">Файл</Typography>
                </Button>
                {sections.map((section: Section, number) => (
                    <Link color="inherit" key={number} to={section.url}
                          className={classes.toolbarLink}>
                        <Typography variant="h6">{section.title}</Typography>
                    </Link>
                ))}
            </Toolbar>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <Link color="inherit" to={"/file"}
                      className={classes.Link}><MenuItem onClick={handleClose}>Загрузить файл</MenuItem></Link>
                <MenuItem onClick={getInfo}>Информация о файле</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

Header.propTypes = {
    sections: PropTypes.array,
    title: PropTypes.string,
};

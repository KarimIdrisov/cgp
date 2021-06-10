import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Typography from "@material-ui/core/Typography";
import {Button, Menu, MenuItem, Select} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tools: {
        margin: 'auto',
        display: 'flex',
        justifyContent: "center"
    },
    btn: {
        textTransform: 'none'
    },
    fragment: {
        display: "flex",
    },
    abs: {
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%'
    },
    active: {
        backgroundColor: "gray"
    }
}));

export default function AnalyseTools(props: any) {
    const classes = useStyles();

    const [anchorTools, setAnchorTools] = React.useState<null | HTMLElement>(null);

    const handleClickTools = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorTools(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorTools(null)
    };

    const [spectre, setSpectre] = React.useState('amplitudeSpectre')
    const [current, setCurrent] = useState('amplitudeSpectre')

    function handleChangeSpectre(event: React.ChangeEvent<{ value: unknown }>) {
        setSpectre(event.target.value as string)
        setCurrent(event.target.value as string)
        props.changeSpectre(event.target.value)
    }

    const [nullSample, setNullSample] = React.useState('zero')

    function handleChangeSample(event: React.ChangeEvent<{ value: unknown }>) {
        props.nullSample(event.target.value as string)
        setNullSample(event.target.value as string)
        setCurrent(event.target.value as string)
    }


    return (
        <div style={{marginTop: '5px'}}>

            <Menu
                id="tools"
                anchorEl={anchorTools}
                keepMounted
                open={Boolean(anchorTools)}
                onClose={handleClose}>
                <MenuItem>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={nullSample}
                        onChange={handleChangeSample}>
                        <MenuItem value='nothing'>Ничего не делать</MenuItem>
                        <MenuItem value='zero'>Обнулить</MenuItem>
                        <MenuItem value='neighbor'>Уровнять с соседним</MenuItem>
                    </Select>
                </MenuItem>
            </Menu>
            <div className={classes.tools}>
                <Button color="inherit" aria-controls="tools" aria-haspopup="true" onClick={handleClickTools}
                        className={classes.btn}>
                    <Typography variant="h6">Настройки</Typography>
                </Button>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={spectre}
                    onChange={handleChangeSpectre}>
                    <MenuItem value={'amplitudeSpectre'}>Амплитудный спектр</MenuItem>
                    <MenuItem value={'spm'}>Спектральная плотность мощности</MenuItem>
                </Select>
            </div>

        </div>
    );
}

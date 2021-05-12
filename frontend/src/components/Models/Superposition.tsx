import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MenuItem} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(6, 0),
    }
}));

export default function Superposition(props: any) {
    const classes = useStyles();

    return (
        <>
            <MenuItem>Суперпозиция каналов</MenuItem>
        </>
    );
}

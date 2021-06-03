import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from '../Footer';
import Header from "../Header";

const useStyles = makeStyles((theme) => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    main: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    margin: {
        marginLeft: '10px',
        marginRight: '10px'
    }
}));

export default function Layout(props: any) {
    const classes = useStyles();
    return (
        <div className={classes.margin}>
            <CssBaseline/>
            <Header title="CGP - DSP"/>
            <main className={classes.main}>
                {props.children}
            </main>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </div>
    );
}

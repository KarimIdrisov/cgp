import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
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
    canvas: {
        width: "300px",
        maxWidth: "300px",
    },
    container: {
        maxWidth: "1050px",
        marginLeft: "10px"
    }
}));

export default function Layout(props: any) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"lg"}>
                <Header title="CGP - DSP"/>
                <main className={classes.main}>
                    {props.children}
                </main>
            </Container>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </React.Fragment>
    );
}

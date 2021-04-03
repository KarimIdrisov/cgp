import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './Header';
import Footer from './Footer';
import Sidebar from "./Sidebar";


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
    console.log("render")

    if(window.location.href.includes('modeling') || window.location.href.includes("grams")) {
        const file = props.file
        return (
            <React.Fragment>
                <CssBaseline/>
                <Container className={classes.container}>
                    <Sidebar file={file}/>
                    <Header title="CGP - DSP" file={file}/>
                    <main className={classes.main}>
                        {props.children}
                    </main>
                </Container>
                <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"lg"}>
                <Header title="CGP - DSP" file={null}/>
                <main className={classes.main}>
                    {props.children}
                </main>
            </Container>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </React.Fragment>
    );
}

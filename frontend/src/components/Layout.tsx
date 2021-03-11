import React, {FunctionComponent, ReactComponentElement} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './Header';
import Footer from './Footer';


const useStyles = makeStyles((theme) => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    main: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    }
}));


const sections = [
    {title: 'Файл', url: '/file'},
    {title: 'Моделирование', url: '/modeling'},
    {title: 'Фильтрация', url: '#'},
    {title: 'Анализ', url: '#'},
    {title: 'Настройки', url: '#'},
    {title: 'Справка', url: '#'},
];

interface Props {
    children: FunctionComponent,
}

export default function Layout(props: any) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth="lg">
                <Header title="CGP - DSP" sections={sections}/>
                <main className={classes.main}>
                    {props.children}
                </main>
            </Container>
            <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В."/>
        </React.Fragment>
    );
}

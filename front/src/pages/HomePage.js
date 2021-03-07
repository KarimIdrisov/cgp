import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from "../components/Layout";
import MainContent from "../components/MainContent";


const useStyles = makeStyles((theme) => ({

}));

const mainFeaturedPost = {
    title:'Проект по компьютерной графике. Лабораторная работа',
    description:
        "Визуализация и моделирование многоканальных сигналов",
    imgText: 'main image description',
};

export default function HomePage(props) {
    const classes = useStyles();
    const { posts, title } = props;

    return (
        <Layout>
            <MainContent post={mainFeaturedPost} />
        </Layout>
    );
}

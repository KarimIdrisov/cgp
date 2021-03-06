import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';


const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));


const sections = [
  { title: 'Файл', url: '#' },
  { title: 'Моделирование', url: '#' },
  { title: 'Фильтрация', url: '#' },
  { title: 'Анализ', url: '#' },
  { title: 'Найстройки', url: '#' },
  { title: 'Справка', url: '#' },
];

const mainFeaturedPost = {
  title:'Проект по компьютерной графике. Лабораторная работа',
  description:
    "Визуализация и моделирование многоканальных сигналов",
  imgText: 'main image description',
};



export default function Layout() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="CGP - DSP" sections={sections} />
        <main>
          <MainContent post={mainFeaturedPost} />
        </main>
      </Container>
      <Footer description="Еловская И.К., Аликулова З.Х., Идрисов К.И., Ким А.В." />
    </React.Fragment>
  );
}

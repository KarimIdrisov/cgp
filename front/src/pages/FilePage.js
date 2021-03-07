import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Layout from "../components/Layout";
import {Typography} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
}));

export default function FilePage(props) {
    const classes = useStyles();
    const { posts, title } = props;

    return (
        <Layout>
            <Typography>File</Typography>
        </Layout>
    );
}

FilePage.propTypes = {
    posts: PropTypes.array,
    title: PropTypes.string,
};

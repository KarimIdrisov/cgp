import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from "../components/Layout";
import Dropzone from "../components/Dropzone"


const useStyles = makeStyles((theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
}));

export default function FilePage() {
    const classes = useStyles();

    return (
        <Layout>
            <Dropzone/>
        </Layout>
    );
}

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Dropzone from 'react-dropzone'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    dropzone: {
        padding: 32,
    },
    dropzoneText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.8,
        }
    }
}))

export default function MainContent(props: any) {
    const classes = useStyles();
    const history = useHistory();

    function onDrop(file: any) {
        const data = new FormData()
        data.append('file', file[0])
        axios.post("http://localhost:3081/upload", data, { // receive two parameter endpoint url ,form data
        })
            .then(res => { // then print response status
                console.log(file)
                if(res.statusText === "OK") {
                    localStorage.setItem("file", file[0].name)
                    history.push("/modeling/" + file[0].name);
                    localStorage.removeItem('models')
                }
            })
    }

    return (
        <Dropzone accept={"text/plain"} onDrop={acceptedFiles => onDrop(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <section>
                    <Paper className={classes.dropzone}>
                        <div {...getRootProps()} className={classes.dropzoneText}>
                            <input {...getInputProps()} />
                            <Typography style={{fontSize: '1.6rem'}}>Перетащите сюда нужные файлы, либо нажмите, а затем
                                выберите нужный файл.</Typography>
                            <hr/>
                            <img
                                src="data:image/png;base64,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"
                                alt="Italian Trulli"
                                width={100} />
                            <hr/>
                        </div>
                    </Paper>
                </section>
            )}
        </Dropzone>
    );
}

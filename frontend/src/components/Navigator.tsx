import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    navigator: {
        width: "1000px",
        height: "100px",
        background: '#dddddd',
        position: "absolute",
        zIndex: 1,
        opacity: 0
    }
}));

export default function Navigator() {

    const classes = useStyles();

    function changeSize() {
        console.log(1)
    }

    return (
        <div className={classes.navigator} onMouseDown={changeSize}>
            <div>

            </div>
        </div>
    );
};

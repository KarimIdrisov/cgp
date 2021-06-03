import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Impulse from "./Impulse";
import Leap from "./Leap";
import Exponent from "./Exponent";
import Sinusoida from "./Sinusoida";
import Meandr from "./Meandr";
import Pila from "./Pila";
import ExpEnvelope from "./ExpEnvelope";
import BalanceEnvelope from "./BalanceEnvelope";
import TonalEnvelope from "./TonalEnvelope";
import LinearModule from "./LinearModule";
import {Menu, MenuItem} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(6, 0),
    },
    menu: {
        marginLeft: 180,
        marginTop: 20
    }
}));

export default function DiscreteSignals(props: any) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <MenuItem onClick={handleClick}>Дискретные модели</MenuItem>
            <Menu
                id="randomModelsMenu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menu}>
                <Impulse samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Leap samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Exponent samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Sinusoida samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Meandr samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <Pila samples={props.samples} close={handleClose} fd={props.fd} addNewSignal={props.addNewSignal}/>
                <ExpEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                             addNewSignal={props.addNewSignal}/>
                <BalanceEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                                 addNewSignal={props.addNewSignal}/>
                <TonalEnvelope samples={props.samples} close={handleClose} fd={props.fd}
                               addNewSignal={props.addNewSignal}/>
                <LinearModule samples={props.samples} close={handleClose} fd={props.fd}
                              addNewSignal={props.addNewSignal}/>
            </Menu>
        </>
    )
}

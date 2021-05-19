import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import axios from "axios";

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

import {useHistory} from "react-router-dom";
import {Menu, MenuItem} from "@material-ui/core";

import CanvasJSReact from '../assets/canvasjs.react';
import ModelHeader from "./Model/ModelHeader";
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
    toolbar: {
        margin: "20px",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    name: {
        display: 'relative',
        top: 10
    }
}));

export default function Oscillogram(props: any) {

    const options = {
        data: [{
            type: "line",
            dataPoints: props.signal
        }]
    }

    return (
        <>
            <div>
                <CanvasJSChart options = {options}
                    /* onRef = {ref => this.chart = ref} */
                />
                <ModelHeader/>
            </div>
        </>
    );
}

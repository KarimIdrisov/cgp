import {makeStyles} from '@material-ui/core/styles';
import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";

am4core.useTheme(am4themes_animated);


const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
}));

export default function Graphic(props: any) {
    const classes = useStyles();
    const chart = useRef(null);
    const [signal, setSignal] = useState(Object);

    useEffect( () => {
        async function getData() {
            const result = await axios.get('http://localhost:3080/get-signal/?file=' + props.file + "&signal=" + props.id);
            setSignal(result.data);
        }

        getData();
    }, [setSignal])

    useLayoutEffect(() => {
        let x = am4core.create(props.id, am4charts.XYChart);

        x.paddingRight = 20;
        x.data = signal["data"];

        let dateAxis = x.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
        // @ts-ignore
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = x.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "time";
        series.dataFields.valueY = "f(x)";
        series.tooltipText = "{valueY.value}";
        x.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        x.scrollbarX = scrollbarX;

        // @ts-ignore
        chart.current = x;

        return () => {
            x.dispose();
        };
    }, [signal]);

    return (
        <></>
    );
}

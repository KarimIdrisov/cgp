import React, {useEffect, useState} from 'react';
import axios from "axios";
import {VictoryAxis, VictoryChart, VictoryLine} from "victory";
import {Menu, MenuItem, Typography} from "@material-ui/core";

const Graphic = React.memo((props: any) => {
    const [signal, setSignal] = useState();

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-osciologram/?file=' + props.file + "&signal=" + props.id);
            setSignal(result.data);
        }
        getData();
    }, [])

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function addGraphic() {
        setAnchorEl(null);
        props.func(props.id)
    }

    function filter(data: any) {
        const maxPoints = 300
        const k = Math.ceil(data?.length / maxPoints)
        return data?.filter(
            (d: any, i: any) => ((i % k) === 0)
        )
    }

    return (
        <div>
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={addGraphic}>Осцилограмма</MenuItem>
            </Menu>
            <div
                aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <Typography style={{textAlign: 'center'}}></Typography>
                <VictoryChart height={200}>
                    <VictoryLine data={filter(signal)} scale={{x: "time", y: "linear"}} style={{
                        data: {stroke: "black"},
                        parent: {border: "1px solid #ccc"},
                    }}
                    />
                    <VictoryAxis crossAxis
                                 standalone={true}
                                 orientation="top"
                                 offsetY={50}
                                 style={{
                                     tickLabels: {opacity: 0}
                                 }}
                                 label={props.id}
                    />
                    <VictoryAxis crossAxis
                                 standalone={true}
                                 orientation="top"
                                 style={{
                                     axis: {opacity: 0.5},
                                     tickLabels: {opacity: 0}
                                 }}
                    />
                    <VictoryAxis crossAxis
                                 standalone={true}
                                 offsetY={50}
                                 orientation="bottom"
                    />
                    <VictoryAxis dependentAxis crossAxis
                                 offsetX={50}
                                 standalone={false}
                                 tickFormat={(t) => `${abbreviateNumber(t)}`}
                    />
                    <VictoryAxis crossAxis
                                 orientation="right"
                                 standalone={false}
                                 style={{
                                     tickLabels: {opacity: 0}
                                 }}
                    />
                </VictoryChart>
            </div>
        </div>
    );
})

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function abbreviateNumber(number: number) {
    const tier = Math.log10(Math.abs(number)) / 3 | 0;
    if (tier === 0) return number;
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;
    return scaled.toFixed(0) + suffix;
}

export default Graphic

import React, {useEffect, useState} from 'react';
import axios from "axios";
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {CircularProgress, Menu, MenuItem, Typography} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    hide: {
        display: 'none'
    },
    progress: {
        marginLeft: '100px',
        marginBottom: '50px'
    }
}));

const Graphic = React.memo((props: any) => {
    const [signal, setSignal] = useState();
    // const [loading, setLoading] = useState(false)
    const classes = useStyles();

    useEffect(() => {
        async function getData() {
            const result = await axios.get('http://localhost:3081/get-osciologram/?file=' + props.file + "&signal=" + props.id);
            setSignal(result.data);
        }

        getData();
        // setLoading(true)
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
        // setLoading(false)
        const maxPoints = 300
        const k = Math.ceil(data?.length / maxPoints)
        let tmpData =  data?.filter(
            (d: any, i: any) => ((i % k) === 0)
        );
        // setLoading(true)
        return tmpData
    }

    return (
        <div>
            {/*<CircularProgress className={clsx(classes.progress,{[classes.hide]: loading})}/>*/}
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={addGraphic}>Осцилограмма</MenuItem>
            </Menu>
            <div
                aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <Typography style={{textAlign: 'center'}}>{props.id}</Typography>
                <VictoryChart height={200}>
                    <VictoryLine data={filter(signal)} scale={{x: "time", y: "linear"}} style={{
                        data: {stroke: "black"},
                        parent: {border: "1px solid #ccc"},
                    }}
                    />
                    <VictoryAxis crossAxis
                                 theme={VictoryTheme.material}
                                 offsetY={50}
                                 standalone={false}
                                 orientation="bottom"

                    />
                    <VictoryAxis dependentAxis crossAxis
                                 theme={VictoryTheme.material}
                                 offsetX={50}
                                 standalone={false}
                                 tickFormat={(t) => `${abbreviateNumber(t)}`}
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

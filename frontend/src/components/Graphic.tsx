import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {LineSegment, VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {Menu, MenuItem, Typography} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
}));

export default function Graphic(props: any) {
    const classes = useStyles();
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
        props.func(props.id)
    }

    return (
        <div>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={addGraphic}>Осцилограмма</MenuItem>
            </Menu>
            <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <Typography style={{textAlign: 'center'}}>{props.id}</Typography>
                <VictoryChart>
                    <VictoryLine data={signal} style={{
                        data: { stroke: "black" },
                        parent: { border: "1px solid #ccc"}
                    }}/>
                    <VictoryAxis crossAxis
                                 width={400}
                                 height={400}
                                 theme={VictoryTheme.material}
                                 offsetY={50}
                                 standalone={false}
                                 label="Time (ms)"
                                 orientation="bottom"
                    />
                    <VictoryAxis dependentAxis crossAxis
                                 width={400}
                                 height={400}
                                 theme={VictoryTheme.material}
                                 offsetX={50}
                                 standalone={false}
                    />
                </VictoryChart>
            </div>
        </div>
    );
}

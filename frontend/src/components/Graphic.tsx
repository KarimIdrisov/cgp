import React, {useEffect, useState} from 'react';
import axios from "axios";
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory";
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
        const maxPoints = 1000
        const k = Math.ceil(data?.length / maxPoints)
        return data?.filter(
            (d: any, i: any) => ((i % k) === 0)
        );
    }

    return (
        <div>
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={addGraphic}>Осцилограмма</MenuItem>
            </Menu>
            <div aria-controls="simple-menu" aria-haspopup="true"  onClick={handleClick}>
                <Typography style={{textAlign: 'center'}}>{props.id}</Typography>
                <VictoryChart>
                    <VictoryLine data={filter(signal)} scale={{x: "time", y: "linear"}} style={{
                        data: { stroke: "black" },
                        parent: { border: "1px solid #ccc"}
                    }}
                    />
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
})

export default Graphic

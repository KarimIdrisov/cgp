import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {Typography} from "@material-ui/core";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid black",
    },
}));

export default function NewModelGraphic(props: any) {

    const [name, setName] = useState()

    useEffect(() => {
        setName(props.id)
    }, [])

    if (props.id === 'impulse') {

    }

    return (
        <div>
            <div>
                <Typography style={{textAlign: 'center'}}>{props.id}</Typography>
                <VictoryChart>
                    <VictoryLine style={{
                        data: {stroke: "black"},
                        parent: {border: "1px solid #ccc"}
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

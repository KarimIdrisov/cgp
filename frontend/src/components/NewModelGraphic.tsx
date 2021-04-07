import React, {useEffect, useState} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {Typography} from "@material-ui/core";

export default function NewModelGraphic(props: any) {

    const [name, setName] = useState()
    const [data, setData] = useState<any>()

    useEffect(() => {
        setName(props.id)
    }, [])

    if (data === undefined && props.id === 'impulse') {
        setData([{x: props.args, y: 1}, {x: props.args, y: 0}])
    }

    return (
        <div>
            <div>
                <Typography style={{textAlign: 'center'}}>{props.id}</Typography>
                <VictoryChart>
                    <VictoryLine
                        data = {data}
                        style={{
                        data: {stroke: "black"},
                        parent: {border: "1px solid #ccc"}
                    }}/>
                    <VictoryAxis crossAxis dependentAxis
                                 width={400}
                                 height={400}
                                 theme={VictoryTheme.material}
                                 offsetY={50}
                                 standalone={false}
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

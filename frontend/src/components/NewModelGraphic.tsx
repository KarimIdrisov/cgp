import React, {useEffect, useState} from 'react';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {Typography} from "@material-ui/core";

export default function NewModelGraphic(props: any) {

    const [name, setName] = useState()
    const [data, setData] = useState<Array<any>>()

    const [fd, setF] = useState(0)
    const [samples, setSamples] = useState(0)
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [arg, setArg] = useState()


    if (props.fd !== 0 && fd === 0) {
        setF(props.fd)
    }

    if (props.samples !== 0 && samples === 0) {
        setSamples(props.samples)
    }

    console.log(fd, samples)

    useEffect(() => {
        const dataTmp = []

        if (props.id === 'impulse') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': i === props.args ? 1 : 0, 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'jump') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': i >= props.args ? 1 : 0, 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'exponent') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': Math.pow(props.args, i), 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'sin') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': args[0] * Math.sin(i * args[1] + args[2]), 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'meandr') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': i % props.args > props.args / 2 ? -1 : 1, 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'pila') {
            const start = new Date('01-01-2000')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({'y': (i % props.args) / 2, 'x': i})
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'balance_ogib') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * args[1] * i) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'exp_ogub') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.exp(-i / args[1]) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'tonal_ogib') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * (1 + args[4] * Math.cos(2 * Math.PI * args[1] * i)) * Math.cos(2 * Math.PI * args[2] * i + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.id)
        }
        if (props.id === 'linear_module') {
            const start = new Date('01-01-2000')
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                const tmp = new Date(start.getTime() + (i * (1 / fd)) * 1000)
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * ((args[1] + (args[2] - args[1]) / (samples * fd)) * i) + args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.id)
        }
    }, [setData, setName]);

    if (arg !== props.args) {
        setArg(props.args)
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
            <div>
                <Typography style={{textAlign: 'center'}}>{`Model_${props.num}_1`}</Typography>
                <VictoryChart>
                    {props.id === 'jump' || props.id === 'impulse' ?
                        (<VictoryBar
                            style={{
                                data: {stroke: "black"},
                                parent: {border: "1px solid #ccc"}
                            }}
                            alignment="start"
                            data={filter(data)}
                        />)
                        : <VictoryLine
                            data={filter(data)}
                            style={{
                                data: {stroke: "black"},
                                parent: {border: "1px solid #ccc"}
                            }}/>}
                    <VictoryAxis crossAxis
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

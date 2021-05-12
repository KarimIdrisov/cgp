import React, {useEffect, useState} from 'react';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {Menu, MenuItem, Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";

interface Model {
    type: string,
    args: string,
    name: string
}

export default function NewModelGraphic(props: any) {

    const [name, setName] = useState()
    const [data, setData] = useState<Array<any>>()

    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [arg, setArg] = useState()
    const history = useHistory();

    useEffect(() => {
        const dataTmp = []
        // @ts-ignore
        const samples = +localStorage.getItem("samples")
        // @ts-ignore
        const fd = +localStorage.getItem('fd')
        const k = Math.ceil(samples / 1000)

        if (props.id === 'impulse') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push({'y': i === +props.args ? 1 : 0, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'jump') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push({'y': i >= +props.args ? 1 : 0, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'exponent') {
            for (let i = 0; i < 800; i++) {
                dataTmp.push({'y': Math.pow(+props.args, i), 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'sin') {
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                if (i % k === 0) {
                    dataTmp.push({'y': +args[0] * Math.sin(i * +args[1] + +args[2]), 'x': i})
                }
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'meandr') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push({'y': i % +props.args > +props.args / 2 ? -1 : 1, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'pila') {
            for (let i = 0; i < samples; i++) {
                dataTmp.push({'y': (i % +props.args) / 2, 'x': i})
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'balance_ogib') {
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * +args[1] * i) * Math.cos(2 * Math.PI * +args[2] * i + +args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'exp_ogub') {
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push({
                    'y': args[0] * Math.exp(-i / +args[1]) * Math.cos(2 * Math.PI * +args[2] * i + +args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'tonal_ogib') {
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push({
                    'y': args[0] * (1 + +args[4] * Math.cos(2 * Math.PI * +args[1] * i)) * Math.cos(2 * Math.PI * +args[2] * i + +args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
        if (props.id === 'linear_module') {
            const args = props.args?.split(':')
            for (let i = 0; i < samples; i++) {
                dataTmp.push({
                    'y': args[0] * Math.cos(2 * Math.PI * ((+args[1] + ((+args[2] - +args[1]) * i) / (samples * (1 / fd))) * i) + +args[3]),
                    'x': i
                })
            }
            setData(dataTmp)
            setName(props.name)
        }
    }, [setData, setName]);

    if (arg !== props.args) {
        setArg(props.args)
    }

    function filter(data: any) {
        const maxPoints = 1000
        let k = 0
        if (props.id === 'impulse') {
            k = Math.ceil(data?.length / maxPoints)
            while (props.args % k !== 0) {
                if (isNaN(k)) {
                    break
                }
                k += 1
            }
        } else {
            k = Math.ceil(data?.length / maxPoints)
        }
        return data?.filter(
            (d: any, i: any) => ((i % k) === 0)
        );
    }

    const openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
        setAnchorEl(event.currentTarget);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    function newOscillogram() {
        setAnchorEl(null);
        if (!window.location.href.includes("grams")) {
            history.push("/grams/" + props.name);
        } else {
            const oldChannels = window.location.href.slice(28)
            if (oldChannels.length === 0) {
                history.push("/grams/" + props.name)
            }
            if (!oldChannels.includes(props.name)) {
                history.push('/grams/' + oldChannels + ';' + props.name);
            }
        }
    }

    function deleteSignal() {
        setAnchorEl(null);
        console.log(JSON.parse(localStorage.getItem("models") as string))

        if (window.location.href.includes('modeling')) {
            let models = JSON.parse(localStorage.getItem("models") as string)
            models = models.filter( (model: Model) => model.name !== props.name)
            localStorage.setItem('models', JSON.stringify(models))
            history.push('/modeling')
        }
        if (window.location.href.includes('grams')) {
            let models = JSON.parse(localStorage.getItem("models") as string)
            models = models.filter( (model: Model) => model.name !== props.name)
            localStorage.setItem('models', JSON.stringify(models))
            const oldChannels = window.location.href.slice(28)
            if (oldChannels.length === 1) {
                history.push("/modeling")
            } else {
                let channels = oldChannels.split(';').filter( name => name !== props.name)
                history.push("/grams/" + channels.join(';'))
            }
        }
    }

    return (
        <div>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={newOscillogram}>Осцилограмма</MenuItem>
                <MenuItem onClick={deleteSignal}>Удалить сигнал</MenuItem>
            </Menu>
            <div onClick={openMenu}>
                <Typography style={{textAlign: 'center'}}>{props.name}</Typography>
                <VictoryChart height={200}>
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
                                 theme={VictoryTheme.material}
                                 offsetY={50}
                                 standalone={false}
                                 orientation="bottom"
                    />
                    <VictoryAxis dependentAxis crossAxis
                                 theme={VictoryTheme.material}
                                 offsetX={50}
                                 standalone={false}
                    />
                </VictoryChart>
            </div>
        </div>
    );
}

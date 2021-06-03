import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from '../File/Header';
import axios from "axios";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@material-ui/core";
import Sidebar from "../File/Sidebar";
import Oscillogram from "../File/Oscillogram";
import OscillogramsTools from "../File/OscillogramsTools";
import getNewSignalData from "../../utils/getNewSignalData";
import getType from "../../utils/getType";
import Slider from "../Slider";
import sort from "../../utils/sort";

const useStyles = makeStyles((theme) => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    main: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    canvas: {
        width: "300px",
        maxWidth: "300px",
    },
    container: {
        maxWidth: "1050px",
        marginLeft: "10px",
        display: 'flex',
        flexDirection: 'column'
    },
    progress: {
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        height: '700px',
        width: '100%'
    }
}));

interface Data {
    channelsNumber: number,
    samplesNumber: number,
    samplingRate: number,
    start: Date,
    end: Date,
    channelsName: Array<string>,
    channelsSource: any,
    signals: any,
    signalsXY: any,
    time: number,
    file: string
}

export default function FileLayout(props: any) {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [data, setData] = React.useState<Data>()
    const [modelCount, setModelCount] = React.useState<number>(0)

    const [height, setHeight] = React.useState(100)
    const [min, setMin] = React.useState(0)
    const [max, setMax] = React.useState(data?.samplesNumber)
    const [spline, setSpline] = React.useState(false)
    const [markers, setMarkers] = React.useState(false)
    const [charts, setCharts] = React.useState([])

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue(value => value + 1); // update the state to force render
    }

    // channels for oscillogram
    const [oscillograms, setOscillograms] = React.useState<Array<string>>([])

    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        async function getData() {
            setLoading(true)
            const result = await axios.get('http://localhost:3081/get-file/?id=' + props.file);
            setData(result.data)
            setMax(result.data.samplesNumber)
            setLoading(false)
        }

        getData()
    }, [setData, setOscillograms]);

    function newOscillogram(channel: string) {
        let tmp = oscillograms

        if (tmp !== undefined && !tmp.includes(channel)) {
            tmp.push(channel)
            setOscillograms(tmp)
            forceUpdate()
        }
    }

    function changeSize(number: number) {
        setHeight(number)
        forceUpdate()
    }

    function addNewSignal(type: string, args: string) {
        let res = []
        if (type === 'linear' || type === 'multiplicative') {
            const names = args.split(':')[0]
            const channels = []
            for (let key in data?.signals) {
                if (names.includes(key)) {
                    channels.push(data?.signals[key])
                }
            }

            // @ts-ignore
            res = getNewSignalData(channels, type, args, data?.samplesNumber, data?.samplingRate, new Date(data?.start))
        } else {
            // @ts-ignore
            res = getNewSignalData([], type, args, data?.samplesNumber, data?.samplingRate, new Date(data?.start))
        }
        if (data !== undefined) {
            data?.channelsName.push(`Model_${modelCount}`)

            const tmpSources = data?.channelsSource
            tmpSources[`Model_${modelCount}`] = getType(type)

            const tmpChannels = data?.signals
            tmpChannels[`Model_${modelCount}`] = res[0]

            const tmpChannelsXY = data?.signalsXY
            tmpChannelsXY[`Model_${modelCount}`] = res[1]

            setModelCount(modelCount + 1)
            setData({
                channelsNumber: +data?.channelsNumber + 1,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: data?.channelsName,
                channelsSource: tmpSources,
                signals: tmpChannels,
                signalsXY: tmpChannelsXY,
                time: data?.time,
                file: data?.file
            })
            forceUpdate()
        }

    }

    function setFragment(min: number, max: number) {
        setMin(min)
        setMax(max)
        forceUpdate()
    }

    function dropFragment() {
        setMin(0)
        setMax(data?.samplesNumber)
    }

    function update(names: string) {
        const savedChannels = names.slice(1).split(';')
        if (data !== undefined) {
            const savedSignals: any[] = []
            savedChannels.forEach(channel => {
                if (channel in data?.signals) {
                    savedSignals.push(data?.signals[channel])
                }
            })
            const newData = {
                channelsNumber: savedChannels.length,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: savedChannels,
                signals: savedSignals,
                file: data?.file
            }
            axios.post("http://localhost:3081/updateFile", newData).then(r => console.log(r))
        }
    }

    function updateCharts(ref: any) {
        const tmp = charts
        // @ts-ignore
        tmp.push(ref)
        setCharts(tmp)
    }

    function syncHandler(e: any) {
        const chartsArr = charts;
        // @ts-ignore
        for (let i = 0; i < chartsArr.length; i++) {
            // @ts-ignore
            const chart = chartsArr[i];

            // @ts-ignore
            if (!chart.options.axisX) chart.options.axisX = {};

            // @ts-ignore
            if (!chart.options.axisY) chart.options.axisY = {};

            if (e.trigger === "reset") {
                // @ts-ignore
                chart.options.axisX.viewportMinimum = chart.options.axisX.viewportMaximum = null;
                // @ts-ignore
                chart.options.axisY.viewportMinimum = chart.options.axisY.viewportMaximum = null;

                // @ts-ignore
                chart.render();
            } else if (chart !== e.chart) {
                if (e.axisX === undefined) {
                    // @ts-ignore
                    chart.options.axisX.viewportMinimum = e.minimum;
                    // @ts-ignore
                    chart.options.axisX.viewportMaximum = e.maximum;

                    // @ts-ignore
                    chart.render();
                } else {
                    // @ts-ignore
                    chart.options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
                    // @ts-ignore
                    chart.options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;

                    // @ts-ignore
                    chart.options.axisY.viewportMinimum = e.axisY[0].viewportMinimum;
                    // @ts-ignore
                    chart.options.axisY.viewportMaximum = e.axisY[0].viewportMaximum;

                    // @ts-ignore
                    chart.render();
                }
            }
        }
    }

    function deleteOscillogram(name: string) {
        const tmp = oscillograms.filter(channel => channel !== name)
        setOscillograms(tmp)
        forceUpdate()
    }

    function deleteSignal(name: string) {
        if (data !== undefined) {

            const tmpSources = data?.channelsSource
            delete tmpSources[name]

            const tmpChannels = data?.signals
            delete tmpChannels[name]

            const tmpChannelsXY = data?.signalsXY
            delete tmpChannelsXY[name]

            setData({
                channelsNumber: +data?.channelsNumber - 1,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: data?.channelsName.filter( channel => channel !== name),
                channelsSource: tmpSources,
                signals: tmpChannels,
                signalsXY: tmpChannelsXY,
                time: data?.time,
                file: data?.file
            })
            forceUpdate()
        }
    }

    function saveNew(names: string, file: string) {
        const savedChannels = names.slice(1).split(';')
        if (data !== undefined) {
            const savedSignals: any[] = []
            savedChannels.forEach(channel => {
                if (channel in data?.signals) {
                    savedSignals.push(data?.signals[channel])
                }
            })
            const newData = {
                channelsNumber: savedChannels.length,
                samplesNumber: data?.samplesNumber,
                samplingRate: data?.samplingRate,
                start: data?.start,
                end: data?.end,
                channelsName: savedChannels.join(';'),
                signals: savedSignals,
                file: file
            }
            axios.post("http://localhost:3081/updateFile", newData).then(r => console.log(r))
        }
    }

    function turnInterpolation() {
        setMarkers(!markers)
    }

    function turnSpline() {
        setSpline(!spline)
    }

    const [openStatistic, setOpenStatistic] = React.useState(false);

    const handleClickOpen = () => {
        setOpenStatistic(true);
    };

    const handleClose = () => {
        setOpenStatistic(false);
    };

    const [average, setAverage] = React.useState<number>()
    const [dispersion, setDispersion] = React.useState<number>()
    const [deviation, setDeviation] = React.useState<number>()
    const [variation, setVariation] = React.useState<number>()
    const [asymmetry, setAsymmetry] = React.useState<number>()
    const [excess, setExcess] = React.useState<number>()
    const [minValue, setMinValue] = React.useState<number>()
    const [maxValue, setMaxValue] = React.useState<number>()
    const [quantile05, setQuantile05] = React.useState<number>()
    const [quantile95, setQuantile95] = React.useState<number>()
    const [median, setMedian] = React.useState<number>()

    function getStatistic(name: string) {
        if (data !== undefined) {
            let sum = data?.signals[name].reduce((a: number, b: number) => +a + +b, 0)
            const aver = sum / data?.samplesNumber
            setAverage(aver)

            let dispersionSum = 0
            for (let i = 0; i < data?.signals[name].length; i++) {
                dispersionSum += Math.pow((data?.signals[name][i] - aver), 2)
            }
            const disp = dispersionSum / data?.samplesNumber
            setDispersion(disp)

            setDeviation(Math.sqrt(+disp))

            setVariation(Math.sqrt(+disp) / aver)
            let asymmetrySum = 0
            for (let i = 0; i < data?.signals[name].length; i++) {
                asymmetrySum += Math.pow((data?.signals[name][i] - aver), 3)
            }
            asymmetrySum = asymmetrySum / data?.samplesNumber
            setAsymmetry(asymmetrySum / Math.pow(Math.sqrt(+disp), 3))

            let excessSum = 0
            for (let i = 0; i < data?.signals[name].length; i++) {
                excessSum += Math.pow((data?.signals[name][i] - aver), 4)
            }
            excessSum = excessSum / data?.samplesNumber
            setExcess((excessSum / Math.pow(Math.sqrt(+disp), 4)) - 3)

            setMinValue(Math.min(...data.signals[name]))
            setMaxValue(Math.max(...data.signals[name]))

            const sortedData = sort(data.signals[name])
            setQuantile05(sortedData[Math.round(0.05*data.samplesNumber)])
            setQuantile95(sortedData[Math.round(0.95*data.samplesNumber)])
            setMedian(sortedData[Math.round(0.5*data.samplesNumber)])
        }
        setOpenStatistic(true)
    }

    if (loading) {
        return (
            <div className={classes.progress}>
                <CircularProgress size="6rem"/>
            </div>
        )
    }
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container className={classes.container}>
                <Header samples={data?.samplesNumber} fd={data?.samplingRate}
                        channels={data?.channelsName} file={props.file} addNewSignal={addNewSignal}
                        startTime={data?.start} endTime={data?.end} sources={data?.channelsSource} update={update}
                        addOscillogram={newOscillogram} saveNew={saveNew} getStatistic={getStatistic}
                />
                {oscillograms.length > 0 ? (
                    <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}
                                       setFragment={setFragment} dropFragment={dropFragment}
                                       turnInterpolation={turnInterpolation} turnSpline={turnSpline}/>) : <></>}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {oscillograms.length > 0 ? (
                        <>
                            <Slider signal={data?.signalsXY[data?.channelsName[0]]}
                                    source={data?.channelsSource[data?.channelsName[0]]}
                                    sync={syncHandler} updateRef={updateCharts}
                                    name={oscillograms[0]} height={98} min={min} max={max}
                            />
                        </>) : (<></>)}
                    {oscillograms.length > 0 ? (
                        oscillograms.map((channel, number) => {
                            return (
                                <>
                                    <Oscillogram signal={data?.signalsXY[channel]} key={number}
                                                 source={data?.channelsSource[channel]}
                                                 sync={syncHandler} updateRef={updateCharts}
                                                 name={channel} height={height} min={min} max={max}
                                                 deleteOscillogram={deleteOscillogram}
                                                 spline={spline} markers={markers}
                                    />
                                </>)
                        })
                    ) : (<></>)}
                </div>

                <Sidebar samples={data?.samplesNumber} fd={data?.samplingRate} addOscillogram={newOscillogram}
                         channels={data?.channelsName} file={props.file} sources={data?.channelsSource}
                         signals={data?.signals} signalsXY={data?.signalsXY} min={min} max={max}
                         deleteSignal={deleteSignal} getStatistic={getStatistic}/>
            </Container>

            <Dialog
                open={openStatistic}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Статистика сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Среднее = {average !== undefined ? Math.round(average * 100) / 100 : ''}</Typography>
                    <Typography>Дисперсия = {dispersion !== undefined ? Math.round(dispersion * 100) / 100 : ''}</Typography>
                    <Typography>Ср. кв. откл = {deviation !== undefined ? Math.round(deviation * 100) / 100 : ''}</Typography>
                    <Typography>Коэф. вариации = {variation !== undefined ? Math.round(variation * 100) / 100 : ''}</Typography>
                    <Typography>Коэф. асимметрии = {asymmetry !== undefined ? Math.round(asymmetry * 100) / 100 : ''}</Typography>
                    <Typography>Коэф. эксцесса = {excess !== undefined ? Math.round(excess * 100) / 100 : ''}</Typography>
                    <Typography>Мин. зн-ие сигнала = {minValue !== undefined ? Math.round(minValue * 100) / 100 : ''}</Typography>
                    <Typography>Макс. зн-ие сигнала = {maxValue !== undefined ? Math.round(maxValue * 100) / 100 : ''}</Typography>
                    <Typography>Квантиль порядка 0.05 = {quantile05}</Typography>
                    <Typography>Квантиль порядка 0.95 = {quantile95}</Typography>
                    <Typography>Медиана = {median}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

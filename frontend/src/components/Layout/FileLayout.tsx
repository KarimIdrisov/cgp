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
import sort from "../../utils/sort";
import AnalyseTools from "../File/AnalyseTools";
import getFFT from "../../utils/getFFT";
import Histogram from "../Histogram";
import AnalyseGrams from "../File/AnalyseGrams";
import getFFTPower from "../../utils/getFFTPower";

// @ts-nocheck

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
    file: string,
    sliderData: Array<number>
}

export default function FileLayout(props: any) {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [data, setData] = React.useState<Data>()
    const [modelCount, setModelCount] = React.useState<number>(0)

    const [height, setHeight] = React.useState(100)
    const [min, setMin] = React.useState(0)
    const [max, setMax] = React.useState(data?.samplesNumber)
    const [datetimeMin, setDatetimeMin] = React.useState<number>(0)
    const [datetimeMax, setDatetimeMax] = React.useState<number>(0)
    const [spline, setSpline] = React.useState(false)
    const [markers, setMarkers] = React.useState(false)
    const [charts, setCharts] = React.useState([])
    const [zeroSample, setZeroSample] = React.useState('zero')

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue(value => value + 1); // update the state to force render
    }

    // channels for oscillogram
    const [oscillograms, setOscillograms] = React.useState<Array<string>>([])
    const [analyseSignals, setAnalyseSignals] = React.useState<Array<string>>([])
    const [analyseSignalsSpectreData, setAnalyseSignalSpectreData] = React.useState<Array<object>>([])
    const [analyseSignalsPowerData, setAnalyseSignalPowerData] = React.useState<Array<object>>([])

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
                file: data?.file,
                sliderData: data?.sliderData
            })
            forceUpdate()
        }

    }

    function setFragment(min: number, max: number) {
        setMin(min)
        setMax(max)
        // @ts-ignore
        setDatetimeMin(data?.sliderData[min])
        // @ts-ignore
        setDatetimeMax(data?.sliderData[max])
        forceUpdate()
    }

    function dropFragment() {
        setMin(0)
        setMax(data?.samplesNumber)
        setDatetimeMin(0)
        setDatetimeMax(0)
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


    function syncHandler(event: any) {
        const chartsArr = charts;
        // @ts-ignore
        for (let i = 0; i < chartsArr.length; i++) {
            // @ts-ignore
            const chart = chartsArr[i];

            // @ts-ignore
            if (!chart.options.axisX) chart.options.axisX = {};

            // @ts-ignore
            if (!chart.options.axisY) chart.options.axisY = {};

            if (event.trigger === "reset") {
                // @ts-ignore
                chart.options.axisX.viewportMinimum = chart.options.axisX.viewportMaximum = null;
                // @ts-ignore
                chart.options.axisY.viewportMinimum = chart.options.axisY.viewportMaximum = null;

                setDatetimeMin(0)
                setDatetimeMax(0)
                setMin(0)
                setMax(data?.samplesNumber)

                // @ts-ignore
                chart.render();
            } else {
                setDatetimeMin(event.axisX[0].viewportMinimum)
                setDatetimeMax(event.axisX[0].viewportMaximum)

                // @ts-ignore
                setMin(data.sliderData.indexOf((Math.round(Math.round(event.axisX[0].viewportMinimum) / 1000) * 1000)))
                // @ts-ignore
                setMax(data.sliderData.indexOf((Math.round(Math.round(event.axisX[0].viewportMaximum) / 1000) * 1000)))


                // @ts-ignore
                chart.options.axisY.viewportMinimum = event.axisY[0].viewportMinimum;
                // @ts-ignore
                chart.options.axisY.viewportMaximum = event.axisY[0].viewportMaximum;

                // @ts-ignore
                chart.render();
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
                channelsName: data?.channelsName.filter(channel => channel !== name),
                channelsSource: tmpSources,
                signals: tmpChannels,
                signalsXY: tmpChannelsXY,
                time: data?.time,
                file: data?.file,
                sliderData: data?.sliderData
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
    const [k, setK] = React.useState<number>(30)
    const [histogram, setHistogram] = React.useState()

    function arrayMin(arr: any) {
        return arr.reduce(function (p: any, v: any) {
            return (p < v ? p : v);
        });
    }

    function arrayMax(arr: any) {
        return arr.reduce(function (p: any, v: any) {
            return (p > v ? p : v);
        });
    }

    function getStatistic(name: string) {
        if (data !== undefined) {
            const tmpData = data?.signals[name].slice(min, max)
            let sum = tmpData.reduce((a: number, b: number) => +a + +b, 0)
            // @ts-ignore
            const aver = sum / (max - min)
            setAverage(aver)

            let dispersionSum = 0
            for (let i = 0; i < tmpData.length; i++) {
                dispersionSum += Math.pow((tmpData[i] - aver), 2)
            }
            // @ts-ignore
            const disp = dispersionSum / (max - min)
            setDispersion(disp)

            setDeviation(Math.sqrt(+disp))

            setVariation(Math.sqrt(+disp) / aver)
            let asymmetrySum = 0
            for (let i = 0; i < tmpData.length; i++) {
                asymmetrySum += Math.pow((tmpData[i] - aver), 3)
            }
            // @ts-ignore
            asymmetrySum = asymmetrySum / (max - min)
            setAsymmetry(asymmetrySum / Math.pow(Math.sqrt(+disp), 3))

            let excessSum = 0
            for (let i = 0; i < tmpData.length; i++) {
                excessSum += Math.pow((tmpData[i] - aver), 4)
            }
            // @ts-ignore
            excessSum = excessSum / (max - min)
            setExcess((excessSum / Math.pow(Math.sqrt(+disp), 4)) - 3)

            const minV = arrayMin(tmpData)
            setMinValue(minV)
            const maxV = arrayMax(tmpData)
            setMaxValue(maxV)

            const sortedData = sort(tmpData)
            setQuantile05(sortedData[Math.round(0.05 * tmpData.length)])
            setQuantile95(sortedData[Math.round(0.95 * tmpData.length)])
            setMedian(sortedData[Math.round(0.5 * tmpData.length)])

            const h = Math.round((arrayMax(tmpData) - arrayMin(tmpData)) / k)
            const histograms = []
            for (let i = 0; i < k; i = i + 1) {
                let count = 0
                for (let j = 0; j < tmpData.length; j = j + 1) {
                    if (tmpData[j] >= (+minV + i * h) && tmpData[j] <= (+minV + (i + 1) * h)) {
                        count += 1
                    }
                }
                histograms.push({
                    'x': i,
                    'y': count
                })
            }
            // @ts-ignore
            setHistogram(histograms)
        }
        setOpenStatistic(true)
    }

    const [current, setCurrent] = useState('amplitudeSpectre')

    function newAnalyseFromOscillograms() {
        const tmp = oscillograms
        const tmpData: Array<object> = []
        const tmpDataPower: Array<object> = []
        if (analyseSignals.length === 0) {
            setOscillograms([])
            setCharts([])
            setAnalyseSignals(tmp)
            for (let i = 0; i < tmp.length; i = i + 1) {
                // @ts-ignore
                tmpData[tmp[i]] = []
                // @ts-ignore
                tmpDataPower[tmp[i]] = []
            }

            for (let i = 0; i < tmp.length; i = i + 1) {
                let zero = 0
                if (zeroSample === 'nothing') {
                    zero = data?.signalsXY[tmp[i]][min]['y']
                }
                if (zeroSample === 'zero') {
                    zero = 0
                }
                if (zeroSample === 'neighbor') {
                    zero = Math.abs(data?.signalsXY[tmp[i]][min + 1]['y'])
                }
                tmpDataPower[tmp[i]].push(...getFFTPower(zero, data?.signals[tmp[i]].slice(min, max), data?.sliderData, data?.samplesNumber, data?.samplingRate))
                tmpData[tmp[i]].push(...getFFT(zero, data?.signals[tmp[i]].slice(min, max), data?.sliderData, data?.samplesNumber, data?.samplingRate))
            }

            // @ts-ignore
            setAnalyseSignalSpectreData(tmpData)
            // @ts-ignore
            setAnalyseSignalPowerData(tmpDataPower)
            forceUpdate()

        }
    }

    // TODO change spectre
    function changeSpectre(name: string) {
        setCurrent(name)
        console.log(name)
        forceUpdate()
    }

    // TODO analyse from sidebar
    function analyseFromSidebar(name: string) {

    }

    // TODO analyse from name
    function newAnalyseFromName(name: string) {
        let tmp = analyseSignals

        if (tmp !== undefined && !tmp.includes(name)) {
            tmp.push(name)
            setAnalyseSignals(tmp)
            forceUpdate()
        }
    }

    // TODO change dynamic
    function nullSample(name: string) {
        setZeroSample(name)
    }

    function updateK(num: number) {
        setK(num)
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
                        haveOscillogram={oscillograms.length > 0}
                        newAnalyseFromOscillograms={newAnalyseFromOscillograms}
                        newAnalyseFromName={newAnalyseFromName}
                        k={k} updateK={updateK}
                />
                {analyseSignals.length > 0 ? (
                    <AnalyseTools height={height} min={min} max={max} changeSize={changeSize}
                                  setFragment={setFragment} dropFragment={dropFragment}
                                  nullSample={nullSample} changeSpectre={changeSpectre}
                                  turnInterpolation={turnInterpolation} turnSpline={turnSpline}/>) : <></>}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {analyseSignals.length > 0 ? (
                        analyseSignals.map((channel: string, number) => {
                            return (
                                <>
                                    <AnalyseGrams signal={analyseSignalsSpectreData[channel]} key={number}
                                                  source={data?.channelsSource[channel]}
                                                  sync={syncHandler} updateRef={updateCharts}
                                                  name={channel} height={height} min={datetimeMin} max={datetimeMax}
                                                  deleteOscillogram={deleteOscillogram}
                                                  spline={spline} markers={markers}
                                                   current={current}
                                                  power={analyseSignalsPowerData[channel]}

                                    />
                                </>)
                        })
                    ) : (<></>)}
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {oscillograms.length > 0 ? (
                        <OscillogramsTools height={height} min={min} max={max} changeSize={changeSize}
                                           setFragment={setFragment} dropFragment={dropFragment}
                                           turnInterpolation={turnInterpolation} turnSpline={turnSpline}/>) : <></>}
                    {oscillograms.length > 0 ? (
                        oscillograms.map((channel, number) => {
                            return (
                                <div key={number}>
                                    <Oscillogram signal={data?.signalsXY[channel]}
                                                 source={data?.channelsSource[channel]}
                                                 sync={syncHandler} updateRef={updateCharts}
                                                 name={channel} height={height} min={datetimeMin} max={datetimeMax}
                                                 deleteOscillogram={deleteOscillogram}
                                                 spline={spline} markers={markers}

                                    />
                                </div>)
                        })
                    ) : (<></>)}
                </div>

                <Sidebar samples={data?.samplesNumber} fd={data?.samplingRate} addOscillogram={newOscillogram}
                         channels={data?.channelsName} file={props.file} sources={data?.channelsSource}
                         signals={data?.signals} signalsXY={data?.signalsXY}
                         deleteSignal={deleteSignal} getStatistic={getStatistic}
                         analyse={analyseFromSidebar}/>
            </Container>

            <Dialog

                open={openStatistic}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Статистика сигнала</DialogTitle>
                <DialogContent>
                    <Typography>Интервал: {min} - {max}</Typography>
                    <Typography>Среднее = {average}</Typography>
                    <Typography>Дисперсия
                        = {dispersion}</Typography>
                    <Typography>Ср. кв. откл
                        = {deviation}</Typography>
                    <Typography>Коэф. вариации
                        = {variation}</Typography>
                    <Typography>Коэф. асимметрии
                        = {asymmetry}</Typography>
                    <Typography>Коэф. эксцесса
                        = {excess}</Typography>
                    <Typography>Мин. зн-ие сигнала
                        = {minValue}</Typography>
                    <Typography>Макс. зн-ие сигнала
                        = {maxValue}</Typography>
                    <Typography>Квантиль порядка 0.05 = {quantile05}</Typography>
                    <Typography>Квантиль порядка 0.95 = {quantile95}</Typography>
                    <Typography>Медиана = {median}</Typography>
                    <Histogram histogram={histogram}/>
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

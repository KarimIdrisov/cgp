const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const fs = require('fs')
port = 3081;

app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, "file" + '-' + file.originalname)
    }
})

const upload = multer({storage: storage}).single('file')

app.get('/channels', (req, res) => {
    const file = "file-" + req.query.id;

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);
        res.json({
            channelsNumber: channelsNumber,
            channelsName: channelsName,
            samples: +samplesNumber,
            f: +samplingRate
        });
    })
});

app.get('/get-osciologram', (req, res) => {
    const file = "file-" + req.query.file;
    const signal = req.query.signal;

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);

        const signalData = [];
        const channelIndex = channelsName.indexOf(signal)
        for (let i = 12; i < lines.length - 1; i++) {
            signalData.push(lines[i].split(' ')[channelIndex])

        }

        const resJson = []
        for (let i = 0; i < +samplesNumber; i++) {
            resJson.push({
                'y': +signalData[i],
                'x': +(i * samplingRate)
            })
        }

        res.json(resJson);
    })
});

app.get('/get-signal', (req, res) => {
    const file = "file-" + req.query.file;
    const signal = req.query.signal;

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        const startDate = lines[7]
        const startTime = lines[9];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);

        const signalData = [];
        const channelIndex = channelsName.indexOf(signal)
        for (let i = 12; i < lines.length - 1; i++) {
            signalData.push(+lines[i].split(' ')[channelIndex])

        }
        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const endTime = new Date(reverseStartDay + "T" + startTime)
        const start = new Date(reverseStartDay + "T" + startTime)
        let times = []
        for (let i = 0; i < +samplesNumber; i++) {
            times.push(new Date(start.getTime() + (i * (1 / samplingRate)) * 1000))
        }
        res.json({
            signalData: signalData,
            times: times,
        });
    })
});

app.get('/get-signal-sidebar', (req, res) => {
    const file = "file-" + req.query.file;
    const signal = req.query.signal;

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);

        const signalData = [];
        const channelIndex = channelsName.indexOf(signal)
        for (let i = 12; i < lines.length - 1; i++) {
            signalData.push(+lines[i].split(' ')[channelIndex])

        }
        let times = [0]
        for (let i = 1; i < +samplesNumber; i++) {
            times.push(+times[i - 1] + +samplingRate)
        }
        const startDate = lines[7]
        const startTime = lines[9];
        let dateTimes = []
        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const start = new Date(reverseStartDay + "T" + startTime)
        for (let i = 0; i < +samplesNumber; i++) {
            dateTimes.push((new Date(start.getTime() + (i * (1 / samplingRate)) * 1000)).getTime())
        }
        let interval = samplesNumber / 10
        res.json({
            signalData: signalData,
            times: times,
            dateTimes: dateTimes,
            interval: interval
        });
    })
});

app.get('/model-data', (req, res) => {
    const file = "file-" + req.query.id;

    if (req.query.id === 'undefined') {
        res.json()
    }

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        const startDate = lines[7]
        const startTime = lines[9];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);

        const signals = {}
        const signalsXY = {}
        for (let i = 0; i < channelsNumber; i++) {
            signals[channelsName[i]] = []
            signalsXY[channelsName[i]] = {}
        }
        for (let i = 12; i < lines.length - 1; i++) {
            for (let j = 0; j < channelsNumber; j++) {
                signals[channelsName[j]].push(lines[i].split(' ')[j])
            }
        }
        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const start = new Date(reverseStartDay + "T" + startTime)
        const endTime = new Date(start.getTime() + (1 / samplingRate) * samplesNumber * 1000)
        // endTime.setMilliseconds(endTime.getMilliseconds() + (samplesNumber / samplingRate))
        let times = [0]
        const resJson = []

        for (let i = 1; i < +samplesNumber; i++) {
            times.push(+times[i - 1] + +samplingRate)
        }
        res.json({
            channelsNumber: channelsNumber,
            samplesNumber: samplesNumber,
            samplingRate: samplingRate,
            start: start,
            end: endTime,
            channelsName: channelsName,
            signals: signals,
            time: 1 / samplingRate,
            file: req.query.file
        });
    })
});

app.post('/saveNewFile', (req, res) => {

    const file = req.query.id + '.txt'
    const fd = req.query.fd
    const samples = req.query.samples
    const names = req.query.names.split(';');
    const types = req.query.types.split(';');
    const args = req.query.args.split(';');
    const startDate = '01-01-2000'
    const startTime = '00:00:00'
    let newData = ''
    newData += '# Channels number\n'
    newData += names.length + '\n'
    newData += '# Samples number\n'
    newData += samples + '\n'
    newData += '# Sampling rate\n'
    newData += fd + '\n'
    newData += '# Start date\n'
    newData += startDate + '\n'
    newData += '# Start time\n'
    newData += startTime + '\n'
    newData += '# Channels names\n'
    newData += names.join(';') + '\n'

    const signals = {}
    for (let i = 0; i < names.length; i++) {
        signals[names[i]] = []
    }

    for (let i = 0; i < samples; i++) {
        for (let j = 0; j < names.length; j++) {
            if (types[j] === 'impulse') {
                signals[names[j]].push(i - 12 === args[j] ? 1 : 0)
            }
            if (types[j] === 'jump') {
                signals[names[j]].push(i - 12 >= args[j] ? 1 : 0)
            }
            if (types[j] === 'exponent') {
                signals[names[j]].push(Math.pow(args[j], i - 12))
            }
            if (types[j] === 'sin') {
                const newArgs = args[j].split(':')
                signals[names[j]].push(newArgs[0] * Math.sin((i - 12) * newArgs[1] + +newArgs[2]))
            }
            if (types[j] === 'meandr') {
                signals[names[j]].push((i - 12) % args[j] > args[j] / 2 ? -1 : 1)
            }
            if (types[j] === 'pila') {
                signals[names[j]].push(((i - 12) % args[j]) / 2)
            }
            if (types[j] === 'exp_ogub') {
                const newArgs = args[j].split(':')
                signals[names[j]].push(newArgs[0] * Math.exp(-(i - 12) / newArgs[1]) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
            }
            if (types[j] === 'balance_ogib') {
                const newArgs = args[j].split(':')
                signals[names[j]].push(newArgs[0] * Math.cos(2 * Math.PI * newArgs[1] * (i - 12)) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
            }
            if (types[j] === 'tonal_ogib') {
                const newArgs = args[j].split(':')
                signals[names[j]].push(newArgs[0] * (1 + newArgs[4] * Math.cos(2 * Math.PI * newArgs[1] * (i - 12))) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
            }
            if (types[j] === 'linear_module') {
                const newArgs = args[j].split(':')
                signals[names[j]].push(newArgs[0] * Math.cos(2 * Math.PI * ((+newArgs[1] + (newArgs[2] - newArgs[1]) / (samplesNumber * samplingRate)) * (i - 12)) + +newArgs[3]))
            }
        }
    }
    for (let i = 0; i < samples; i++) {
        let line = ''
        for (let j = 0; j < names.length; j++) {
            line += signals[names[j]][i] + ' '
        }
        newData += line + '\n'
    }
    const start = Date.now()
    fs.writeFile(`@/../saves/${file}`, newData, function (error) {
        if (error) throw error; // если возникла ошибка
        console.log(`Асинхронная запись файла завершена за ${Date.now() - start}`);

    });
})

app.post("/updateFile", (req, res) => {
    const file = "file-" + req.query.id;
    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const names = req.query.names.split(';');
        console.log(names)
        const types = req.query.types.split(';');
        const args = req.query.args.split(';');
        let lines = data.split(/\r?\n/);

        let channelsNumber = lines[1];
        const samplesNumber = lines[3];
        const samplingRate = lines[5];
        const startDate = lines[7]
        const startTime = lines[9];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);
        channelsNumber = +channelsNumber + +names.length
        names.forEach(channel => channelsName.push(channel));

        const signals = {}
        for (let i = 0; i < channelsNumber; i++) {
            signals[channelsName[i]] = []
        }

        for (let i = 12; i < lines.length - 1; i++) {
            for (let j = 0; j < channelsNumber - names.length; j++) {
                signals[channelsName[j]].push(lines[i].split(' ')[j])
            }
            for (let j = 0; j < names.length; j++) {
                if (types[j] === 'impulse') {
                    signals[names[j]].push(i - 12 === args[j] ? 1 : 0)
                }
                if (types[j] === 'jump') {
                    signals[names[j]].push(i - 12 >= args[j] ? 1 : 0)
                }
                if (types[j] === 'exponent') {
                    signals[names[j]].push(Math.pow(args[j], i - 12))
                }
                if (types[j] === 'sin') {
                    const newArgs = args[j].split(':')
                    signals[names[j]].push(newArgs[0] * Math.sin((i - 12) * newArgs[1] + +newArgs[2]))
                }
                if (types[j] === 'meandr') {
                    signals[names[j]].push((i - 12) % args[j] > args[j] / 2 ? -1 : 1)
                }
                if (types[j] === 'pila') {
                    signals[names[j]].push(((i - 12) % args[j]) / 2)
                }
                if (types[j] === 'exp_ogub') {
                    const newArgs = args[j].split(':')
                    signals[names[j]].push(newArgs[0] * Math.exp(-(i - 12) / newArgs[1]) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
                }
                if (types[j] === 'balance_ogib') {
                    const newArgs = args[j].split(':')
                    signals[names[j]].push(newArgs[0] * Math.cos(2 * Math.PI * newArgs[1] * (i - 12)) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
                }
                if (types[j] === 'tonal_ogib') {
                    const newArgs = args[j].split(':')
                    signals[names[j]].push(newArgs[0] * (1 + newArgs[4] * Math.cos(2 * Math.PI * newArgs[1] * (i - 12))) * Math.cos(2 * Math.PI * newArgs[2] * (i - 12) + +newArgs[3]))
                }
                if (types[j] === 'linear_module') {
                    const newArgs = args[j].split(':')
                    signals[names[j]].push(newArgs[0] * Math.cos(2 * Math.PI * ((+newArgs[1] + (newArgs[2] - newArgs[1]) / (samplesNumber * samplingRate)) * (i - 12)) + +newArgs[3]))
                }
            }
        }
        let newData = ''
        newData += '# Channels number\n'
        newData += channelsNumber + '\n'
        newData += '# Samples number\n'
        newData += samplesNumber + '\n'
        newData += '# Sampling rate\n'
        newData += samplingRate + '\n'
        newData += '# Start date\n'
        newData += startDate + '\n'
        newData += '# Start time\n'
        newData += startTime + '\n'
        newData += '# Channels names\n'
        newData += channelsName + '\n'
        for (let i = 0; i < samplesNumber; i++) {
            let line = ''
            for (let j = 0; j < channelsNumber; j++) {
                line += signals[channelsName[j]][i] + ' '
            }
            newData += line + '\n'
        }

        const start = Date.now()
        fs.writeFile(`@/../uploads/${file}`, newData, function (error) {
            if (error) throw error; // если возникла ошибка
            console.log(`Асинхронная запись файла завершена за ${Date.now() - start}`);

        });
    })
})

app.post('/upload', function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const fs = require('fs')
port = 3081;

app.use(cors())
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, "file" + '-' + file.originalname)
    }
})

const upload = multer({storage: storage}).single('file')

app.get('/get-file', (req, res) => {
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

        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const start = new Date(reverseStartDay + "T" + startTime)
        const endTime = new Date(start.getTime() + (1 / samplingRate) * samplesNumber * 1000)
        let times = [0]

        const signals = {}
        const signalsXY = {}
        const channelsSource = {}
        for (let i = 0; i < channelsNumber; i++) {
            signals[channelsName[i]] = []
            signalsXY[channelsName[i]] = []
            channelsSource[channelsName[i]] = req.query.file
        }
        const XYstart = new Date(reverseStartDay + "T" + startTime)
        for (let i = 12; i < lines.length - 1; i++) {
            for (let j = 0; j < channelsNumber; j++) {
                signals[channelsName[j]].push(lines[i].split(' ')[j])
                signalsXY[channelsName[j]].push({
                    'x': new Date(XYstart.getTime() + (i * (1 / samplingRate)) * 1000).getTime(),
                    'y': +lines[i].split(' ')[j]
                })
            }
        }


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
            channelsSource: channelsSource,
            signals: signals,
            signalsXY: signalsXY,
            time: 1 / samplingRate,
            file: req.query.id
        });
    })
});

app.post("/updateFile", (req, res) => {

    const data = req.body
    let newData = ''
    newData += '# Channels number\n'
    newData += data.channelsNumber + '\n'
    newData += '# Samples number\n'
    newData += data.samplesNumber + '\n'
    newData += '# Sampling rate\n'
    newData += data.samplingRate + '\n'
    newData += '# Start date\n'
    const reverseDate = data.start.split('T')[0].split('-')
    newData += `${reverseDate[2]}-${reverseDate[1]}-${reverseDate[0]}` + '\n'
    newData += '# Start time\n'
    newData += data.start.split('T')[1] + '\n'
    newData += '# Channels names\n'
    newData += data.channelsName + '\n'

    for (let i = 0; i < data.samplesNumber; i++) {
        let line = ''
        for (let j = 0; j < data.channelsName.split(';').length; j++) {
            line += data.signals[j][i] + ' '
        }
        newData += line + '\n'
    }
    fs.writeFile(`@/../uploads/${data.file}.txt`, newData, function (error) {
        if (error) throw error; // если возникла ошибка
        console.log(`Асинхронная запись файла завершена.`);

    });
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

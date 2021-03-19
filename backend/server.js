const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
port = 3080;

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

app.get('/', (req, res) => {
    res.send('App Works !!!!');
});

app.get('/channels', (req, res) => {
    const file = "file-" + req.query.id;

    fs.readFile(`@/../uploads/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const lines = data.split(/\r?\n/);

        const channelsNumber = lines[1];
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);
        res.json({
            channelsNumber: channelsNumber,
            channelsName: channelsName,
        });
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
        let channelsName = lines[11].split(';');
        channelsName = channelsName.slice(0, +channelsNumber);

        const signalData = [];
        const channelIndex = channelsName.indexOf(signal)
        for (let i = 12; i < lines.length - 1; i++) {
                signalData.push(lines[i].split(' ')[channelIndex])

        }
        let times = [0]
        for (let i = 1; i < +samplesNumber; i++) {
            times.push(+times[i - 1] + +samplingRate)
        }
        const jsonData = [];
        for (let i = 0; i < +samplesNumber; i++) {
            jsonData.push({"f(x)": signalData[i], "time": times[i]})
        }
        res.json({
            "data": jsonData
        });
    })
});

app.get('/model-data', (req, res) => {
    const file = "file-" + req.query.id;

    const start = Date.now();

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
        for (let i = 0; i < channelsNumber; i++) {
            signals[channelsName[i]] = []
        }
        for (let i = 12; i < lines.length - 1; i++) {
            for (let j = 0; j < channelsNumber; j++) {
                signals[channelsName[j]].push(lines[i].split(' ')[j])
            }
        }
        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const endTime = new Date(reverseStartDay + "T" + startTime)
        const start = new Date(reverseStartDay + "T" + startTime)
        endTime.setMilliseconds(endTime.getMilliseconds() + ((samplingRate / 4) * samplesNumber * 1000))
        let times = [0]
        for (let i = 1; i < +samplesNumber; i++) {
            times.push(+times[i - 1] + +samplingRate)
        }
        res.json({
            channelsNumber: channelsNumber,
            samplesNumber: samplesNumber,
            samplingRate: samplingRate,
            time: samplingRate / 4,
            start: start,
            end: endTime,
            channelsName: channelsName,
        });
    })

    console.log("New time - ", file)
    console.log("Time: ", Date.now() - start);
});

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

const fs = require('fs')
fs.stat('@/../uploads/file-earthquake.txt', (err, stats) => {
    if (err) {
        console.error(err)
        return
    }
    //сведения о файле содержатся в аргументе `stats`
})

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

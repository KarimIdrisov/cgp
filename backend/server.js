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

app.get('/model-data', (req, res) => {
    fs.readFile('@/../uploads/file-earthquake.txt', 'utf8', (err, data) => {
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
        const channelsName = lines[11].split(';');
        const signals = {}
        for (let i = 0; i < channelsNumber; i++) {
            signals[channelsName[i]] = []
        }
        for (let i = 12; i < lines.length; i++) {
            for (let i = 0; i < channelsNumber; i++) {
                signals[channelsName[i]].push(lines[12].split(' ')[i])
            }
        }
        let reverseStartDay = startDate.split("-")
        reverseStartDay = reverseStartDay[2] + '-' + reverseStartDay[1] + '-' + reverseStartDay[0]
        const endTime = new Date(reverseStartDay + "T" + startTime)
        endTime.setMilliseconds(endTime.getMilliseconds() + ((samplingRate / 4) * samplesNumber * 1000))
        let times = [0]
        for (let i = 1; i < +samplesNumber; i++) {
            times.push(+times[i - 1] + +samplingRate)
        }
        res.json({
            channelsNumber: channelsNumber,
            samplesNumber: samplesNumber,
            samplingRate: samplingRate,
            start: reverseStartDay + "T" + startTime,
            end: endTime,
            channelsName: channelsName,
            signals: signals,
            times: times,
        });
    })
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

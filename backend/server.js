const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
port = 3080;

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage }).single('file')

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)

    })
})



app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

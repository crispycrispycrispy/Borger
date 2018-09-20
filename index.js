const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk('localhost/borger');
const borgi = db.get('borgi');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json([{
        message: 'borgborg'
    }])
})

function isValidBorg(borg){
    return borg.name && borg.name.toString().trim() !== '' &&
        borg.content && borg.content.toString().trim() !== '';
}

app.get('/borgi', (req, res) => {
    borgi
        .find()
        .then(borgis => {
            res.json(borgis);
        });
});

app.post('/borgi', (req, res) => {
    if(isValidBorg(req.body)){
        const borg = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        }
        borgi
            .insert(borg)
            .then(createdBorg => {
                res.json(createdBorg);
            });
        //console.log(borg);
    } else {
        res.status(422);
        res.json({
            message: '--name and --content are required'
        });
    }
})

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

filter = new Filter();

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/borger');
const borgi = db.get('borger');

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

app.use(rateLimit({
    windowMs: 10 * 1000, // 30 seconds
    max: 1
}));

app.post('/borgi', (req, res) => {
    if(isValidBorg(req.body)){
        const borg = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
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
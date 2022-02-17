const fileUpload = require('express-fileupload')
const express = require('express')
const fs = require('fs')
const { getAudioDurationInSeconds } = require('get-audio-duration');

const PORT = 5000;
const serverAddress = 'http://5.181.109.24:5000';

const app = express();
app.use(fileUpload({ }));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let musicTurn = [];
let currentTime = 0;
let timer;

/*
app.get('/', (req,res) => {
    //res.redirect('http://5.181.109.24')
    //res.status(200).json({url: 'http://diana.one'});
    res.send( 'http://diana.one');
})

app.post('/', (req, res) => {
    //res.status(200).json({message: 'something'});
    //res.redirect('http://5.181.109.24')
    //res.status(200).json({url: 'http://diana.one'});
    res.send( 'http://diana.one');

})
 */

app.get('/music/*', (req,res) => {
    let _url = req.url;
    _url.replace('\\', '/');
    res.sendfile(`.${req.url}`);

})

app.post('/music-get', (req, res) => {
    try {
        if (musicTurn[0]) {
            console.log(musicTurn[0]);
            return res.status(200).send({
                file: musicTurn[0],
                currentTime: currentTime
            });
        } else {
            return res.status(201).send('Музыки нет');
        }
    } catch (e){
        console.log(e);
        return res.status(400).send(e);
    }
})

app.post('/music-download', uploadFile)

app.listen(PORT, () => console.log(`Сервер работает на ${PORT}`));

async function uploadFile(req, res) {
    try {
        const file = req.files.file;
        const type = file.name.split('.').pop();

        if(type == 'mp3') {
            let path = `./music/${file.name}`;
            if(fs.existsSync(path)) {
                return res.status(201).send('Файл уже существует')
            }
            await file.mv(path);
            console.log(`Файл ${file.name} загружен`);

            let duration;
            await getAudioDurationInSeconds(path).then((_duration) => {
                duration = _duration;
            });

            let music = {
                url: `${serverAddress}/music/${file.name}`,
                name: file.name,
                duration: duration
            };

            //если нет музыки в плейлисте
            if(!musicTurn[0]) {
                currentTime = 0;
                timer = setInterval(() => {
                    currentTime++;
                    if(musicTurn[0]) {
                        if (musicTurn[0].duration <= currentTime) {
                            switchAudio();
                        }
                    }
                }, 1000);
            }

            musicTurn.push(music);

            console.log(`Длительность ${duration}`);
            console.log(`Файл ${file.name} добавлен в очередь`);
            return res.status(200).send({
                message: 'In musicTurn',
                filename: file.name
            });

        } else {
            return res.status(200).send('Это не mp3');
        }

    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
}

function switchAudio(){
    if(musicTurn[0]) {
        musicTurn.shift();
        currentTime = 0;
    }
}


const fileUpload = require('express-fileupload')
const express = require('express')
const fs = require('fs')
const cors = require('cors');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const PORT = 5000;
const serverAddress = 'http://localhost:5000';

const app = express();
app.use(fileUpload({ }));
app.use(express.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//app.use(cors({origin: 'http://localhost:3000'}));

let musicTurn = [];
let currentTime = 0;
let timer;


app.get('/music/*', (req,res) => {
    console.log(req.url);
    let _url = req.url;
    _url.replace('\\', '/');
    res.sendfile(`.${req.url}`);
})

app.post('/', (req, res) => {
    console.log(req.body);
    if(req.body.query == 'getmusic'){
        if(musicTurn[0]){
            console.log(musicTurn[0]);
            return res.status(200).json({
                file: musicTurn[0],
                currentTime: currentTime
            });
        } else {
            return res.status(200).json('Музыки нет');
        }
    }
    res.status(200).json('POST');
})

app.post('/music', uploadFile)

app.listen(PORT, () => console.log(`Сервер работает на ${PORT}`));

async function uploadFile(req, res) {
    console.log(req.body);
    try {
        const file = req.files.file;
        const type = file.name.split('.').pop();

        if(type == 'mp3') {
            let path = `./music/${file.name}`;
            if(fs.existsSync(path)) {
                return res.status(200).json({message: 'Файл уже существует'})
            }
            await file.mv(path);
            console.log(`Файл ${file.name} загружен`);

            let duration;
            await getAudioDurationInSeconds(path).then((_duration) => {
                duration = _duration;
            });

            let music = {
                path: path,
                url: `${serverAddress}/music/${file.name}`,
                name: file.name,
                duration: duration
            };

            //если нет музыки в плейлисте
            if(!musicTurn[0]) {
                setTimeout(switchAudio, 1000 * duration);

                timer = setInterval(() => {
                    currentTime++
                }, 1000);
            }

            musicTurn.push(music);

            console.log(`Длительность ${duration}`);
            console.log(`Файл ${file.name} добавлен в очередь`);
            return res.status(200).json({
                message: 'In musicTurn',
                filename: file.name
            });

        } else {
            return res.status(200).json({message: 'Это не mp3'});
        }

    } catch (e) {
        console.log(e);
        return res.status(200).json({message: 'Ошибка загрузки'});
    }
}

function switchAudio(){
    if(musicTurn[1]) {
        musicTurn.shift();
        currentTime = 0;
    }
}


const fileUpload = require('express-fileupload')
const express = require('express')
const fs = require('fs')
const { getAudioDurationInSeconds } = require('get-audio-duration');
const events = require('events');

const IP = require('./config.js').IP;
const PORT = require('./config.js').PORT;
let PROXYIP = require('./config.js').PROXYIP;
let PROXYPORT = require('./config.js').PROXYPORT;

let serverAddress = `https://` + PROXYIP + ":" + PROXYPORT;
if(!PROXYIP) {
    PROXYIP = IP;
    PROXYPORT = PORT;
    serverAddress = `http://` + IP + ":" + PORT;
}
const emitter = new events.EventEmitter();
console.log("Внешний адрес: " + serverAddress);
let musicID = require('./musicID.js') //Текущий айди загружаемой музыки.
const app = express();
app.use(fileUpload({})); //Для загрузки файлов на сервер.
app.use(express.json());
//Заголовки для запросов.
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let musicTurn = []; //Текущий плейлист.
let currentTime = 0; //Текущее время
let timer;

app.listen(PORT, () => console.log(`Сервер работает на ${PORT}`));

//Получение файлов из папки music.
app.get('/music/*', (req,res) => {
    let _url = req.url;
    _url.replace('\\', '/');
    res.sendfile('.' + req.url);
})
//Запрос на получение плейлиста и всей музыки на сервере.
app.get('/music-all-get', sendAllMusic)
//Запрос на изменение текущего плейлиста.
app.post('/music-send-turn', changePlaylist)
//Запрос на получение текущего трека.
app.post('/music-get', sendCurrentTrack)
//Запрос на загрузку трека.
app.post('/music-download', uploadFile)

//Функции.

async function sendAllMusic(req, res){
    //Получение текущего плейлиста.
    let musicAll = [];
    let musicTurnWithoutZero = [...musicTurn];
    musicTurnWithoutZero.shift();
    musicAll.push(musicTurnWithoutZero);

    //Обработка файла с музыкой на сервере.
    let musicOnServer = [];
    let fileContent = fs.readFileSync("music.json", "utf8");
    fileContent = fileContent.split("|FORSPLIT|");
    fileContent.pop();
    fileContent.forEach(music => {
        musicOnServer.push(JSON.parse(music));
    });
    musicAll.push(musicOnServer);

    return res.status(200).send(musicAll);
}

async function changePlaylist(req, res){
    const newMusicTurn = req.body;
    if(newMusicTurn[0]){
        if(musicTurn[0])
        {
            const currentMusic = musicTurn[0];
            newMusicTurn.unshift(currentMusic);
            musicTurn = newMusicTurn;
        } else {
            musicTurn = newMusicTurn;
            currentTime = 0;
            clearInterval(timer);
            timer = setInterval(() => {
                currentTime++;
                if(musicTurn[0]) {
                    if (musicTurn[0].duration <= currentTime) {
                        switchAudio();
                    }
                }
            }, 1000);
            emitter.emit('SendMusic');
        }
        return res.status(200).send({
            message: 'In musicTurn',
        });
    } else {
        return res.status(200).send({
            message: '0 files',
        });
    }
}

async function sendCurrentTrack(req, res){
    if (musicTurn[0]) {
        return res.status(200).send({
            file: musicTurn[0],
            currentTime: currentTime
        });
    } else {
        emitter.once('SendCurrentMusic', () => {
            return res.status(200).send({
                file: musicTurn[0],
                currentTime: currentTime
            });
        });
    }
}

async function uploadFile(req, res) {
    try {
        const file = req.files.file;
        const type = file.name.split('.').pop();

        if(type === 'mp3') {
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


            let title = file.name.split('.');
            title.pop();
            title = title.join('.');
            let music = {
                id: musicID,
                url: `${serverAddress}/music/${file.name}`,
                name: file.name,
                duration: duration,
                title: title
            };
            musicID++;
            fs.writeFile('./musicID.js', `let musicID = ${musicID}; module.exports = musicID;`, error => console.log("Done!"));

            fs.appendFile("music.json", JSON.stringify(music) + "|FORSPLIT|", function(error){
                if(error)
                    console.log("Запись файла прервана:\n" + error);
            });

            //если нет музыки в плейлисте
            if(!musicTurn[0]) {
                currentTime = 0;
                clearInterval(timer);
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
            emitter.emit('SendCurrentMusic');

            console.log(`Длительность ${duration}`);
            console.log(`Файл ${file.name} добавлен в очередь`);

            return res.status(200).send({
                message: 'In musicTurn',
                filename: file.name,
            });

        } else {
            return res.status(201).send('Это не mp3');
        }

    } catch (e) {
        console.log(e);
        return res.status(201).send(e);
    }
}

function switchAudio(){
    if(musicTurn[0]) {
        musicTurn.shift();
        currentTime = 0;
    }
}
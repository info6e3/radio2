const fileUpload = require('express-fileupload')
const express = require('express')
const fs = require('fs')
const cors = require('cors');

const PORT = 5000;

const app = express();
app.use(fileUpload({ }));
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));


app.get('/', (req,res) => {
    console.log(req);
    res.status(200).json('GET');
})

app.post('', (req, res) => {
    console.log(req.body);
    res.status(200).json('POST');
})

app.post('/music', uploadFile)

app.listen(PORT, () => console.log(`Сервер работает на ${PORT}`));

function uploadFile(req, res) {
    console.log(req.body);
    try {
        const file = req.files.file;
        const type = file.name.split('.').pop();

        if(type == 'mp3') {
            let path = `./music/${file.name}`;
            if(fs.existsSync(path)) {
                return res.status(200).json({message: 'Файл уже существует'})
            }
            file.mv(path);
            console.log(`Файл ${file.name} загружен`);
            return res.status(200).json({message: 'Файл загружен'});
        } else {
            return res.status(200).json({message: 'Это не mp3'});
        }

    } catch (e) {
        console.log(e);
        return res.status(200).json({message: 'Ошибка загрузки'});
    }

}
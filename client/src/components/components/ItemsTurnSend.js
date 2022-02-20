import React, {useState} from 'react';
import './styles/ItemsTurnSend.css';
const ServerAddress = require('./config.js').ServerAddress;

function ItemsTurnSend({files}) {
    const downloadMusicURL = `${ServerAddress}/music-download`;

    let filesHTML = "";
    if(files)
        renderFiles(files);

    function renderFiles(_files)
    {
        _files.forEach(file => {
            let fileItem = `<div 
                        class="ItemsTurnSend-FileItem">
                        <div class="ItemsTurnSend-FileStatusBar" id="${file.name}"></div>
                        <div class="ItemsTurnSend-FileName">${file.name}</div>
                     </div>`;
            filesHTML += fileItem;
        });
    }

    function SendPost(_data) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", downloadMusicURL);
        xhr.onload = () => {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
                if(response.message === 'In musicTurn') {
                    let fileItem = document.getElementById(`${response.filename}`);
                    fileItem.style.background = "green";
                }
            } else {
                let response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.send(_data);
    }

    function sendFiles(){
        files.forEach(file => {
            //отправка файла
            let formData = new FormData();
            formData.append('file', file);
            SendPost(formData);
        });
    }

    return (
        <div className="ItemsTurnSend">
            <div className="ItemsTurnSend-FilesTitle">Файлы</div>
            <div className="ItemsTurnSend-FilesBox" dangerouslySetInnerHTML={{__html: filesHTML}}></div>
            <div className="ItemsTurnSend-Button" onClick={sendFiles}>Отправить</div>
        </div>
    );
}

export default ItemsTurnSend;


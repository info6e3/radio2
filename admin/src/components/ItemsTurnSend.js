import React, {useState} from 'react';
import './styles/ItemsTurnSend.css';


function ItemsTurnSend({className, files, serverURL}) {
    let filesHTML = "";
    if(files)
        renderFiles(files);

    function renderFiles(_files)
    {
        _files.forEach(file => {
            let fileItem = `<div 
                        class="FileItem"
                        draggable="true">
                        <div class="FileStatusBar" id="${file.name}"></div>
                        <div class="FileName">${file.name}</div>
                     </div>`;
            filesHTML += fileItem;
        });
    }

    function SendPost(_url, _data) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", _url);
        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                //console.log(response);
                if(response.message === 'In musicTurn') {
                    let fileItem = document.getElementById(`${response.filename}`);
                    fileItem.style.background = "green";
                }
            } else {
                console.log("Server response: ", xhr.statusText);
            }
        };
        xhr.send(_data);
    }

    function sendFiles(){
        files.forEach(file => {
            //отправка файла
            let formData = new FormData();
            formData.append('file', file);
            SendPost(serverURL, formData);
        });
    }

    return (
        <div className={className}>
            <div className="FilesTitle">Файлы</div>
            <div className="FilesBox" dangerouslySetInnerHTML={{__html: filesHTML}}></div>
            <div className="SendButton" onClick={sendFiles}>Отправить</div>
        </div>
    );
}

export default ItemsTurnSend;


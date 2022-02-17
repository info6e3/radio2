import React, {useState} from 'react';
import './styles/FilesBox.css';


function Items({className, files}) {
    let filesHTML = "";
    addFiles(files);

    function addFiles(_files)
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

    return (
       
        <div className="Items">
            <div className="FilesTitle">Файлы</div>
            <div className={className} dangerouslySetInnerHTML={{__html: filesHTML}}></div>
        <div className="SendButton" onClick={SendFiles}>Отправить</div>
        </div>
    );
}

export default Items;


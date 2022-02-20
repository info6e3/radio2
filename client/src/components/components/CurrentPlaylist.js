import React, {useState, useEffect } from 'react';
import './styles/CurrentPlaylist.css';
const ServerAddress = require('./config.js').ServerAddress;


function CurrentPlaylist() {
    const xhr = new XMLHttpRequest();
    const getMusicAllURL = `${ServerAddress}/music-all-get`;
    const sendMusicTurnURL = `${ServerAddress}/music-send-turn`;

    const [lists, setLists] = useState([
        {id:1, title: "Плейлист", items: []},
        {id:2, title: "Музыка", items: []}
    ]);

    function SendMusicAll(_url) {
        xhr.open("POST", _url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
                if(response.message === 'In musicTurn') {
                    console.log("Добавлено в очередь");
                }
            } else {
                let response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.send(JSON.stringify(lists[0].items));
    }

    async function GetMusicAll(_url) {
        xhr.open("GET", _url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                lists[0].items = response[0];
                console.log(response);
                lists[1].items = response[1];

                setLists(lists.map(list => {
                    return list;
                }));
            } else {
                let response = xhr.responseText;
                console.log(response);
            }
        };
        await xhr.send();
    }

    async function GetMusic() {
        await GetMusicAll(getMusicAllURL);
    }


    function dragStartHandler(e, music) {
    }

    function dragEndHandler(e) {

    }

    function dragOverHandler(e) {

    }

    function dropDropHandler(e, music) {

    }

    function onClickHandler(e, list, music) {
        if(lists[0].items.indexOf(music) >= 0) {
            const currentIndex = lists[0].items.indexOf(music);
            lists[0].items.splice(currentIndex, 1);
        } else {
            const currentIndex = lists[0].items.indexOf(music);
            lists[0].items.push(music);
        }
        setLists(lists.map(l => {
            return l;
        }));
    }

    function SendTurn(){
        SendMusicAll(sendMusicTurnURL);
    }

    return (
        <div className="CurrentPlaylist">
            <div className="CurrentPlaylist-Button" onClick={GetMusic}>Получить плейлист</div>
            <div className="CurrentPlaylist-Lists">
                {lists.map(list =>
                    <div className="CurrentPlaylist-List" key={list.id}>
                        <div className="CurrentPlaylist-ListTitle"  key={list.id + "-Title"}>{list.title}</div>
                        <div className="CurrentPlaylist-ListBox" key={list.id + "-Box"}>
                            {list.items.map(music =>
                                <div key={music.id}
                                     onDragStart={(e) => dragStartHandler(e, music)}
                                     onDragLeave={(e) => dragEndHandler(e)}
                                     onDragEnd={(e) => dragEndHandler(e)}
                                     onDragOver={(e) => dragOverHandler(e)}
                                     onDrop={(e) => dropDropHandler(e, music)}
                                     onClick={(e) => onClickHandler(e, list, music)}
                                     className="CurrentPlaylist-MusicItem"
                                     draggable="true">
                                    <div className="CurrentPlaylist-MusicName">{music.title}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </div>
            <div className="CurrentPlaylist-Button" onClick={SendTurn}>Отправить плейлист</div>
    </div>
    );
}

export default CurrentPlaylist;


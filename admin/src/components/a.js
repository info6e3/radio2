import React, {useState, useEffect } from 'react';
import './styles/CurrentPlaylist.css';


function CurrentPlaylist() {
    const getMusicTurnURL = "http://5.181.109.24:5000/music-turn-get"
    const getAllMusicURL = "http://5.181.109.24:5000/music-all-get"

    //let [filesHTML, setFilesHTML] = useState("");
    let filesHTML = "";
    const [musicTurn, setMusicTurn] = useState([]);
    const [musicAll, setMusicAll] =  useState([]);

    function GetMusicTurn(_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", _url);

        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                let i = 0;
                response.forEach(music => {
                    console.log("ord");
                    music["order"] = i;
                    i++;
                });
                console.log(response);
                setMusicTurn(response);
            } else {
                let response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.send();
    }

    function GetAllMusic(_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", _url);

        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
                setMusicAll(response);
            } else {
                let response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.send();
    }

    function GetMusic() {
        GetMusicTurn(getMusicTurnURL);
        GetAllMusic(getAllMusicURL);
    }


    function dragStartHandler(e, music) {
    }

    function dragEndHandler(e) {

    }

    function dragOverHandler(e) {

    }

    function dropDropHandler(e, music) {

    }

    function onClickHandler(e, music) {
        musicAll.splice(0,1);
        setMusicAll(() => {return musicAll});
    }

    return (
        <div className="CurrentPlaylist">
            <div className="SendButton" onClick={GetMusic}>Получить списки</div>
            <div className="Lists">
            <div className="Playlist">
                <div className="PlaylistTitle">Playlist</div>
                <div className="PlaylistBox">
                    {musicTurn.map(music =>
                        <div key={music.id}
                             onDragStart={(e) => dragStartHandler(e, music)}
                             onDragLeave={(e) => dragEndHandler(e)}
                             onDragEnd={(e) => dragEndHandler(e)}
                             onDragOver={(e) => dragOverHandler(e)}
                             onDrop={(e) => dropDropHandler(e, music)}
                             onClick={(e) => onClickHandler(music)}
                             className="MusicItem"
                             draggable="true">
                             {music.title}
                        </div>
                    )}
                </div>
            </div>
            <div className="AllMusic">
                <div className="AllMusicTitle">AllMusic</div>
                <div className="AllMusicBox">
                    {musicAll.map(music =>
                        <div key={music.id}
                             onDragStart={(e) => dragStartHandler(e, music)}
                             onDragLeave={(e) => dragEndHandler(e)}
                             onDragEnd={(e) => dragEndHandler(e)}
                             onDragOver={(e) => dragOverHandler(e)}
                             onDrop={(e) => dropDropHandler(e, music)}
                             onClick={(e) => onClickHandler(music)}
                             className="MusicItem"
                             draggable="true">
                            {music.title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}

export default CurrentPlaylist;

{Playlist.items.map(music =>
    <div key={music.id}
         onDragStart={(e) => dragStartHandler(e, music)}
         onDragLeave={(e) => dragEndHandler(e)}
         onDragEnd={(e) => dragEndHandler(e)}
         onDragOver={(e) => dragOverHandler(e)}
         onDrop={(e) => dropDropHandler(e, music)}
         onClick={(e) => onClickHandler(music)}
         className="MusicItem"
         draggable="true">
        {music.title}
    </div>
)}

{Playlist.items.map(music =>
    <div key={music.id}
         onDragStart={(e) => dragStartHandler(e, music)}
         onDragLeave={(e) => dragEndHandler(e)}
         onDragEnd={(e) => dragEndHandler(e)}
         onDragOver={(e) => dragOverHandler(e)}
         onDrop={(e) => dropDropHandler(e, music)}
         onClick={(e) => onClickHandler(music)}
         className="MusicItem"
         draggable="true">
        {music.title}
    </div>
)}
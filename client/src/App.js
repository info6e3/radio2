import React from 'react';
import './styles/App.css';
import axios from "axios";

function App() {
    let isMuted = false;
    let title;
    let audio = new Audio();
    audio.volume = 0.1;
    let serverURL = "http://5.181.109.24:5000/music-get";

    function PlayButton(){
        GetAudio(serverURL);
    }

    function PlayAudio(_url, _name, _currentTime){
        title = _name;
        document.querySelector('.Title').innerHTML = title;
        audio.src = _url;
        audio.addEventListener('timeupdate', updateProgress);
        audio.currentTime = _currentTime;
        audio.load();
        audio.play();
    }

     function GetAudio(_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", _url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                let file = response.file;
                let currentTime = response.currentTime;
                console.log(file);
                console.log(currentTime);
                PlayAudio(file.url, file.name, currentTime);

            } else {
                document.querySelector('.Title').innerHTML = "-----";
                console.log("Server response: ", xhr.responseText);
            }
        };
        xhr.send();
    }

    function updateProgress(e){
        let {duration, currentTime} = e.srcElement;
        let progressPercent = currentTime/duration * 100;
            document.querySelector('.ProgressBar').style.width = `${progressPercent}%`;
        if(duration === currentTime){
            audio.removeEventListener('timeupdate', updateProgress);
            GetAudio(serverURL);
        }
    }

    function MuteButton(){
        if(isMuted){
            document.querySelector('.ButtonMute').style.background = "limegreen";
            audio.volume = 0.1;
            isMuted = false;
        }else {
            document.querySelector('.ButtonMute').style.background = "crimson";
            audio.volume = 0;
            isMuted = true;
        }
    }

    return (
        <div className="App">
            <div className="Title">
                -----
            </div>
            <div className="ProgressBarContainer">
                <div className="ProgressBar">

                </div>
            </div>
            <div className="Buttons">

                <div className="ButtonMute" onClick={() => {MuteButton()}}>
                </div>
                <div className="ButtonCenter" onClick={() => {PlayButton()}}>

                </div>


            </div>
        </div>
    );
}

export default App;
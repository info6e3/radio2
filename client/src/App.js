import React from 'react';
import './styles/App.css';
import axios from "axios";

function App() {
    let listened = false;
    let title;
    let audio;

    function PlayButton(){
        GetAudio("http://localhost:5000/");
    }

    function PlayAudio(_url, _name, _currentTime){
        audio = new Audio(_url);
        audio.currentTime = _currentTime;
        audio.volume = 0.1;
        audio.addEventListener('timeupdate', updateProgress);
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
                console.log("Server response: ", xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            query: 'getmusic'
        }));
    }

    function updateProgress(e){
        let {duration, currentTime} = e.srcElement;
        let progressPercent = currentTime/duration * 100;
        if(duration === currentTime)
        document.querySelector('.ProgressBar').style.width = `${progressPercent}%`;
    }

    return (
        <div className="App">
            <div className="Title">
                {title}
            </div>
            <div className="ProgressBarContainer">
                <div className="ProgressBar">

                </div>
            </div>
            <div className="Buttons">


                <div className="ButtonCenter" onClick={() => {PlayButton()}}>
                </div>


            </div>
        </div>
    );
}

export default App;
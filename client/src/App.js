import React from 'react';
import './styles/App.css';
const Connection = require("./Connection.js");

function App() {
    const connection = new Connection();
    connection.Start(`ws://localhost:5000`);

    const songs = ["http://5.181.109.24/1.mp3",
        "http://5.181.109.24/2.mp3",
        "http://5.181.109.24/3.mp3",
        "http://5.181.109.24/4.mp3",
        "http://5.181.109.24/5.mp3",
        "http://5.181.109.24/6.mp3",
        "http://5.181.109.24/7.mp3",
        "http://5.181.109.24/8.mp3",
    ];

    let listened = false;
    let songIndex = 0;
    let song = songs[songIndex];

    let audio;
    createAudio(song);
    let titles = [`Платина - Дора - Сан Ларан`,
        `rizza - Sqwore - плачь`,
        `Sqwore - Звезда упала`,
        `Shadowraze - SHADOWRAZE — JUGGERNAUT -OFFICIAL-`,
        `zhanulka - ты похож на кота`,
        `Sqwore - rizza - Холодное оружие`,
        `rizza - vertigo`,
        `zhanulka - кискис`
    ];
    let title = titles[songIndex];
    console.log(title);

    function playPause(){
        document.querySelector('.ProgressBarContainer').addEventListener('click', setProgress);
        if(listened)
        {
            listened = false;
            audio.pause();
        }else{
            listened = true;
            audio.play();
        }
    }

    function next(){
        document.querySelector('.ProgressBar').style.width = `0%`;
        audio.pause();
        if(songIndex < songs.length-1){
            songIndex++;
        }
        song = songs[songIndex];

        title = titles[songIndex];
        document.querySelector('.Title').innerHTML = title;
        createAudio(song);
        audio.play();
        document.querySelector('.ProgressBarContainer').addEventListener('click', setProgress);
    }
    function last(){
        document.querySelector('.ProgressBar').style.width = `0%`;
        audio.pause();
        if(songIndex > 0){
            songIndex--;
        }
        song = songs[songIndex];

        title = titles[songIndex];
        document.querySelector('.Title').innerHTML = title;
        createAudio(song);
        audio.play();
        document.querySelector('.ProgressBarContainer').addEventListener('click', setProgress);
    }

    function createAudio(path)
    {
        audio = new Audio(path);
        audio.volume = 0.1;
        audio.addEventListener('timeupdate', updateProgress);
    }

    function updateProgress(e){
        let {duration, currentTime} = e.srcElement;
        let progressPercent = currentTime/duration * 100;
        if(duration === currentTime)
            next();
        document.querySelector('.ProgressBar').style.width = `${progressPercent}%`;
    }

    function setProgress(e){
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        audio.currentTime = (clickX/width) * duration;
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
                <div className="Button" onClick={() => {last()}}>

                </div>
                <div className="ButtonCenter" onClick={() => {playPause()}}>
                </div>
                <div className="Button" onClick={() => {next()}}>

                </div>
            </div>
        </div>
    );
}

export default App;
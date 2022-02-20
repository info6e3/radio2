import React, {useState} from 'react';
import './styles/Radio.css';
const ServerAddress = require('./config.js').ServerAddress;

function Radio() {

    let serverURL = `${ServerAddress}/music-get`;
    //стартовые переменные
    let startTimer;
    let isStarted = false;
    let currentStartTime;
    let musicStartDuration;
    let title;

    //Стандартные настройки данных
    let audio = new Audio();
    audio.muted = true;
    audio.volume = 0.1;
    audio.autoplay = true;
    let isMuted = true;
    //Получение аудио при запуске страницы
    GetAudio(serverURL);

    function PlayAudio(_url, _title, _currentTime){
        currentStartTime = _currentTime;
        title = _title;
        document.querySelector('.Title').innerHTML = title;
        document.title = title;
        audio.src = _url;
        if(isStarted) {
            audio.addEventListener('timeupdate', updateProgress);
            audio.currentTime = _currentTime;
        } else {
            startTimer = setInterval(() => {
                currentStartTime += 0.5;
                let progressPercent = currentStartTime/musicStartDuration * 100;
                document.querySelector('.ProgressBar').style.width = `${progressPercent}%`;
                if(musicStartDuration <= currentStartTime) {
                    clearInterval(startTimer);
                    GetAudio(serverURL);
                }
            }, 500);
        }
    }


    function GetAudio(_url) {
        title = "Ждем музыку";
        document.title = title;
        if(isStarted)
        {
            document.querySelector('.Title').innerHTML = "Ждем музыку";
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", _url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        console.log("Запрос отправлен");
        xhr.send();
        xhr.onload = () => {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                musicStartDuration = response.file.duration;
                let file = response.file;
                let currentTime = response.currentTime;
                PlayAudio(file.url, file.title, currentTime);
            } else {
                document.querySelector('.Title').innerHTML = "Ошибка";
                console.log("Server response: ", xhr.responseText);
            }
        };
    }

    function updateProgress(e){
        let {duration, currentTime} = e.srcElement;
        let progressPercent = currentTime/duration * 100;
        document.querySelector('.ProgressBar').style.width = `${progressPercent}%`;
        //console.log(`${duration} / ${currentTime}`)
        if(duration === currentTime){
            audio.removeEventListener('timeupdate', updateProgress);
            GetAudio(serverURL);
        }
    }

    function MuteButton(){
        if(isStarted){
            if(isMuted){
                document.querySelector('.ButtonMute').style.background = "limegreen";
                audio.muted = false;
                isMuted = false;
            }else {
                document.querySelector('.ButtonMute').style.background = "crimson";
                audio.muted = true;
                isMuted = true;
            }
        } else {
            clearInterval(startTimer);
            document.querySelector('.ButtonMute').style.background = "limegreen";
            isStarted = true;
            isMuted = false;
            audio.muted = false;
            audio.play();
            if(audio.src)
                audio.currentTime = currentStartTime;
            audio.addEventListener('timeupdate', updateProgress);
        }
    }

    return (
        <div className="Radio">
            <div className="Title">
                "Ждем музыку"
            </div>
            <div className="ProgressBarContainer">
                <div className="ProgressBar">

                </div>
            </div>
            <div className="Buttons">
                <div className="ButtonMute" onClick={() => {MuteButton()}}>
                </div>
            </div>
        </div>
    );
}

export default Radio;
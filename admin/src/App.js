import React, {useState} from 'react';
import './styles/App.css';


function App() {
  const [drag, setDrag] = useState(false);

  function dragStartHandler(e){
    e.preventDefault();
    setDrag(true);
  }

  function dragLeaveHandler(e){
    e.preventDefault();
    setDrag(false);
  }

  function onDropHandler(e){
    e.preventDefault();
    let files = [...e.dataTransfer.files]
    console.log(files);

    files.forEach(file => {
      let formData = new FormData();
      formData.append('file', file);
      SendPost("http://localhost:5000/music", formData);
    });
    setDrag(false);
  }

  function SendPost(_url, _data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", _url);
    xhr.onload = () => {
      if (xhr.status == 200) {
        console.log(xhr.responseText);
      } else {
        console.log("Server response: ", xhr.statusText);
      }
    };
    xhr.send(_data);
  }

  return (
    <div className="App">
      <div className="DragSpace">
      {drag
          ? <div
              className='drop-area'
              onDragStart = {e => dragStartHandler(e)}
              onDragLeave = {e => dragLeaveHandler(e)}
              onDragOver = {e => dragStartHandler(e)}
              onDrop = {e => onDropHandler(e)}
            >Отпустите файлы для загрузки</div>
          : <div
              className='drop-area-false'
              onDragStart = {e => dragStartHandler(e)}
              onDragLeave = {e => dragLeaveHandler(e)}
              onDragOver = {e => dragStartHandler(e)}
            >Перетащите файлы для загрузки</div>

      }
      </div>
      <div className="Items">
        <div className="FilesTitle">Файлы</div>
        <div className="FilesBox"></div>
      </div>
    </div>
  );
}

export default App;

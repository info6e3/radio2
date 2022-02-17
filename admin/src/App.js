import {useState} from 'react';
import './styles/App.css';
import ItemsTurnSend from "./components/ItemsTurnSend";


function App() {
  const serverURL = "http://5.181.109.24:5000/music-download";
  let [files, setFiles] = useState([]);
  let [drag, setDrag] = useState(false);

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
    setFiles([...e.dataTransfer.files]);
    //console.log(files);
    setDrag(false);
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

      <ItemsTurnSend className="ItemsTurnSend" files={files} serverURL={serverURL}/>
    </div>
  );
}

export default App;

import {useState} from 'react';
import './styles/RadioAdmin.css';
import ItemsTurnSend from "./components/ItemsTurnSend";
import CurrentPlaylist from "./components/CurrentPlaylist";


function RadioAdmin() {
  const downloadMusicURL = "http://5.181.109.24:5000/music-download";
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
    <div className="RadioAdmin">
      <CurrentPlaylist/>
      <div className="RadioAdmin-DragSpace">
      {drag
          ? <div
              className='RadioAdmin-drop-area'
              onDragStart = {e => dragStartHandler(e)}
              onDragLeave = {e => dragLeaveHandler(e)}
              onDragOver = {e => dragStartHandler(e)}
              onDrop = {e => onDropHandler(e)}
            >Отпустите файлы для загрузки</div>
          : <div
              className='RadioAdmin-drop-area-false'
              onDragStart = {e => dragStartHandler(e)}
              onDragLeave = {e => dragLeaveHandler(e)}
              onDragOver = {e => dragStartHandler(e)}
            >Перетащите файлы для загрузки</div>

      }
      </div>
      <ItemsTurnSend files={files}/>
    </div>
  );
}

export default RadioAdmin;

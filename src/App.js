import { useEffect, useRef, useState } from 'react';
import './App.css';

import { LuMusic2 } from "react-icons/lu";
import { IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline } from "react-icons/io5";
import { CiPause1  } from "react-icons/ci";
import { MdOutlineRepeat, MdOutlineRepeatOne } from "react-icons/md";


function App() {
  const audioPlayer = useRef(null)

  const [select, setSelect] = useState(false)
  const [upload, setUpload] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)

  const [play, setPlay] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [reload, setReaload] = useState(false)

  const [speed, setSpeed] = useState(1)


  const handleFileChanged = (e) => {
    setSelectedFile(e.target.files[0])
    setSelect(true)
  }
  const handleUpload = (e) => {
    if (selectedFile) {
      audioPlayer.current.src = URL.createObjectURL(selectedFile)
    }
    setUpload(true)
    audioPlayer.current.play()
    setPlay(true)
  }

  const handlePlay = () => {
    if (play) {
      audioPlayer.current.pause()
    } else {
      audioPlayer.current.play()
    }
    setPlay(!play)
  }


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };  

  const handleSpeed = () => {
    let changesSpeed = 1
    if (speed === 1) {
      changesSpeed = 1.5
    } else if (speed === 1.5) {
      changesSpeed = 2
    } else if (speed === 2){
      changesSpeed = 1
    }
    setSpeed(changesSpeed)
    audioPlayer.current.playbackRate = changesSpeed
  }

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(audioPlayer.current.currentTime)
      setDuration(audioPlayer.current.duration)
    }

    if (!reload && audioPlayer.current.currentTime >= audioPlayer.current.duration){
      audioPlayer.current.pause()
      audioPlayer.current.currentTime = 0
      setPlay(false)
    } 
    if (reload && currentTime >= duration) {
      audioPlayer.current.play()
      audioPlayer.current.currentTime = 0
    }

    audioPlayer.current.addEventListener('timeupdate', updateTime)
  }, [reload, currentTime, duration])

  return (
    <div className="App">
      <div className={upload ? 'none' :'startPage'}>
        <h1>Select the music and click to upload!</h1>

        <div style={{width: "100%", display: 'flex', justifyContent: 'center'}}>
          <button className={select ? 'inputtrue' : 'input'} onClick={() => document.getElementById('getFile').click()}>Select music</button>
          <input type='file' onChange={handleFileChanged} id="getFile" style={{display:"none"}} accept='audio/*'/>
        </div>

        <button className='upload' disabled={!select} onClick={handleUpload}>Upload file</button>
      </div>

      <div className={upload ? 'player' : 'none'} >
        <LuMusic2 size={160} color='white' style={{position: 'absolute', top: '90px', opacity: .8, filter: 'drop-shadow(0 0 5px white)'}}/>
        <audio ref={audioPlayer}></audio>

        <form className='form'>
          <div className='times'>
            <input 
              type="range" 
              className='range'
              max={duration}
              min={0}
              value={currentTime}
              onChange={(e) => audioPlayer.current.currentTime = e.target.value}
            />
            <div className='time'>
                <p>{formatTime(currentTime)}</p>
                <p>{formatTime(duration)}</p>
            </div>
          </div>


          <div className='switch'>
            <IoPlayBackOutline size='50' className='key' onClick={() => audioPlayer.current.currentTime -= 5}/>
            {play === true
              ? <CiPause1 size={50} color='white' className='key' onClick={handlePlay}/>
              : <IoPlayOutline size={50} color='white' className='key' onClick={handlePlay}/>
            }
            <IoPlayForwardOutline size='50' className='key' onClick={() => audioPlayer.current.currentTime += 5}/>
          </div>


          <div className='additional-keys'>
          <p  onClick={handleSpeed} className="key">
              {speed === 1 
                ? '1.0x' 
                : speed === 1.5 
                    ? '1.5x' 
                    : speed === 2 
                        ? '2.0x' 
                        : '1.0x'
              }
          </p> 
          {reload === false
            ? <MdOutlineRepeat size='25' className='key' onClick={() => setReaload(!reload)}/>
            : <MdOutlineRepeatOne size='25' className='key' onClick={() => setReaload(!reload)}/>
          }
        </div>
        </form>
      
      </div>
    </div>
  );
}

export default App;

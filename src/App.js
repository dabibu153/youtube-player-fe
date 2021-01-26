import ReactPlayer from "react-player";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { socket } from "./service/socket";
import {
  BsFillPlayFill,
  BsFillPauseFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { GoUnmute } from "react-icons/go";

function App() {
  const [isPlaying, setIsplaying] = useState(false);
  const [position, setPosition] = useState();
  const [position2, setPosition2] = useState();
  const [muted, setMuted] = useState(false);
  const [uthoobURL, setUthoobURL] = useState(
    "https://www.youtube.com/watch?v=34Na4j8AVgA"
  );
  const player = useRef();

  useEffect(() => {
    player.current.seekTo(position2, "fraction");
  }, [position2]);

  socket
    .on("connect", () => {
      console.log(socket.id);
    })
    .on("pause", () => {
      console.log("heard pause");
      setIsplaying(false);
    })
    .on("play", () => {
      console.log("heard play");
      setIsplaying(true);
    })
    .on("mute", () => {
      setMuted(true);
    })
    .on("un-mute", () => {
      setMuted(false);
    })
    .on("disconnect", () => {
      console.log(socket.id);
    })
    .on("position", (arg) => {
      console.log(arg);
      setPosition2(arg);
    })
    .on("url", (arg) => {
      setUthoobURL(arg);
    });

  const handleSomething = (a) => {
    setPosition(a.played * 500);
  };
  const handlePlay = () => {
    socket.emit("play", "true");
  };
  const handlePause = () => {
    socket.emit("pause", "true");
  };
  const handleMute = () => {
    socket.emit("mute", "true");
  };
  const handleUnMute = () => {
    socket.emit("un-mute", "true");
  };
  const handleMouse = (e) => {
    var position = e.nativeEvent.offsetX / 500;
    socket.emit("position", position);
  };
  const handleURL = (e) => {
    socket.emit("url", e.target.value);
  };
  return (
    <div className="App">
      <div>
        <input type="text" value={uthoobURL} onChange={(e) => handleURL(e)} />
      </div>
      <ReactPlayer
        ref={player}
        url={uthoobURL}
        playing={isPlaying}
        onProgress={handleSomething}
        volume={1}
        muted={muted}
      />
      <div className="playerControls">
        {isPlaying ? (
          <button onClick={handlePause} className="playPause">
            <BsFillPauseFill />
          </button>
        ) : (
          <button onClick={handlePlay} className="playPause">
            <BsFillPlayFill />
          </button>
        )}
        {muted ? (
          <button onClick={handleUnMute} className="playPause">
            <GoUnmute />
          </button>
        ) : (
          <button onClick={handleMute} className="playPause">
            <BsFillVolumeMuteFill />
          </button>
        )}

        <div style={{ position: "relative" }} className="sliderBlock">
          <div
            onClick={(e) => {
              handleMouse(e);
            }}
            className="sliderBar"
          ></div>
          <div
            style={{
              position: "absolute",
              backgroundColor: "orange",
              height: "10px",
              width: "10px",
              left: `${position}px`,
              top: "-4px",
            }}
            className="sliderBlob"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;

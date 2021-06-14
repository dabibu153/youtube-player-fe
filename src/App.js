import ReactPlayer from "react-player";
import { useEffect, useState, useRef } from "react";
import "./index.css";
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
  const [sound, setsound] = useState(1);
  const [soundPosition, setsoundPosition] = useState(100);
  const [muted, setMuted] = useState(false);
  const [uthoobURL, setUthoobURL] = useState("");
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
    .on("sound-value", (arg) => {
      setsoundPosition((arg * 100).toFixed(0));
      setsound(arg);
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
  const handleSoundMouse = (e) => {
    var position = e.nativeEvent.offsetY / 100;
    socket.emit("soundPosition", 1 - position);
  };
  const handleURL = (e) => {
    socket.emit("url", e.target.value);
  };
  // const hanldeMouseHover = (e) => {
  //   var position = e.nativeEvent.offsetX;
  //   sethoverPosition(position);
  // };
  return (
    <div className="App mx-2">
      <div class="flex my-8">
        <span class="text-2lg font-bold border-2 rounded-l-xl px-4 py-2 bg-gray-300 whitespace-no-wrap">
          Video Link
        </span>
        <input
          name="field_name"
          class=" border-2 rounded-r-xl px-4 py-2 text-lg"
          type="text"
          placeholder="paste here...."
          value={uthoobURL}
          onChange={(e) => handleURL(e)}
        />
      </div>
      <div className="flex h-full items-center justify-center w-full ">
        <div className="h-full  w-1/12 flex flex-col items-center justify-around mr-2">
          <div
            onClick={isPlaying ? handlePause : handlePlay}
            className="bg-indigo-500 p-2 md:p-4  rounded-full text-white mb-4 cursor-pointer"
          >
            {isPlaying ? (
              <BsFillPauseFill size={40} />
            ) : (
              <BsFillPlayFill size={40} />
            )}
          </div>
          <div
            onClick={muted ? handleUnMute : handleMute}
            className="bg-indigo-500 p-2 md:p-4 rounded-full text-white mt-4 cursor-pointer"
          >
            {muted ? (
              <GoUnmute size={40} />
            ) : (
              <BsFillVolumeMuteFill size={40} />
            )}
          </div>
        </div>
        <div className="pointer-events-none relative">
          <ReactPlayer
            ref={player}
            url={uthoobURL}
            playing={isPlaying}
            onProgress={handleSomething}
            volume={sound}
            muted={muted}
          />
          <div
            className={`${
              uthoobURL === "" ? "" : "hidden"
            } absolute h-full w-full top-0 left-0 bg-gray-300 z-20 flex items-center justify-center font-black text-4xl text-gray-400`}
          >
            PASTE LINK ABOVE...
          </div>
        </div>
        <div className="relative w-1/12  flex items-center justify-center ml-2">
          <div
            // onMouseEnter={() => sethoverVisible(true)}
            // onMouseLeave={() => sethoverVisible(false)}
            //onMouseMove={(e) => hanldeMouseHover(e)}
            style={{ height: "100px" }}
            onClick={(e) => {
              handleSoundMouse(e);
            }}
            className="z-20 relative w-1 mx-auto bg-gray-500"
          >
            <div
              style={{
                bottom: `${soundPosition - 10}px`,
              }}
              className="absolute bg-indigo-500 h-5 w-5 rounded-full -left-2"
            ></div>
            {/* <div
                style={{
                  left: `${hoverPosition - 10}px`,
                }}
                className={`absolute bg-indigo-200 h-5 w-5 rounded-full -top-2 ${
                  hoverVisible ? "" : "hidden"
                }`}
              ></div> */}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full mt-6">
          <div
            // onMouseEnter={() => sethoverVisible(true)}
            // onMouseLeave={() => sethoverVisible(false)}
            //onMouseMove={(e) => hanldeMouseHover(e)}
            style={{ width: "500px" }}
            onClick={(e) => {
              handleMouse(e);
            }}
            className="z-20 relative h-6 mx-auto pt-3"
          >
            <div className=" relative bg-gray-500 h-1 mx-auto ">
              <div
                style={{
                  left: `${position - 10}px`,
                }}
                className="absolute bg-indigo-500 h-5 w-5 rounded-full -top-2"
              ></div>
              {/* <div
                style={{
                  left: `${hoverPosition - 10}px`,
                }}
                className={`absolute bg-indigo-200 h-5 w-5 rounded-full -top-2 ${
                  hoverVisible ? "" : "hidden"
                }`}
              ></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

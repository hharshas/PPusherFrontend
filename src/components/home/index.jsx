import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useSocket } from "../socketcontext/index.jsx";
import { saveSongToDB } from "../../indexeddb/index";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/authContext";

const Home = () => {
  const { searchResults, socket, setSearchResults } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // New state for like status
  const [songDetail, setSongDetail] = useState(0);
  const [songName, setSongName] = useState("");

  const audioRef = useRef(null);
  const { currentUser, userLoggedIn } = useAuth();

  useEffect(() => {
    if (audioSource && audioRef.current) {
      audioRef.current.src = audioSource;
      audioRef.current.play();
    }
  }, [audioSource]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setSearchResults([]);
      socket.emit("searchSongAcrossUsers", searchTerm.trim());
    }
  };

  const mergeAndPlaySongs = async () => {
    try {
      const uniqueResults = [
        ...new Map(searchResults.map((song) => [song.fileName, song])).values(),
      ].sort((a, b) => {
        if (
          a.fileName.endsWith("firsthalf") &&
          !b.fileName.endsWith("firsthalf")
        ) {
          return -1;
        }
        if (
          !a.fileName.endsWith("firsthalf") &&
          b.fileName.endsWith("firsthalf")
        ) {
          return 1;
        }
        return 0;
      });
      const firstSong = uniqueResults[0];
      let sngName = firstSong.fileName;

      if (sngName.endsWith("_firsthalf")) {
        sngName = sngName.replace("_firsthalf", "");
      }
      if (sngName.endsWith("_secondhalf")) {
        sngName = sngName.replace("_secondhalf", "");
      }
      setSongName(sngName);
      getsongdetails();
      const audioContext = new AudioContext();
      const buffers = await Promise.all(
        uniqueResults.map(async (song) => {
          const arrayBuffer = await fetch(song.dataURL).then((response) =>
            response.arrayBuffer()
          );
          return await audioContext.decodeAudioData(arrayBuffer);
        })
      );

      const mergedBuffer = mergeAudioBuffers(buffers, audioContext);
      const audioBlob = await exportAudioBufferAsWav(
        mergedBuffer,
        audioContext
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      setAudioSource(audioUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error processing audio files:", error);
    }
  };

  const mergeAudioBuffers = (buffers, audioContext) => {
    const totalDuration = buffers.reduce(
      (acc, buffer) => acc + buffer.duration,
      0
    );
    const mergedBuffer = audioContext.createBuffer(
      buffers[0].numberOfChannels,
      totalDuration * audioContext.sampleRate,
      audioContext.sampleRate
    );
    let offset = 0;
    buffers.forEach((buffer) => {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        mergedBuffer
          .getChannelData(channel)
          .set(buffer.getChannelData(channel), offset);
      }
      offset += buffer.duration * audioContext.sampleRate;
    });
    return mergedBuffer;
  };

  const exportAudioBufferAsWav = async (audioBuffer, audioContext) => {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = new Blob([renderedBufferToWav(renderedBuffer)], {
      type: "audio/wav",
    });
    return wavBlob;
  };

  const renderedBufferToWav = (buffer) => {
    const interleaved = interleave(buffer);
    const bufferLength = 44 + interleaved.length * 2;
    const wavArray = new ArrayBuffer(bufferLength);
    const view = new DataView(wavArray);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, interleaved.length * 2, true);

    let offset = 44;
    for (let i = 0; i < interleaved.length; i++, offset += 2) {
      let sample = Math.max(-1, Math.min(1, interleaved[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
    }

    return new Uint8Array(wavArray);
  };

  const interleave = (buffer) => {
    const length = buffer.length * 2;
    const interleaved = new Float32Array(length);
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const channelData = buffer.getChannelData(i);
      for (let j = 0; j < buffer.length; j++) {
        interleaved[j * 2 + i] = channelData[j];
      }
    }
    return interleaved;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const getsongdetails = async () => {
    const headers = {
      accesstoken: currentUser.accessToken,
    };

    try {
      const res = await axios.get(
        `https://ppusherbackend-u9sl.onrender.com/api/songs/fetch/${encodeURIComponent(
          songName
        )}`,
        {
          headers,
        }
      );
      console.log(res.data.likes);
      setSongDetail(res.data.likes);
    } catch (err) {
      console.log(err);
    }
  };

  const likeSong = async () => {

    const data = {
      name: songName,
    };
    const headers = {
      accesstoken: currentUser.accessToken,
    };
    try {
      const response = await axios.post(
        `https://ppusherbackend-u9sl.onrender.com/api/songs/like/${encodeURIComponent(
          songName
        )}`,
        {},
        {
          headers,
        }
      );
      toast.success("liked successfully !!");
      console.log(response.data);
    } catch (error) {
      toast.error("Error adding song. Please try again later.");
      console.error("Error adding song:", error);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);

    if(isLiked == false) setSongDetail(songDetail+1);
    else setSongDetail(songDetail-1);
    likeSong();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="grid sm:grid-cols-10 grid-cols-4 items-center p-4">
        <input
          type="text"
          placeholder="Search your song here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:col-span-9 col-span-3 px-4 py-2 w-full border border-gray-300 focus:outline-none focus:border-gray-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center h-full bg-gray-500 text-white hover:bg-gray-600 focus:outline-none px-4"
        >
          <i className="fa fa-search"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2>Search Results</h2>
        <ul className="max-h-full overflow-y-auto">
          {searchResults.map((song, index) => (
            <li
              key={index}
              className="mb-4 border border-gray-300 rounded p-4 flex justify-between items-center"
            >
              <span>
                <strong>Song Name: </strong> {song.fileName}
              </span>
              <audio className="w-1/2" controls>
                <source src={song.dataURL} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-10 grid-cols-4 fixed bottom-0 w-full items-center">
        <button
          type="button"
          onClick={mergeAndPlaySongs}
          disabled={isPlaying}
          className="sm:col-span-9 col-span-3 bg-blue-500 text-white p-4 hover:bg-blue-600 focus:outline-none"
        >
          {isPlaying ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            "Play Merged Audio"
          )}
        </button>
        <button
          type="button"
          onClick={toggleLike}
          className={`bg-gray-300 text-gray-700 p-4 hover:bg-gray-400 focus:outline-none ${
            isLiked ? "text-red-500" : ""
          }`}
        > {songDetail}
          <i className={`fa ${isLiked ? "fa-heart" : "fa-heart-o"} mx-2`}></i>
        </button>
      </div>
      <ToastContainer />
      <audio ref={audioRef} onEnded={handleAudioEnd} className="hidden"></audio>
    </div>
  );
};

export default Home;

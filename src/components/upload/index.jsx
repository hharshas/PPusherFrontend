import React, { useState } from "react";
import { useSocket } from "../socketcontext/index.jsx";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../contexts/authContext";


const addSong = async (token, songName) => {
    const data = {
        name: songName
    };
    const headers = {
        accesstoken: token,
    };
    try {
      const response = await axios.post('https://ppusherbackend-u9sl.onrender.com/api/songs/add', data, {
        headers
      });
      toast.success('Song added successfully!');
      console.log(response.data);
    } catch (error) {
      toast.error('Error adding song. Please try again later.');
      console.error('Error adding song:', error);
    }
  };
  

const Upload = () => {
  const { socket } = useSocket();
  const [selectedFile, setSelectedFile] = useState(null);
  const [songName, setSongName] = useState("");
  const { currentUser, userLoggedIn } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSendSong = async () => {
    if (!selectedFile || !songName.trim()) return;

    const audioContext = new AudioContext();
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const duration = audioBuffer.duration;
      const splitPoint = duration / 2;

      const firstHalfBuffer = sliceAudioBuffer(audioBuffer, 0, splitPoint, audioContext);
      const secondHalfBuffer = sliceAudioBuffer(audioBuffer, splitPoint, duration, audioContext);

      const firstHalfDataURL = await exportAudioBufferAsWav(firstHalfBuffer, audioContext);
      const secondHalfDataURL = await exportAudioBufferAsWav(secondHalfBuffer, audioContext);

      if (socket) {
        addSong(currentUser.accessToken, songName.trim());
        socket.emit("sendSong", { songData: { fileName: `${songName.trim()}_firsthalf`, fileType: 'audio/wav', dataURL: firstHalfDataURL } });
        socket.emit("sendSong", { songData: { fileName: `${songName.trim()}_secondhalf`, fileType: 'audio/wav', dataURL: secondHalfDataURL } });

        setSelectedFile(null);
        setSongName("");
      } else {
        console.error("Socket is not initialized.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const sliceAudioBuffer = (audioBuffer, start, end, audioContext) => {
    const channels = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i).subarray(start * audioBuffer.sampleRate, end * audioBuffer.sampleRate));
    }
    const slicedBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, (end - start) * audioBuffer.sampleRate, audioBuffer.sampleRate);
    channels.forEach((channelData, index) => {
      slicedBuffer.copyToChannel(channelData, index);
    });
    return slicedBuffer;
  };

  const exportAudioBufferAsWav = async (audioBuffer, audioContext) => {
    const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(renderedBufferToWav(renderedBuffer));
    });
    return wavBlob;
  };

  const renderedBufferToWav = (renderedBuffer) => {
    const interleaved = interleave(renderedBuffer);
    const buffer = new ArrayBuffer(44 + interleaved.length * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, renderedBuffer.sampleRate, true);
    view.setUint32(28, renderedBuffer.sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    let offset = 44;
    for (let i = 0; i < interleaved.length; i++, offset += 2) {
      let sample = Math.max(-1, Math.min(1, interleaved[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, sample, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const interleave = (buffer) => {
    const interleaved = new Float32Array(buffer.length * 2);
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const channelData = buffer.getChannelData(i);
      for (let j = 0; j < buffer.length; j++) {
        interleaved[j * 2] = channelData[j];
        interleaved[j * 2 + 1] = channelData[j];
      }
    }
    return interleaved;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="songName">
            Song Name
          </label>
          <input
            type="text"
            id="songName"
            placeholder="Enter song name"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUpload">
            Upload File
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSendSong}
          className="w-full bg-[#502e6e] text-white py-2 rounded hover:bg-[#452A5A] focus:outline-none"
        >
          Send Song
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Upload;

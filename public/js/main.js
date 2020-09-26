const socket = io();

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// 240p video stream
var width = 240;
var height = 0;

var imageStreams = {};
// var audioStreams = {};

var handleVideoSuccess = function (stream) {
  myVideo.srcObject = stream;
  myVideo.play();
  videoGrid.appendChild(myVideo);
};

// var handleAudioSuccess = function (stream) {
//   const options = { mimeType: "audio/webm" };
//   const mediaRecorder = new MediaRecorder(stream, options);

//   setInterval(() => {
//     const recordedChunks = [];
//     if (mediaRecorder.state !== "recording") {
//       mediaRecorder.start();
//     }
//     mediaRecorder.addEventListener("dataavailable", function (e) {
//       if (e.data.size > 0) {
//         recordedChunks.push(e.data);
//       }
//     });
//     setTimeout(() => {
//       if (mediaRecorder.state !== "inactive") {
//         mediaRecorder.stop();
//       }
//     }, 500);

//     mediaRecorder.addEventListener("stop", function () {
//       var audioFile = new Blob(recordedChunks);
//       audioFile.arrayBuffer().then((arrayBuffer) => {
//         socket.emit("audio", socket.id, bufferToBase64(arrayBuffer));
//       });
//     });
//   }, 500);
// };

myVideo.addEventListener(
  "canplay",
  function (ev) {
    setInterval(function () {
      socket.emit("image", socket.id, takePicture());
    }, 16);

    ev.preventDefault();
  },
  false
);

navigator.mediaDevices.enumerateDevices().then((devices) => {
  devices = devices.filter((d) => d.kind === "videoinput");

  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        deviceId: devices[0].deviceId,
      },
    })
    .then(handleVideoSuccess);
});

// navigator.mediaDevices
//   .getUserMedia({ audio: true, video: false })
//   .then(handleAudioSuccess);

function takePicture() {
  const canvas = document.createElement("canvas");
  height = myVideo.videoHeight / (myVideo.videoWidth / width);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  var context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(myVideo, 0, 0, width, height);    
  } else {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  return canvas.toDataURL("image/png");
}

socket.on("image", (userId, image) => {
  if (!imageStreams.hasOwnProperty(userId)) {
    imageStreams[userId] = document.createElement("img");
    videoGrid.appendChild(imageStreams[userId]);
  }
  imageStreams[userId].setAttribute("src", image);
});

// socket.on("audio", (userId, audioString) => {
//   audioStreams[userId] = { context: null, audio: null, source: null };
//   audioStreams[userId].context = new AudioContext();
//   audioStreams[userId].audio = base64ToBuffer(audioString);
//   audioStreams[userId].context.decodeAudioData(
//     audioStreams[userId].audio,
//     function (buffer) {
//       // audioBuffer is global to reuse the decoded audio later.
//       audioStreams[userId].source = audioStreams[
//         userId
//       ].context.createBufferSource();
//       audioStreams[userId].source.buffer = buffer;
//       audioStreams[userId].source.loop = false;
//       audioStreams[userId].source.connect(
//         audioStreams[userId].context.destination
//       );
//       audioStreams[userId].source.start(0); // Play immediately.

//       setTimeout(() => {
//         delete audioStreams[userId];
//       }, 500);
//     },
//     function (e) {
//       console.log("Error decoding file", e);
//     }
//   );
// });

socket.on("disconnected", (userId) => {
  if (imageStreams.hasOwnProperty(userId)) {
    videoGrid.removeChild(imageStreams[userId]);
    delete imageStreams[userId];
    // delete audioStreams[userId];
  }
});

// var bufferToBase64 = function (buffer) {
//   var bytes = new Uint8Array(buffer);
//   var len = buffer.byteLength;
//   var binary = "";
//   for (var i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// };

// var base64ToBuffer = function (buffer) {
//   var binary = window.atob(buffer);
//   var buffer = new ArrayBuffer(binary.length);
//   var bytes = new Uint8Array(buffer);
//   for (var i = 0; i < buffer.byteLength; i++) {
//     bytes[i] = binary.charCodeAt(i) & 0xff;
//   }
//   return buffer;
// };

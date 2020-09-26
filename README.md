# Video-Chat
A sample video chat project done using Node.js, Express and socket.io. 

The whole idea was to try to stream audio/video as text content using WebSockets. The video and audio are cut into chunks at 16ms interval (60 frames per second), encoded to a base64 string and sent as message via WebSockets. The server the broadcast the message to the other participants and the media are reconstructed on the client's side.

**Note:** For the time being, the audio stream has been commented out as it was very buggy, I will work on that later. Also, the Navigator.mediaDevices web API is meant to work on secure connections, so you can serve the project on host 0.0.0.0. When the audio will bbe fixed, I plan on hosting a demo on Heroku.

## Installation
Use the following commands to download the project and install its dependencies.
```git clone https://github.com/Wil2129/Video-Chat.git```
```npm install```

To run the project, run:
```npm run start```

## Contributing
Please feel free to contribute to this project. I did it on a whim because the idea of sending a video stream via text-based message just occurred to me. I will gladly learn any new technique or algorithms.

Most importantly, this is not anything serious and I am fully aware of libraries such as WebRTC and it was a choice not to use them. The whole idea was a "hack" video chat without the use of any appropriate library/framework.
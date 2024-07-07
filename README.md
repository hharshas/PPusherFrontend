# pPushr

## Problem
All the big music streaming platforms use central client servers to host their songs. While this is a good approach, it has its cons, namely cost and infrastructure. Also, the servers have to constantly be scaled to match the user base.

## Solution
An app that uses a peer-to-peer file-sharing protocol to solve some of the said issues and provide an alternative to the public.

## Key Features
- Peer-to-peer file-sharing protocol
- AI-enhanced

## Tech Stack
- MongoDB
- Node.js
- Express
- React
- Redux
- Flask
- Tailwind CSS
- Socket.IO
- IndexedDB

## Implementation
The idea is to use a peer-to-peer file-sharing protocol that enables the app to work on a much simpler and lighter server. The file will be split into chunks and then stored on different clients, which then serve as seeds to deliver the chunks upon a request. A tracker will be used as a lightweight central server to keep track of the chunks. Also, it will scale itself due to the inherent nature of the protocol.

An AI model will be used to better the functionality of the protocol by choosing the best seed for chunk retrieval.

## Challenges Anticipated
- Keeping the system active when the user base is small
- Piracy avoidance
- Serving rare chunks when seeds are not active
- Blocking leechers

## Present Goals
- Set up a peer-to-peer sharing server for songs
- Utilize the AudioContext Web APIs to split music ﬁles into chunks and store them on diﬀerent clients,
which then serve as seeds to deliver the chunks upon request
- Implement a real-time chunks distribution system feature using WebSocket and Socket.io
- Develop a user-friendly UI

## Future Goals
- Extend the idea for sharing all types of files, rather than the current file type of MP3
- Integrate with an AI model that chooses the best available seed

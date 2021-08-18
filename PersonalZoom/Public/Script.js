const socket = io('/') 
const videoGrid= document.getElementById('video-grid')
// elaboración de peer2peer, aca utilicé la librería peerJS.
const MyPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const MyAudio = document.createElement('audio')
MyAudio.muted = true;
const peers = {}

//buscamos microfono y video para streaming.
navigator.mediaDevices.getUserMedia({
    
    audio:true
    
}).then(stream =>{
    AddAudioStream(MyAudio,stream)

    MyPeer.on('call', call =>{
        const audio=document.createElement('audio')
        call.answer(stream)
        call.on('stream', userAudioStream =>{
            AddAudioStream(audio, userAudioStream)
        })
    })

    socket.on('usuario-conectado', userId => {
       connectToNewUser(userId, stream)
    })
    
})

socket.on('user-disconnected', userId =>{
    if(peers[userId]) peers[userId].close()
    console.log('USUARIO DESCONECTADO' + userId)
})


MyPeer.on('open', id =>{
socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = MyPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userAudioStream =>{
        AddAudioStream(audio, userAudioStream)
    })
    call.on('close', () => {
        audio.remove()
    })

    peers[userId] = call
}
function AddAudioStream(audio, stream){
    audio.srcObjet = stream
   audio.addEventListener('loadedmetadata', () =>{
        audio.play()
    })
 // videoGrid.append(video) esto sería si quiero usar el video, por ahora no voy a implementarlo ya que quiero hacer
 // una comunicación de voz p2p  directa y fácil.
}
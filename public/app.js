const peer = new Peer()
const socket = io('/')

const vids = document.getElementById('vids')

const p = document.createElement('p')
document.body.appendChild(p)

const me = document.createElement('audio')
me.setAttribute('autoplay', '');
me.setAttribute('muted', '');
me.setAttribute('playsinline', '');

const btn = document.getElementById('join-call')

var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    bttn = document.getElementById('send'),
    output = document.getElementById('output');



bttn.addEventListener('click', function(){
  socket.emit('chat', {
      message: message.value,
      handle: handle.value
      });
  message.value = "";
});

socket.on('chat', function(data){
  console.log("recieved chat")
  output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>';
});


navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(stream => {
    addVideoStream(me, stream)

    peer.on('call', call => {
        call.answer(stream)
        const vid = document.createElement('audio')
        call.on('stream', userVideoStream => {
            addVideoStream(vid, userVideoStream)
          })
    })

    socket.on('new-connection', (uid) => {
        newConnection(uid,stream)
    })
})



peer.on('open', id => {
    socket.emit('stream', id)
    p.innerHTML += `Your peer id is ${id}`
})


function newConnection(id, stream) {
    const call = peer.call(id,stream)
    const vid = document.createElement('audio')
    call.on('stream', userVideoStream => {
        addVideoStream(vid, userVideoStream)
      })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    vids.append(video)
}
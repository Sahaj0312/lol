const peer = new Peer()
const socket = io('/')

const vids = document.getElementById('vids')

const p = document.createElement('p')
document.body.appendChild(p)

const me = document.createElement('video')
me.setAttribute('autoplay', '');
me.setAttribute('muted', '');
me.setAttribute('playsinline', '');

const btn = document.getElementById('join-call')


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(me, stream)

    peer.on('call', call => {
        call.answer(stream)
        const vid = document.createElement('video')
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
    p.innerHTML += `Your id is ${id}`
})


function newConnection(id, stream) {
    const call = peer.call(id,stream)
    const vid = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(vid, userVideoStream)
      })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    vids.append(video)
}

module.exports = function(io){
  let users = {}
  io.on('connection', (socket) => {
    socket.on('login',(id)=>{
      socket.name = id
      users[id] = socket.id
      // socket.emit('test',1111)
    })
    socket.on('send',(data,uid,fid)=>{
      console.log(data)
      // socket.emit('test',1111)
    })
    socket.on('disconnecting',()=>{
      if(users.hasOwnProperty(socket.name)){
        delete users[socket.name]
      }
      // socket.emit('test',1111)
    })
    // console.log(socket)
  })
}

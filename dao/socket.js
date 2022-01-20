
const dbserver = require('./dbserver')
module.exports = function(io){
  let users = {}
  io.on('connection', (socket) => {
    socket.on('login',(id)=>{
      socket.name = id
      users[id] = socket.id
      // socket.emit('test',1111)
    })
    socket.on('send',(data,uid,fid)=>{
      // console.log(data)
      if(users[fid]){
        io.sockets.sockets[users[fid]].emit('test', {data,uid});
      }
      dbserver.wsInsertMsg(uid, fid,data.message,data.types)
      dbserver.updateMsgLastTime({uid, fid})
      // socket.emit('test',data)
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

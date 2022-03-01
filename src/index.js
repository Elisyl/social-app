const app = require('./app')
const port = process.env.PORT || 4500

const http = require('http')

const server = http.createServer(app)

server.listen(port, ()=> {
    console.log('Server on ' + port);
}) 
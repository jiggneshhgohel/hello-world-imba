var express = require 'express'
var server = express()

server.use(express.static('./dist'))

var port = process:env.PORT or 8080

var server = server.listen(port) do
    console.log 'server is running on port ' + port
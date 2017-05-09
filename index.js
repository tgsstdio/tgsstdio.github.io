function resolvePort(defaultPort) {
  const path = require('path')

  var inspectParam = 0
  var argCount = process.argv.length
  for (var i = 0; i < argCount; i += 1)
  {
    var arg = process.argv[inspectParam]

    if (arg === '--PORT') {
      inspectParam += 1
      
      if (inspectParam >= argCount) {        

        console.log('Usage: node ' + path.basename(__filename) + ' [--PORT <num>]')
        process.exit(-1);
      }

      defaultPort = process.argv[inspectParam]

      // ONCE ONLY
      break
    }

    inspectParam += 1
  }

  return defaultPort
}

var PORT = resolvePort(8081)

// LOCAL NODE HOSTING
const HOST = '127.0.0.1'

console.log('PORT : ' + PORT)

var http = require('http')
var fs = require('fs')
var path = require('path')

var server = http.createServer(function (request, response) {
  console.log('request ', request.url)

  var filePath = '.' + request.url
  if (filePath === './') {
    filePath = './index.html'
  }

  var extname = String(path.extname(filePath)).toLowerCase()
  var contentType = 'text/html'
  var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
  }

  contentType = mimeTypes[extname] || 'application/octect-stream'

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', function (error, content) {
          if (error) {
            throw new Error('404 not found')
          }

          response.writeHead(200, { 'Content-Type': contentType })
          response.end(content, 'utf-8')
        })
      } else {
        response.writeHead(500)
        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n')
        response.end()
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}).listen(PORT, HOST)

console.log('Server at http://' + HOST + ':' + PORT.toString() + '/')

process.on('SIGINT', function () {
  server.close()
})

process.on('exit', function () {
  console.log('Bye!')
})
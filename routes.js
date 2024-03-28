const fs = require('fs');

const requirehandeler = (req,res)=>{
const url = req.url;
const method = req.method;
if (url === '/'){
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
     return res.end();
}
if (url === '/message' && method === 'POST'){
    const body = [];
    req.on('data',(chunk)=>{
        console.log(chunk);
        body.push(chunk);
    })
   return req.on('end',()=>{
        const parsebody = Buffer.concat(body).toString();
        console.log(parsebody);
        const message = parsebody.split('=')[1];
        fs.writeFile('message.txt',message,err=>{
            res.statusCode = 302;
            res.setHeader('Location','/');
            return res.end();
        });
    });
}
res.setHeader('content-type', 'text/html');
res.write('<html>')
res.write('<head><title>my first page </title><head>');
res.write('<body><h2>Hello from my node.js server!</h2></body>');
res.write('</html>');
res.end();
}

module.exports.handler = requirehandeler;
module.exports.sometext = 'some hard code text';
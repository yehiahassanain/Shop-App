const http = require('http');
const { buffer } = require('stream/consumers');

const server = http.createServer((req,res)=>{
    const url = req.url;
    const method = req.method;
    console.log(url);
    if (url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url==='/create-user' && method==='POST'){
        const body = [];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
       return req.on('end',()=>{
            const parsestat = Buffer.concat(body).toString();
            console.log(parsestat);
            const message = parsestat.split('=')[1];
            console.log(message);
            res.statusCode = 302;
        res.setHeader('location','/');
        res.end;
        });
    }
    res.setHeader('content-type', 'text/html');
    res.write('<html>')
    res.write('<head><title>my first page </title><head>');
    res.write('<ul><li>User1</li></ul>');
    res.write('</html>');
    res.end();
});
server.listen(3000);
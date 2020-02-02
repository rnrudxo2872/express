/* var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
let template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');


var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  let title = undefined;
  if (pathname === '/') {
    if (queryData.id === undefined) {

  } 


    })
  } else if (pathname === '/updata') {
    
  } else if (pathname === '/updata_process') {
    

  } else if (pathname === '/delete_process') {


  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000); */
let express = require('express');
let app = express();
var fs = require('fs');
let template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var qs = require('querystring');

const port = 3000;

app.get('/', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    title = `Welcome to 경태's page`;
    let descrip = '안녕? 경태페이지란다';
    var list = template.list(filelist, ``);
    var html = template.HTML(title, list, `<div id="article">
    <h2>${title}</h2>
    <p>
    <iframe width="550" height="315" src="https://www.youtube.com/embed/n8Yx9S2Izr4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <br>
    ${descrip}
   </p>
  </div>`)

    res.send(html);
  })
}) //route,routing 갈림길에서 적당한 응답을 해주는 역할
app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    title = req.params.pageId;
    let filleredId = path.parse(req.params.pageId).base; //return confirm 해야지 false 시 페이지가 안넘어감
    list = template.list(filelist, `<a href="/page_create">create</a><br>
                                <a href="/updata/${title}">updata</a><br>
                                <form action="/delete_process" method="POST" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                                </form>`);
    fs.readFile(`data/${filleredId}`, 'utf8', function (err, descrip) {
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDiscript = sanitizeHtml(descrip, {
        allowedTags: ['h1', 'h2'] //여기 허락된 태그는 sanitize(살균)를 안한다.
      }, {
        allowedIframeHostnames: ['www.youtube.com']
      });
      var html = template.HTML(sanitizedTitle, list, `<div id="article">
      <h2>${sanitizedTitle}</h2>
      <p>
      ${sanitizedDiscript}
     </p>
    </div>`)

      res.send(html)
    })
  })
})

app.get('/page_create', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    title = `WEB - create`;
    let descrip = '안녕? 경태페이지란다';
    var list = template.list(filelist, ``);
    var html = template.HTML(title, list, `<form action="/create_process" method="POST">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
        <textarea name="description" id="" cols="30" rows="10" placeholder="discription"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
</form>`)

    res.send(html);
  })
})

app.post('/create_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body += data; //조각조각 데이터가 들어옴
  })
  req.on('end', function () {
    var post = qs.parse(body);
    title = post.title;
    description = post.description;
    fs.writeFile(`./data/${title}`, description, (err) => {
      res.redirect(302, `/page/${title}`) //redirect과정 = res.writeHead(302, {Location: `/page/${title}) 
      res.end();
    })
  })
})

app.get('/updata/:pageId', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    title = req.params.pageId;
    filleredId = path.parse(req.params.pageId).base;
    list = template.list(filelist, ``);
    fs.readFile(`data/${filleredId}`, 'utf8', function (err, descrip) {
      var html = template.HTML(title, list, `<form action="/updata_process" method="POST">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
            <textarea name="description" id="" cols="30" rows="10" placeholder="discription">${descrip}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>`)

      res.send(html);
    });
  });
})

app.post('/updata_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body += data;
  })
  req.on('end', function () {
    var post = qs.parse(body);
    title = post.title;
    var id = post.id;
    description = post.description;
    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
      fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
        res.redirect(302,`/page/${title}`); //redirect
        res.end();
      })
    })
  })
})

app.post('/delete_process',(req,res) => {
  var body = '';
  req.on('data', function (data) {
    body += data;
  })
  req.on('end', function () {
    var post = qs.parse(body);
    var id = post.id;
    filleredId = path.parse(id).base;
    fs.unlink(`data/${id}`, (err) => {
      res.redirect(302,`/`);
      res.end();
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
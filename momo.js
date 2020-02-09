let express = require('express');
let app = express();
var fs = require('fs');
let template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(compression());//Content-Encoding: gzip zip으로 압축하고 보내고 웹브라우저는 해제해서 사용
                      //데이터 트레픽 줄음
app.use(bodyParser.urlencoded({ extended: false }));//form data는 이런형식
                                                  //미들웨어 표시
                                                  //post 데이터를 내부적으로 분석해서
                                                  //모든데이터를 가져온 다음에
                                                  //경로에 해당되는 callback을 호출함
                                                  //첫번째 인자인 req 뒤 body를 만들어줌

app.get('*',function(req,res,next){
  fs.readdir('./data', function (error, filelist) {
  req.list = filelist;
  next(); //다음 middleware를 동작하게 결정 한다. 
  }) //함수를 또 작성할 수 있음. if로 어떤 미들웨어가 실행될지 조건을 걸 수도있다.
}) //middleware 작성 application-level middleware (use, get)

const port = 3000;

app.get('/', (req, res) => {
    title = `Welcome to 경태's page`;
    let descrip = '안녕? 경태페이지란다';
    var list = template.list(req.list, ``);
    var html = template.HTML(title, list, `<div id="article">
    <h2>${title}</h2>
    <p>
    <iframe width="550" height="315" src="https://www.youtube.com/embed/n8Yx9S2Izr4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <br>
    ${descrip}
   </p>
  </div>`)

    res.send(html);

}) //route,routing 갈림길에서 적당한 응답을 해주는 역할
app.get('/page/:pageId', (req, res) => {
    title = req.params.pageId;
    let filleredId = path.parse(req.params.pageId).base; //return confirm 해야지 false 시 페이지가 안넘어감
    list = template.list(req.list, `<a href="/page_create">create</a><br>
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

app.get('/page_create', (req, res) => {
    title = `WEB - create`;
    let descrip = '안녕? 경태페이지란다';
    var list = template.list(req.list, ``);
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

app.post('/create_process', (req, res) => {
  /*var body = '';
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
  })*/
  var post = req.body;
  title = post.title;
  description = post.description;
  fs.writeFile(`./data/${title}`, description, (err) => {
    res.redirect(302, `/page/${title}`) //redirect과정 = res.writeHead(302, {Location: `/page/${title}) 
    res.end();
  })
})

app.get('/updata/:pageId', (req, res) => {
    title = req.params.pageId;
    filleredId = path.parse(req.params.pageId).base;
    list = template.list(req.list, ``);
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
})

app.post('/updata_process', (req, res) => {
  /*var body = '';
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
  })*/
  var post = req.body;
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

app.post('/delete_process',(req,res) => {
  /*var body = '';
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
  })*/
  var post = req.body;
  var id = post.id;
  filleredId = path.parse(id).base;
  fs.unlink(`data/${id}`, (err) => {
    res.redirect(302,`/`);
    res.end();
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
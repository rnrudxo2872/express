var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/', (req, res) => {
    title = `Welcome to 경태's page`;
    let descrip = '안녕? 경태페이지란다';
    var list = template.list(req.list, ``);
    var html = template.HTML(title, list, `<div id="article">
    <h2>${title}</h2>
    <p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Zgga4kEjkXA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <br>
    ${descrip}
   </p>
  </div>`)

    res.send(html);

}) //route,routing 갈림길에서 적당한 응답을 해주는 역할
module.exports = router;
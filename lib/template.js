module.exports = { //refactoring
    HTML: function (title, list, temp_body) {
      return `<!doctype html>
      <html>
      <head>
        <title>경태 페이즤 - ${title} </title>
        <meta charset="utf-8">
        <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-125138219-1"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-125138219-1');
      </script>
      
      <style>
      input[type="submit"]{
        height: 30px; /* 높이값 초기화 */ 
        line-height : normal; /* line-height 초기화 */ 
        padding: .0em .5em; /* 원하는 여백 설정, 상하단 여백으로 높이를 조절 */ 
        font-family: inherit; /* 폰트 상속 */ 
        background-color: #af95c5;
        border: 1px solid #999; 
        border-radius: 20px; /* iSO 둥근모서리 제거 */
        text-align: center; 
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
      a{
        color:black;
        text-decoration:none;
      }
      #grid{
        display:grid;
        grid-template-columns: 150px 1fr;
      }
      #article{
        padding-left: 10px;
      }
      h1{
        font-size:40px;
        text-align:center;
        border-bottom: 1px solid gray;
        margin:0;
      }
      #grid ol{
        border-right: 1px solid gray;
        margin:0;
         style="padding-left: 23px"
      }
      </style>
      
      </head>
      
      <body>
      
        <h1><a href="/"style="padding:0px 5px 0px 22px">WEB</a></h1>
      <div id="grid">
      
        ${list}
       
        ${temp_body}
      </div>
      
      </body>
      </html>
       `;
    },
    list: function (filelist, control) {
      var list = '<ul>';
      var i = 0;
      while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list + `${control}</ul>`;
      return list;
    }
  }
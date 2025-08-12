const path = require('path');
const fs = require('fs');

exports.handler = async (event) => {
    const cookies = parseCookies(event.headers.cookie || '');
    const isAuthenticated = cookies.auth === 'ok';
  
    if (!isAuthenticated) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: `<h2>❌ 비인가된 접근입니다.</h2><a href="/">돌아가기</a>`,
      };
    }

    // secret.html 내용 읽기
    const filePath = path.resolve(__dirname, '../../public/secret.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: html,
    };
  
    // return {
    //   statusCode: 302,
    //   headers: {
    //     Location: '/secret.html',
    //   },
    // };
  };
  
  // 쿠키 파싱 함수
  function parseCookies(cookieHeader) {
    return cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      acc[name] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
  }
  

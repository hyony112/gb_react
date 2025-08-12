require('dotenv').config();
const PASSWORD = process.env.ACCESS_PASSWORD;

exports.handler = async (event) => {
  // POST가 아니면 405 응답
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  let password;
  try {
    password = JSON.parse(event.body || '{}').password;
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Invalid JSON' }),
    };
  }


  try {
  
    if (password === PASSWORD) {
      return {
        statusCode: 200,
        headers: {
          'Set-Cookie': `gb_auth=ok; HttpOnly; Path=/; Max-Age=1800`, // 30분
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ success: true }),
      };

    }else {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: JSON.stringify({ success: false, error: 'Wrong password' }),
      };
    }

  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }

};

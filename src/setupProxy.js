//npm install http-proxy-middleware --save 설치
//네이버 cors 에러 해결을 위해 필요한 파일입니다.
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://openapi.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', 
      },
    })
  );

  // 로컬 서버(localhost:8080)로의 프록시 설정
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // Spring Boot 서버의 주소
      changeOrigin: true,
    })
  );
};


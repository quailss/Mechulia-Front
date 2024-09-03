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
};

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',  // L'adresse de votre serveur Flask
            changeOrigin: true,
        })
    );
};

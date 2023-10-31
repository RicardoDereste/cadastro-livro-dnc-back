function routes(app) {
    app.use('/livros', require('./routes/livro.js'));
    return;
}

module.exports = routes;
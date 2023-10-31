const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const conectarBancoDados = require('../middlewares/connectDB');
const EsquemaLivro = require('../models/livro');
const router = express.Router();


router.post('/criar', conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Livro']
        let { titulo, numeroPaginas, isbn, editora } = req.body;
        const respostaBD = await EsquemaLivro.create({ titulo, numeroPaginas, isbn, editora });

        res.status(200).json({
            status: "OK",
            statusMensagem: "Livro cadastrado com sucesso.",
            resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.put('/editar/:id', conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Livro']
        let idLivro = req.params.id;
        let { titulo, numeroPaginas, isbn, editora } = req.body;

        const checkLivro = await EsquemaLivro.findOne({ _id: idLivro });
        if (!checkLivro) {
            throw new Error("Livro não encontrado");
        }

        const livroAtualizado = await EsquemaLivro.updateOne({ _id: idLivro }, { titulo, numeroPaginas, isbn, editora });
        if (livroAtualizado?.modifiedCount > 0) {
            const dadosLivro = await EsquemaLivro.findOne({ _id: idLivro });

            res.status(200).json({
                status: "OK",
                statusMensagem: "Livro atualizado com sucesso.",
                resposta: dadosLivro
            })
        }
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.get('/livros', conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Livro']
        // #swagger.description = "Endpoint para obter todos livros."
        const respostaBD = await EsquemaLivro.find({}, { titulo: 1, numeroPaginas: 1, isbn: 1, editora: 1 });

        res.status(200).json({
            status: "OK",
            statusMensagem: "Livros listados com sucesso.",
            resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.get('/obter/:id', conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Livro']
        // #swagger.description = "Endpoint para obter um livro pelo ID."

        const idLivro = req.params.id;

        const livroEncontrado = await EsquemaLivro.findOne({ _id: idLivro }, { titulo: 1, numeroPaginas: 1, isbn: 1, editora: 1 });

        if (!livroEncontrado) {
            return res.status(404).json({
                status: "Not Found",
                statusMensagem: "Livro não encontrado."
            });
        }

        res.status(200).json({
            status: "OK",
            statusMensagem: "Livro encontrado com sucesso.",
            resposta: livroEncontrado
        });

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.delete('/deletar/:id', conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Livro']
        const idLivro = req.params.id;

        const checkLivro = await EsquemaLivro.findOne({ _id: idLivro });
        if (!checkLivro) {
            throw new Error("Livro não encontrado");
        }

        const respostaBD = await EsquemaLivro.deleteOne({ _id: idLivro });
        res.status(200).json({
            status: "OK",
            statusMensagem: "Livro deletado com sucesso.",
            resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


module.exports = router;
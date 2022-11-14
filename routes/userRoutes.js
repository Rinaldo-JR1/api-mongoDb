require('dotenv').config()
const router = require('express').Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');
/*
    Cria usuario para Login na pagian
    Com suas permições
*/
router.post('/create', async (req, res) => {
    //Req.body 
    const { name, password, edit, readOnly } = req.body;
    console.log(req.body);
    if (!name) {
        res.status(422).json({ error: 'Um nome é obrigatorio' })
        return;
    }
    if (!password) {
        res.status(422).json({ error: 'Uma senha é obrigatoria' })
        return;
    }
    const user = {
        name,
        password,
        edit,
        readOnly
    }
    //Create Person
    try {
        //Criando criandoUsuario
        await User.create(user);
        res.status(201).json({ message: 'User successfully created' });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
})
/**
 * Rota de login do usuario
 * 
 * recebe em seu body name e password (nome e senha)
*/
router.post('/login', async (req, res, next) => {
    //Req.body pega os dados  em req.body 
    const { name, password } = req.body;
    // Verifica se tem algum dado em falta
    if (!name) {
        res.status(422).json({ error: 'Um nome é obrigatorio' })
        return;
    }
    if (!password) {
        res.status(422).json({ error: 'Uma senha é obrigatoria' })
        return;
    }
    // Cria o objeto user
    const user = {
        name,
        password,
    }
    try {
        //Procura no BD um dado com as 2 chaves (name e password)
        let logedUser = await User.findOne({ name: name, password: password });
        //Se não encontar ninguem ele acaba o processamento
        if (!logedUser) {
            return res.status(203).json({ error: 'Usuario ou senha invalido' })
        }
        //Chave para JWT
        const SECRET = process.env.SECRET
        let id = logedUser.id.toString();
        //Criptografa o ID do usuario
        token = jwt.sign({ id }, SECRET, {
            expiresIn: 3600 // expires in 6Hrs
        });
        //Retorna true e o token ID do usuario
        return res.json({ auth: true, id: id, token: token });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
})


/** Logout
 * Rota não usada mas exite 
 */
router.post('/logout', function (req, res, next) {
    res.json({ auth: false, token: null });
})


/**
 * Funçao que verificar se o Token JWT é real
*/
function verifyJWT(req, res, next) {
    // Recebe o SECRET
    const SECRET = process.env.SECRET
    // Verifica o token que fica no reader
    const token = req.headers['x-access-token'];
    // Se token for vazio ele para e informa que não tem token
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Token não recebido' });
    }
    // Verificar o token passado
    jwt.verify(token, SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Falha ao autentiar o token.' });
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });

}

/**Rota de autenticação 
 * Verifica o que o usuario tem direito de fazer dentro da aplicação
 */
router.get('/:id', verifyJWT, async (req, res, next) => {
    //Extrai o id pasasado na URL
    const id = req.params.id
    /* Compara se os ID são identicos
    *  Caso não ele demonstra mensagem de usuario não autenticado
    */
    if (req.userId !== id) {
        return res.status(401).json({ message: 'Usuario não autenticado' })
    }
    try {
        // Procura o usuario pelo ID informado
        let userFound = await User.findOne({ _id: id });
        if (!userFound) {
            return res.status(422).json({ messsage: 'Usuario não encontrado' });;
        }
        if (userFound.edit === true || userFound.readOnly === false) {
            return res.status(200).json({
                edit: true,
                readOnly: false,
                auth: true
            });
        } else {
            return res.status(200).json({
                edit: false,
                readOnly: true,
                auth: false
            });
        }
        // res.status(200).json(userFound);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error1: error });
    }
});
module.exports = router;
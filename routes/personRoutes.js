const router = require('express').Router();
const Person = require('../models/Person')
//Rotas da API
router.post('/', async (req, res) => {
    //Req.body 
    const { name, salary, approved } = req.body;

    if (!name) {
        res.status(422).json({ error: 'Um nome é obrigatorio' })
        return;
    }
    const person = {
        name,
        salary,
        approved
    }
    //Create Person
    try {
        //Criando dados
        await Person.create(person);
        res.status(201).json({ message: 'Pessoa criada com sucesso!' });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }

})
router.get('/all', async (req, res) => {
    try {
        const people = await Person.find()
        res.status(200).json({
            people
        })

    } catch (error) {
        res.status(500).json({ error: error });
    }
})
//Obter por ID
router.get('/:id', async (req, res) => {
    //Extrair dados da requisição -- url = Params
    const id = req.params.id
    const { name, salary, approved } = req.body

    const person = JSON.stringify({
        name,
        salary,
        approved,
    })
    try {
        let person = await Person.findOne({ _id: id });
        if (!person) {
            res.status(422).json({ messsage: 'Usuario não encontrado' });
            return "Pessoa não encontrada";
        }
        res.status(200).json(person);
    } catch (error) {

        console.log(person);
        res.status(500).json({ error: error });
    }
});

//Pesquisar por Nome
router.get('/porNome/:nome', async (req, res) => {
    //Extrair dados da requisição -- url = Params
    const id = req.params.nome;
    const { name, salary, approved } = req.body

    const person = JSON.stringify({
        name,
        salary,
        approved,
    })
    try {
        let person = await Person.findOne({ name: id });
        if (!person) {
            res.status(422).json({ messsage: 'Usuario não encontrado' });
            return "Pessoa não encontrada";
        }
        res.status(200).json(person);
    } catch (error) {

        console.log(person);
        res.status(500).json({ error: error });
    }
});
//Update - atualização de dados (PUT,PATCH)
router.patch('/:id', async (req, res) => {
    const id = req.params.id

    const { name, salary, approved } = req.body

    const person = {
        name,
        salary,
        approved,
    }
    try {
        const updatedPerson = await Person.updateOne({ _id: id }, person)

        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})
//Delete 
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    person = await Person.findOne({ _id: id })
    if (!person) {
        res.status(422).json({ messsage: 'Usuario não encontrado' });
        return;
    }
    try {
        await Person.deleteOne({ _id: id })
        res.status(200).json({ message: "Usuario removido com sucesso!" })

    } catch (error) {
        res.status(500).json({ error: error });
    }
})

module.exports = router;

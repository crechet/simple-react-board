const mongoose = require('mongoose');
const List = mongoose.model('lists');
const Card = mongoose.model('cards');

module.exports = (app) => {
    // Get all lists.
    app.get('/api/list', (req, res) => {
        List.find({})
            .populate('cards')
            .then((response) => {
                res.send(response);
            });
    });

    // Get all lists.
    app.get('/api/list/:id', (req, res) => {
        List.findOne({ _id: req.params.id })
            .populate('cards')
            .then((response) => {
                res.send(response);
            });
    });

    // Update list.
    app.put('/api/list', (req, res) => {
        let { _id, name, position } = req.body;
        let toUpdate = {};
        if (name) toUpdate.name = name;
        if (position) toUpdate.position = position;

        List.findOneAndUpdate({ _id }, toUpdate, { new: true })
            .populate('cards')
            .then((list) => {
                res.send(list);
            })
    });

    // Add new list.
    app.post('/api/list', (req, res) => {
        let { name } = req.body;
        let position;
        List.count()
            .then((count) => {
                position = count + 1;

                let list = new List({ name, position });
                list.save()
                    .then((newList) => {
                        res.send(newList);
                    });
            });
    });

    // Delete list.
    app.delete('/api/list/:id', (req, res) => {
        List.findOneAndRemove({ _id: req.params.id })
            .then((result) => {
                res.status(200).send(result);
            });
    });

    // Add new card to list.
    app.post('/api/card', (req, res) => {
        let { list, name } = req.body;
        let position;

        List.findOne({ _id: list })
            .then((list) => {
                position = list.cards.length + 1;

                let card = new Card({ name, position });
                list.cards.push(card);
                card.list = list._id;

                Promise.all([card.save(), list.save()])
                    .then((response) => {
                        // Response with created card.
                        res.send(response[0]);
                    })
            })
            .catch((error) => {
                res.send(error);
            });
    });

    // Get card.
    app.get('/api/card/:id', (req, res) => {
        let { id } = req.params;
        Card.findOne({ _id: id })
            .then((response) => {
                res.send(response);
            });
    });

    // Update card data.
    app.put('/api/card', (req, res) => {
        console.log(' *** Update card req.body', req.body);
        let { _id, name, description, position, list } = req.body;
        let toUpdate = {};
        if (name) toUpdate.name = name;
        if (description) toUpdate.description = description;
        if (position) toUpdate.position = position;
        if (list) toUpdate.list = list;

        Card.findOneAndUpdate({ _id }, toUpdate, { new: true })
            .then((response) => {
                res.send(response);
            })
    });

    // Delete card.
    app.delete('/api/card', (req, res) => {
        let { list, _id } = req.body;

        // Update list that contains card to delete.
        List.update({ _id: list }, { $pull: { cards: _id } })
            .then(() => {
                // Delete card.
                Card.findOneAndRemove({ _id })
                    .then((response) => res.send(response))
            })
            .catch((error) => res.send(error));
    });

    // Remove existed card from list.
    app.put('/api/pull/card', (req, res) => {
        let { list, _id } = req.body;

        // Update list that contains card to remove.
        List.update({ _id: list }, { $pull: { cards: _id } })
            .then(() => res.status(200).send('Ok'))
            .catch((error) => res.send(error));
    });

    // Add existed card to list.
    app.put('/api/push/card', (req, res) => {
        let { list } = req.body;

        // Update list that contains card to insert.
        List.update({ _id: list }, { $addToSet: { cards: req.body } })
            .then(() => res.status(200).send('Ok'))
            .catch((error) => res.send(error));
    });
};
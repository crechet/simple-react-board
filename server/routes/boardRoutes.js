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
    app.delete('/api/card/:list/:_id', (req, res) => {
        let { list, _id } = req.params;

        // Update list that contains card to delete.
        List.findOneAndUpdate({ _id: list }, { $pull: { cards: _id } }, { new: true })
            .populate('cards')
            .then((updatedList) => {
                // Delete card.
                Card.findOneAndRemove({ _id })
                    .then(() => res.send(updatedList))
            })
            .catch((error) => res.send(error));
    });

    // Remove existed card from list.
    app.put('/api/pull/card', (req, res) => {
        let { list, _id } = req.body;

        // Update list that contains card to remove. Remove card from list.
        List.findOneAndUpdate({ _id: list }, { $pull: { cards: _id } }, { new: true })
            .populate('cards')
            .then((updatedList) => {
                // If we pass recalculatePositions flag, it means that card was removed from list.
                // And remaining cards positions must be recalculated.
                if (req.body.recalculatePositions) {
                    let promises = [];
                    updatedList.cards.forEach((card, i) => {
                        card.position = i + 1;
                        promises.push(Card.update({ _id: card._id }, { $set: { position: i + 1 }}));
                    });

                    Promise.all(promises)
                        .then(() => {
                            res.status(200).send(updatedList);
                        });
                } else {
                    res.status(200).send(updatedList);
                }
            })
            .catch((error) => res.send(error));
    });

    // Add existed card to list.
    app.put('/api/push/card', (req, res) => {
        let { list } = req.body;

        // Update list that contains card to insert.
        List.findOneAndUpdate({ _id: list }, { $addToSet: { cards: req.body } }, { new: true })
            .populate('cards')
            .then((updatedList) => res.status(200).send(updatedList))
            .catch((error) => res.send(error));
    });
};
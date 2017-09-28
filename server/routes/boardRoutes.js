const mongoose = require('mongoose');
const List = mongoose.model('lists');

module.exports = (app) => {
    // Get all lists.
    app.get('/api/list', (req, res) => {
        List.find({})
            .then((response) => {
                res.send(response);
            });
    });

    // Update list.
    app.post('/api/list/:id', (req, res) => {
        let { _id, name, position } = req.body;
        List.findOneAndUpdate({ _id }, { name, position })
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
        console.log('req', req.params);
        List.findOneAndRemove({ _id: req.params.id })
            .then((result) => {
                res.status(200).send(result);
            });
    });
};
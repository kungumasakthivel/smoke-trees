const express = require('express');
const db = require('../database');

const routes = express.Router();



routes.post('/register', (req, res) => {
    const {name, address} = req.body;

    db.get('SELECT COUNT(*), id FROM user WHERE name = ?', [name], (err, row) => {
        if(err) {
            return res.status(400).json({
                message: "Error"
            });
        }
        if(row['COUNT(*)'] > 0) {
            db.run(
                'INSERT INTO address (address, user_id) VALUES (?, ?)',
                [address, row['id']],
                function(err) {
                    if(err) {
                        return res.status(400).json({
                            message: "Err: user exist but new address not added",
                            status: 0
                        });
                    }
                    res.status(200).json({
                        message: "new address added with existing user",
                        status: 1
                    });
                }
            )
        } else {
            db.serialize(() => {

                db.run(
                    'INSERT INTO user (name) VALUES (?)',
                    [name],
                    function(err) {
                        if(err) {
                            return res.status(400).json({
                                message: "Err: user not created",
                                status: 0
                            });
                        }
                    }
                );

                db.get(
                    'SELECT COUNT(*), id FROM user WHERE name = ?',
                    [name],
                    (err, row) => {
                        if(err) {
                            return res.status(400).json({
                                message: "Err: user not found after inserting new user",
                                status: 0
                            });
                        }
                        if(row['COUNT(*)'] > 0) {
                            db.run(
                                'INSERT INTO address (address, user_id) VALUES (?, ?)',
                                [address, row['id']],
                                function(err) {
                                    if(err) {
                                        return res.status(400).json({
                                            message: 'Err: error after new user and address not inserted',
                                            status: 0
                                        });
                                    }
                                    return res.status(200).json({
                                        message: 'Successfully created new user and address',
                                        status: 1
                                    });
                                }
                            )
                        }
                    }
                )
            })
        }
    })
});

routes.get('/register', (req, res) => {
    db.all(
        'SELECT u.id, u.name, a.address, a.user_id FROM user u JOIN address a ON u.id = a.user_id',
        (err, rows) => {
            if(err) {
                return res.status(400).json({
                    message: "error getting address",
                    status: 0
                });
            }
            if(!rows) {
                return res.status(400).json({
                    message: "empty user and address",
                    status: 0
                });
            }
            res.json({
                "data": rows
            });
        }
    )
});

module.exports = routes;

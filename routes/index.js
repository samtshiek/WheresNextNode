const express = require('express');
const router = express.Router();

userArray = [
    {id: 1, name: 'userA'},
    {id: 2, name: 'userB'},
    {id: 3, name: 'userC'},
    {id: 4, name: 'userD'},
    {id: 5, name: 'userE'},
    {id: 6, name: 'userF'},
    {id: 7, name: 'userG'},
    {id: 8, name: 'userH'}
];


router.get('/users', function(req, res) {
    console.log(userArray);
    res.status(200).json(userArray);
})

module.exports = router;
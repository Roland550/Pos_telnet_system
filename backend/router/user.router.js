
const express = require("express");
const { signup, signin, getUsers, deleteUser, signout, updateUser } = require("../controller/user.controller.js");
const verifyUser = require("../utils/verifyUser.js");

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/delete',verifyUser, deleteUser)
router.put('/update/:editId/:userId', verifyUser, updateUser)
router.post('/signout', signout)
router.get('/getUsers', verifyUser, getUsers)

module.exports = router
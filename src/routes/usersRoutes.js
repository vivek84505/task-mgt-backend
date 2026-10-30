const express = require("express")


const {getUsers,getUserById,createUser,updateUser,deleteUser} = require("../controllers/usersController")

const router = express.Router()

router.get("/",getUsers)
router.get("/:userid",getUserById)
router.post("/",createUser)
router.put("/:userid",updateUser)
router.delete("/:userid",deleteUser)

module.exports = router
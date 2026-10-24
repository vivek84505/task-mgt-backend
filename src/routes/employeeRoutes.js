const express = require("express")

const { getEmployees, getEmployeesById, createEmployee,updateEmployee,patchEmployee, deleteEmployee } = require("../controllers/employeeController")

const router = express.Router()

router.get("/",getEmployees);
router.get("/:id",getEmployeesById)
router.post("/",createEmployee)
router.put("/:id",updateEmployee)
router.patch("/:id",patchEmployee)
router.delete("/:id",deleteEmployee)
module.exports = router


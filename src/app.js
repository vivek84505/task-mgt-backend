const express = require("express");
const cors = require("cors");

require("dotenv").config();

const employeeRoutes = require("./routes/employeeRoutes");
const userRoutes = require("./routes/usersRoutes")



const app = express();

const PORT = process.env.PORT || 8000;

// CORS
app.use(cors());

// JSON middleware
app.use(express.json());

// Employee routes
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Employee API is now Running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
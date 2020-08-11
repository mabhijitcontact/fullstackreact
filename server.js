const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
// call db connection from config
const connectDB = require("./config/db");

//connect to Altas DB
connectDB();

//init Middleware
app.use(express.json({ extended: false }));

//Define Routes and Main routes to access root
// domain.com/
// domain.com/api/{routename}
app.get('/', (req, res) => {
    res.send("API is running");
});

app.use("/api/users", require('./routes/api/users'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/posts", require('./routes/api/posts'));

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
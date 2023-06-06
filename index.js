require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const dashboard = require('./routes/dashboardRoutes')
const port = process.env.PORT;

app.use(routes);
app.use(dashboard);
app.use(express.static(__dirname + '/public'))
app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
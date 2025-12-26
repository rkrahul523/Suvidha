//Install express server
const express = require('express');
const path = require('path');

const app = express();
 
// Serve only the static files form the dist directory
// Replace the static line with:
app.use(express.static('./dist/SuvidhaApp'));
app.get('/', (req, res) => {
    console.log('Registering route1:', '/your/path/here');
    res.sendFile(path.join(__dirname, 'dist/SuvidhaApp/server/index.server.html'));
});
 
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
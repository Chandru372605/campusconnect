const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { setupSockets } = require('./sockets');
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const server = http.createServer(app);
        setupSockets(server);
        server.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.error('DB connection failed:', err));
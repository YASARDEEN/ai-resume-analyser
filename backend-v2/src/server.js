const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.env} mode on http://localhost:${PORT}`);
});

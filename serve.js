const path = require('path')
const express = require('express')
const app = express()

const port = 5000
const baseUrl = process.env.BASE_URL || '/'

app.use(baseUrl, express.static(path.join(__dirname, 'dist')))

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Produc-dev listening on port ${port}!`))

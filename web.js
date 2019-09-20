const path = require('path')
const express = require('express')
const app = express()

const port = 5000
const baseUrl = process.env.BASE_URL || '/'

app.use(baseUrl, express.static(path.join(__dirname, 'dist-web')))

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Serving Produc-dev at http://localhost:${port}${baseUrl}`))

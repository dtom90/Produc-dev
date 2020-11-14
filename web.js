const path = require('path')
const express = require('express')
const app = express()

const port = 5000
const baseUrl = process.env.BASE_URL || '/'
const staticDir = 'dist_web'

app.use(baseUrl, express.static(path.join(__dirname, staticDir)))

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Serving DevTrack at http://localhost:${port}${baseUrl}`))

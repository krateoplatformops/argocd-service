const express = require('express')
const router = express.Router()
const axios = require('axios')
const uriHelpers = require('../service-library/helpers/uri.helpers')
const argocdHelpers = require('../helpers/argocd.helpers')
const secretHelpers = require('../service-library/helpers/secret.helpers')

router.get('/:endpoint/:name', async (req, res, next) => {
  try {
    const endpoint = (await secretHelpers.getEndpoint(req.params.endpoint)).data

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${endpoint.bearer}`
      }
    }

    let content = null
    if (req.query.name) {
      const url = new URL(
        uriHelpers.concatUrl([endpoint.target, req.params.name, 'resource'])
      )
      Object.keys(req.query).forEach((key) =>
        url.searchParams.append(key, req.query[key])
      )
      content = (await axios.get(url.toString(), headers)).data
    } else {
      const tree = await axios.get(
        uriHelpers.concatUrl([endpoint.target, req.params.name]),
        headers
      )
      content = argocdHelpers.nodeEdges(tree.data, req.params.name)
    }

    if (!content) {
      res.status(500).json({ message: 'No content' })
    }

    return res.status(200).json(content)
  } catch (error) {
    next(error)
  }
})

module.exports = router

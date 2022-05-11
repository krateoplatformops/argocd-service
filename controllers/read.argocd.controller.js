const express = require('express')
const router = express.Router()
const axios = require('axios')
const uriHelpers = require('../helpers/uri.helpers')
const argocdHelpers = require('../helpers/argocd.helpers')
const stringHelpers = require('../helpers/string.helpers')

router.get('/:endpoint/:name', async (req, res, next) => {
  try {
    console.log(stringHelpers.b64toAscii(req.params.endpoint))
    const endpoint = JSON.parse(stringHelpers.b64toAscii(req.params.endpoint))
    let content = null

    const bearer = endpoint.secret.find((x) => x.key === 'bearer')

    if (req.query['name']) {
      let url = new URL(
        uriHelpers.concatUrl([endpoint.target, req.params.name, 'resource'])
      )
      Object.keys(req.query).forEach((key) =>
        url.searchParams.append(key, req.query[key])
      )
      content = (
        await axios.get(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer.val}`
          }
        })
      ).data
    } else {
      const tree = await axios.get(
        uriHelpers.concatUrl([
          endpoint.target,
          req.params.name,
          'resource-tree'
        ]),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer.val}`
          }
        }
      )
      content = argocdHelpers.nodeEdges(tree.data, req.params.name)
    }

    return res.status(200).json(content)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router

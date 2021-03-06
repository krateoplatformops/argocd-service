const { logger } = require('../helpers/logger.helpers')
const { pathConstants } = require('../constants')

module.exports = (req, res, next) => {
  if (pathConstants.nologPaths.includes(req.path)) {
    next()
    return
  }

  if (Object.keys(req.body).length > 0) {
    logger.debug(JSON.stringify(req.body))
  }
  if (Object.keys(req.params).length > 0) {
    logger.debug(JSON.stringify(req.params))
  }
  if (Object.keys(req.query).length > 0) {
    logger.debug(JSON.stringify(req.query))
  }

  next()
}

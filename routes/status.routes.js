const express = require('express')
const router = express.Router()

router.get('/ping', (req, res) => {
  res.status(200).send('ArgoCD Service')
})

router.get('/healthz', (req, res) => {
  res.status(200).send('ArgoCD Service')
})

module.exports = router

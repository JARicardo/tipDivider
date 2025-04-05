class ApiController {

  index (req, res) {
    res.status(200).json({ message: 'Hello from Express backend! 🎉' })
  }
}

  module.exports = new ApiController()
  
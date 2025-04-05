import { Request, Response } from 'express'

export default class ApiController {

  index (req: Request, res: Response) {
    res.status(200).json({ message: 'Hello from Express backend! 🎉' })
  }
}
  
export const apiController = new ApiController();
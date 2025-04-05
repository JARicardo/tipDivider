import express from 'express'
import { apiController } from '../controllers/apiController'
import { transactionController } from '../controllers/transactionsController'
import { Request, Response } from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => { apiController.index(req, res) })
router.get('/payments', (req: Request, res: Response) => { transactionController.getAllPayments(req, res) })
router.get('/payment-methods', (req: Request, res: Response) => { transactionController.getPaymentMethods(req, res) })

router.post('/tips', (req: Request, res: Response) => { transactionController.saveTip(req, res) })
router.post('/payments', (req: Request, res: Response) => { transactionController.savePayment(req, res) })

export default router;

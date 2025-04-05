import connection from '../database/config'
import { Request, Response } from 'express'

export default class TransactionController {
    async getAllPayments(req: Request, res: Response) {
        try {
            const result = await connection.query('SELECT id, payment_method_id, amount FROM tips.payment_transactions')
            const transactions = result.rows
            res.status(200).json(transactions)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Payments', error })
        }
    }

    async saveTip(req: Request, res: Response) {
        const { total_amount, notes } = req.body
        try {
            const result = await connection.query(
                'INSERT INTO tips.tips (total_amount, notes) VALUES ($1, $2) RETURNING id',
                [total_amount, notes]
            )
            const newTip = result.rows[0]
            res.status(201).json(newTip)
        } catch (error) {
            res.status(500).json({ message: 'Error saving Tip', error })
        }
    }

    async savePayment(req: Request, res: Response) {
        const { tip_id, payment_method_id, amount, receipt_number } = req.body
        try {
            const result = await connection.query(
                'INSERT INTO tips.payment_transactions (tip_id, payment_method_id, amount, receipt_number) VALUES ($1, $2, $3, $4) RETURNING *',
                [tip_id, payment_method_id, amount, receipt_number]
            )
            const newTransaction = result.rows[0]
            res.status(201).json(newTransaction)
        } catch (error) {
            res.status(500).json({ message: 'Error saving Payment', error })
        }
    }

    async getPaymentMethods(req: Request, res: Response) {
        try {
            const result = await connection.query('SELECT id, name FROM tips.payment_methods')
            const paymentMethods = result.rows
            res.status(200).json(paymentMethods)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Payment Methods', error })
        }
    }
}

export const transactionController = new TransactionController();
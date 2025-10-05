import express from 'express'
import { deleteTransactions, getTransactionsByUserID, getTransactionsSummary, postTransactions } from '../Controllers/TransactionsControllers.js';

const router = express.Router()

router.post("/", postTransactions);

router.get("/:user_ID", getTransactionsByUserID);

router.delete("/:id", deleteTransactions);

router.get("/summary/:user_ID", getTransactionsSummary);

export default router
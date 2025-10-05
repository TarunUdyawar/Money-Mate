import { sql } from "../Config/Database.js";

export const postTransactions = async (req, res) => {
  try {
    const { user_ID, title, category, amount } = req.body;
    if (!user_ID || !title || !category || !amount) {
      return res.status(400).json({ message: "Fill all Details" });
    }
    const transactions =
      await sql`INSERT INTO transactions(user_ID,title,category,amount)
    VALUES(${user_ID}, ${title}, ${category}, ${amount})
    RETURNING *
    `;
    return res
      .status(200)
      .json({ message: "Transaction Created Successfully" });
    console.log(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getTransactionsByUserID = async (req, res) => {
  const { user_ID } = req.params;
  try {
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_ID = ${user_ID}
    `;
    if (transactions.length == 0) {
      return res.status(400).json({ message: "Transaction Not Found" });
    }
    console.log(transactions);
    return res.status(200).json({ message: "Transaction Found",transactions });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deleteTransactions = async (req, res) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid Transaction" });
  }
  try {
    const transactions = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
    console.log(transactions);
    return res.status(201).json({ message: "Transaction Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getTransactionsSummary = async (req, res) => {
  try {
  const { user_ID } = req.params;
    const balanceResult = await sql`
  SELECT COALESCE(SUM(amount),0) as balance FROM transactions where user_ID = ${user_ID}
  `;
    const incomeResult = await sql`
  SELECT COALESCE(SUM(amount),0) as income FROM transactions where user_ID = ${user_ID} AND amount > 0
  `;
    const expenseResult = await sql`
  SELECT COALESCE(SUM(amount),0) as expense FROM transactions where user_ID = ${user_ID} AND amount < 0
  `;
    return res.status(201).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
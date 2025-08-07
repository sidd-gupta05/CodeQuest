// pages/api/create-razorpay-order.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set content type first
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      receipt: req.body.receipt,
      notes: req.body.notes,
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      details: error.error?.description || error.message,
    });
  }
}

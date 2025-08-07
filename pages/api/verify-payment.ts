import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Here you would typically save to your database
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
}

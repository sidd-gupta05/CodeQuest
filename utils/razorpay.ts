export const initializeRazorpayPayment = async (amount: number) => {
  try {
    // Create order
    const response = await fetch('/api/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: 'receipt_' + Date.now(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create order');
    }

    // Initialize Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Labsphere',
      description: 'Payment for medical services',
      order_id: data.id,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        // Handle successful payment here
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#0D9488',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    return paymentObject;
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};

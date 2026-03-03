export const handler = async (event: any) => {
    console.log('Processing payment:', event);

    const { orderId, totalAmount } = event;

    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.2; // 80% success rate

    return {
        ...event,
        paymentSuccess,
        paymentId: paymentSuccess ? `PAY-${Date.now()}` : null,
        paymentTimestamp: new Date().toISOString(),
    };
};

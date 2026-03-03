export const handler = async (event: any) => {
    console.log('Fulfilling order:', event);

    const { orderId, paymentId } = event;

    return {
        ...event,
        fulfillmentStatus: 'COMPLETED',
        trackingNumber: `TRK-${Date.now()}`,
        fulfillmentTimestamp: new Date().toISOString(),
    };
};

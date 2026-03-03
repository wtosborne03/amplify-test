export const handler = async (event: any) => {
    console.log('Handling order failure:', event);

    const { orderId } = event;

    return {
        ...event,
        status: 'FAILED',
        failureHandledAt: new Date().toISOString(),
        refundInitiated: true,
    };
};

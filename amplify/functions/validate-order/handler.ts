export const handler = async (event: any) => {
    console.log('Validating order:', event);

    const { orderId, items, totalAmount } = event;

    // Simulate validation logic
    const isValid = items && items.length > 0 && totalAmount > 0;

    return {
        orderId,
        items,
        totalAmount,
        isValid,
        validationTimestamp: new Date().toISOString(),
    };
};

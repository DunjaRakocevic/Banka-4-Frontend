// src/api/endpoints/payments.js
import api from '../client';

export const paymentsApi = {

    // ACCOUNTS (reuse isto kao transfers)
    getMyAccounts: () =>
        api.get('/client/accounts'),

    // RECIPIENTS
    getRecipients: () =>
        api.get('/client/recipients'),

    createRecipient: (data) =>
        api.post('/client/recipients', data),
    // { name, account }

    updateRecipient: (id, data) =>
        api.put(`/client/recipients/${id}`, data),

    deleteRecipient: (id) =>
        api.delete(`/client/recipients/${id}`),

    // PAYMENTS
    createPayment: (data) =>
        api.post('/client/payments', data),
    /*
    {
      fromAccountId,
      recipientName,
      recipientAccount,
      amount,
      paymentCode,
      referenceNumber,
      purpose
    }
    */

    // HISTORY (ako budeš dodavao kasnije)
    getPayments: () =>
        api.get('/client/payments'),
};
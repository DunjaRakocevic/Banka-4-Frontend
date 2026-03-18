// src/features/payments/NewPayment.jsx
import React, { useState } from 'react';
import { paymentsApi } from '../api/endpoints/payments.js';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import PaymentForm from '../features/payments/NewPaymentForm';

export default function NewPayment() {
    const { data: accountsRes, loading: loadingAccounts, error: accountsError } = useFetch(() => paymentsApi.getMyAccounts());
    const { data: recipientsRes, loading: loadingRecipients, error: recipientsError } = useFetch(() => paymentsApi.getRecipients());

    const [alert, setAlert] = useState(null);

    const handleSubmit = async (formData) => {
        try {
            await paymentsApi.createPayment(formData);
            setAlert({ type: 'success', message: 'Uplata uspešno izvršena!' });
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Greška pri uplati' });
        }
    };

    if (loadingAccounts || loadingRecipients) return <Spinner />;
    if (accountsError || recipientsError) return <Alert type="error" message="Greška pri učitavanju podataka" />;

    return (
        <div className="new-payment-page">
            {alert && <Alert type={alert.type} message={alert.message} />}
            <h1 className="centered">Nova uplata</h1>
            <PaymentForm
                accounts={accountsRes?.data ?? []}
                recipients={recipientsRes?.data ?? []}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
// src/features/payments/PaymentsOverview.jsx
import React, { useState } from 'react';
import { paymentsApi } from '../api/endpoints/payments';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function PaymentsOverview() {
    const { data: payments, loading, error} = useFetch(() => paymentsApi.getPayments());
    const [alert] = useState(null);

    if (loading) return <Spinner />;
    if (error) return <Alert type="error" message="Greška pri učitavanju uplata" />;

    return (
        <div className="payments-overview-page">
            {alert && <Alert type={alert.type} message={alert.message} />}
            <h1>Pregled uplata</h1>
            <table>
                <thead>
                <tr>
                    <th>Datum</th>
                    <th>Sa računa</th>
                    <th>Primaoc</th>
                    <th>Iznos</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {payments?.data?.map(p => (
                    <tr key={p.id}>
                        <td>{new Date(p.date).toLocaleString()}</td>
                        <td>{p.fromAccountNumber}</td>
                        <td>{p.recipientName}</td>
                        <td>{p.amount} {p.currency ?? ''}</td>
                        <td>{p.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
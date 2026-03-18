// src/features/payments/Recipients.jsx
import React, { useState } from 'react';
import { paymentsApi } from '../api/endpoints/payments';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function Recipients() {
    const { data: recipients, loading, error, refetch } = useFetch(() => paymentsApi.getRecipients());
    const [alert, setAlert] = useState(null);

    const handleDelete = async (id) => {
        try {
            await paymentsApi.deleteRecipient(id);
            setAlert({ type: 'success', message: 'Primalac obrisan' });
            refetch();
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Greška pri brisanju' });
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert type="error" message="Greška pri učitavanju primalaca" />;

    return (
        <div className="recipients-page">
            {alert && <Alert type={alert.type} message={alert.message} />}
            <h1>Primalaci</h1>
            <table>
                <thead>
                <tr>
                    <th>Ime</th>
                    <th>Račun</th>
                    <th>Akcije</th>
                </tr>
                </thead>
                <tbody>
                {recipients?.data?.map(r => (
                    <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.account}</td>
                        <td>
                            <button onClick={() => handleDelete(r.id)}>Obriši</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
// src/features/payments/RecipientForm.jsx
import { useState, useEffect } from 'react';
import Alert from '../../components/ui/Alert';
import styles from '../transfers/transfers.module.css';

export default function RecipientForm({
                                          initialData = { name: '', account: '' },
                                          onSubmit,
                                          onCancel,
                                          submitLabel = 'Save'
                                      }) {

    const [form, setForm] = useState(initialData);
    const [error, setError] = useState(null);

    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    // VALIDACIJA
    const isAccountValid = /^\d{18}$/.test(form.account);

    const handleSubmit = () => {
        setError(null);

        if (form.name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }

        if (!isAccountValid) {
            setError('Account must contain exactly 18 digits.');
            return;
        }

        onSubmit(form);
    };

    return (
        <div>

            {/* NAME */}
            <div className={styles.field}>
                <label>Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={e =>
                        setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Recipient name"
                />
            </div>

            {/* ACCOUNT */}
            <div className={styles.field}>
                <label>Account</label>
                <input
                    type="text"
                    value={form.account}
                    onChange={e =>
                        setForm({ ...form, account: e.target.value })
                    }
                    placeholder="18-digit account number"
                />
                {!isAccountValid && form.account && (
                    <small style={{ color: 'red' }}>
                        Must contain exactly 18 digits
                    </small>
                )}
            </div>

            {/* ERROR */}
            {error && <Alert tip="greska" poruka={error} />}

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                    className={styles.btnSecondary}
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className={styles.btnPrimary}
                    onClick={handleSubmit}
                >
                    {submitLabel}
                </button>
            </div>

        </div>
    );
}
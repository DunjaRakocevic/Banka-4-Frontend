// src/features/payments/RecipientsList.jsx
import { useState } from 'react';
import Alert from '../../components/ui/Alert';
import styles from '../transfers/transfers.module.css';
import RecipientForm from './RecipientForm';

export default function RecipientsList() {

    const [recipients, setRecipients] = useState([
        // mock (možeš obrisati kad spojiš API)
        { id: 1, name: 'Elektrodistribucija', account: '160000000000000001' },
        { id: 2, name: 'Infostan', account: '160000000000000002' },
    ]);

    const [form, setForm] = useState({
        id: null,
        name: '',
        account: '',
    });

    const [open, setOpen] = useState(false);
    const [ setError] = useState(null);

    const isEdit = form.id !== null;

    // VALIDACIJA
    const isAccountValid = /^\d{18}$/.test(form.account);

    // OPEN MODAL (ADD)
    const handleAdd = () => {
        setForm({ id: null, name: '', account: '' });
        setError(null);
        setOpen(true);
    };

    // OPEN MODAL (EDIT)
    const handleEdit = (r) => {
        setForm(r);
        setError(null);
        setOpen(true);
    };

    // DELETE
    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setRecipients(prev => prev.filter(r => r.id !== id));
        }
    };

    // SAVE (ADD / EDIT)
    const handleSave = () => {
        setError(null);

        if (form.name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }

        if (!isAccountValid) {
            setError('Account must have exactly 18 digits.');
            return;
        }

        if (isEdit) {
            setRecipients(prev =>
                prev.map(r => (r.id === form.id ? form : r))
            );
        } else {
            setRecipients(prev => [
                ...prev,
                { ...form, id: Date.now() },
            ]);
        }

        setOpen(false);
    };

    return (
        <div className={styles.stranica}>
            <main className={styles.sadrzaj}>

                <div>
                    <div className={styles.breadcrumb}>
                        Payments › Recipients
                    </div>

                    <h1 className={styles.pageTitle}>
                        Recipients
                    </h1>

                    <p className={styles.pageDesc}>
                        Manage saved payment recipients
                    </p>
                </div>

                <div className={`page-anim ${styles.card}`}>

                    {/* ADD BUTTON */}
                    <button
                        className={styles.btnPrimary}
                        onClick={handleAdd}
                        style={{ marginBottom: '15px' }}
                    >
                        + Add Recipient
                    </button>

                    {/* TABLE */}
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {recipients.map(r => (
                            <tr key={r.id}>
                                <td>{r.name}</td>
                                <td>{r.account}</td>
                                <td>
                                    <button
                                        className={styles.btnSecondary}
                                        onClick={() => handleEdit(r)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={styles.btnDanger}
                                        onClick={() => handleDelete(r.id)}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {recipients.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>
                                    No recipients yet
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {open && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>

                            <h2>
                                {isEdit ? 'Edit Recipient' : 'New Recipient'}
                            </h2>

                            <RecipientForm
                                initialData={form}
                                onCancel={() => setOpen(false)}
                                onSubmit={(data) => {
                                    if (isEdit) {
                                        setRecipients(prev =>
                                            prev.map(r => r.id === form.id ? { ...data, id: form.id } : r)
                                        );
                                    } else {
                                        setRecipients(prev => [
                                            ...prev,
                                            { ...data, id: Date.now() }
                                        ]);
                                    }
                                    setOpen(false);
                                }}
                                submitLabel={isEdit ? 'Update' : 'Create'}
                            />

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
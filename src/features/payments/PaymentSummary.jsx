// src/features/payments/PaymentSummary.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './payment-summary.module.css';
import { paymentsApi } from '../../api/endpoints/payments';

export default function PaymentSummary() {
    const { state } = useLocation();
    const navigate = useNavigate();

// 👇 OVO IDE ODMAH
    const {
        fromAccount,
        recipientName,
        recipientAccount,
        amount,
        paymentCode,
        referenceNumber,
        purpose,
    } = state || {}; // ✅ fallback da ne pukne

// 👇 svi useState
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    const [recipients, setRecipients] = useState([]);
    const [isExistingRecipient, setIsExistingRecipient] = useState(false);

// 👇 svi useEffect
    useEffect(() => {
        if (!state) {
            navigate('/payments/new');
        }
    }, [state, navigate]);

    useEffect(() => {
        if (!recipientAccount) return; // ✅ zaštita

        const fetchRecipients = async () => {
            try {
                const res = await paymentsApi.getRecipients();
                setRecipients(res.data);

                const exists = res.data.some(
                    (r) => r.account === recipientAccount
                );

                setIsExistingRecipient(exists);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipients();
    }, [recipientAccount]);

// 👇 TEK SAD return guard
    if (!state) return null;

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e, index) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .trim()
            .replace(/\D/g, '')
            .slice(0, 4 - index);

        if (!pasted) return;

        const newOtp = [...otp];
        for (let i = 0; i < pasted.length && index + i < 4; i++) {
            newOtp[index + i] = pasted[i];
        }

        setOtp(newOtp);

        const next = Math.min(index + pasted.length, 3);
        inputRefs.current[next]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleConfirm = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 4) {
            setError('Unesite kompletan kod od 4 cifre.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await paymentsApi.createPayment({
                fromAccountId: fromAccount.id,
                recipientName,
                recipientAccount,
                amount,
                paymentCode,
                referenceNumber,
                purpose,
                otpCode,
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                'Plaćanje nije uspelo. Proverite kod i pokušajte ponovo.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ✅ dodavanje primaoca
    const handleAddRecipient = async () => {
        try {
            await paymentsApi.createRecipient({
                name: recipientName,
                account: recipientAccount,
            });

            setIsExistingRecipient(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResend = () => {
        alert('Kod je ponovo poslat (mock).');
    };
    return (
        <div className={styles.stranica}>
            <main className={styles.sadrzaj}>
                {success ? (
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>✅</div>

                        <h2>Plaćanje je uspešno izvršeno!</h2>
                        <p>Transakcija je prosleđena banci na obradu.</p>

                        {!isExistingRecipient && (
                            <div className={styles.saveRecipientBox}>
                                <h4>Sačuvaj primaoca?</h4>
                                <p>
                                    {recipientName} nije u vašoj listi primalaca. Dodajte ga za brže
                                    buduće uplate.
                                </p>

                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleAddRecipient}
                                >
                                    + Dodaj primaoca
                                </button>
                            </div>
                        )}

                        <div className={styles.actions}>
                            <button
                                className={styles.btnSecondary}
                                onClick={() => navigate('/payments/new')}
                            >
                                Novo plaćanje
                            </button>

                            <button className={styles.btnGhost}>Odštampaj potvrdu</button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.confirmCard}>
                        <h1>Potvrda plaćanja</h1>

                        {/* Upozorenje – ostaje isto ili možeš pojačati stil */}
                        <div className={styles.warning}>
                            <span className={styles.warningIcon}>ℹ️</span>
                            <p>
                                Proverite podatke. Nakon potvrde transakcija se ne može opozvati.
                            </p>
                        </div>

                        {/* ──────────────── NOVI SUMMARY ──────────────── */}
                        <div className={styles.summary}>
                            <div className={styles.row}>
                                <div className={styles.label}>NAZIV PRIMAOCA</div>
                                <div className={styles.value}>{recipientName || '—'}</div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>RAČUN PRIMAOCA</div>
                                <div className={`${styles.value} ${styles.mono}`}>
                                    {recipientAccount || '—'}
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>SA RAČUNA</div>
                                <div className={`${styles.value} ${styles.mono}`}>
                                    {fromAccount?.number || fromAccount?.id || '—'}
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>IZNOS</div>
                                <div className={styles.amount}>
                                    {Number(amount || 0).toLocaleString('sr-RS', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{' '}
                                    RSD
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>ŠIFRA PLAĆANJA</div>
                                <div className={styles.value}>{paymentCode || '—'}</div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>POZIV NA BROJ</div>
                                <div className={`${styles.value} ${styles.mono}`}>
                                    {referenceNumber || '—'}
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.label}>SVRHA PLAĆANJA</div>
                                <div className={styles.value}>{purpose || '—'}</div>
                            </div>
                        </div>
                        {/* ─────────────────────────────────────────────── */}

                        <div className={styles.otpSection}>
                            <p>Unesite SMS kod:</p>

                            <div className={styles.otpInputs}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onPaste={(e) => handleOtpPaste(e, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        ref={(el) => (inputRefs.current[i] = el)}
                                        className={styles.otpInput}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleResend}
                                className={styles.resend}
                            >
                                Pošalji ponovo
                            </button>
                        </div>

                        {error && <Alert tip="greska" poruka={error} />}

                        <div className={styles.actions}>
                            <button
                                className={styles.btnPrimary}
                                onClick={handleConfirm}
                                disabled={loading || otp.join('').length !== 4}
                            >
                                {loading ? (
                                    <>
                                        <Spinner small inline /> Proveravam...
                                    </>
                                ) : (
                                    'Potvrdi plaćanje'
                                )}
                            </button>

                            <button
                                className={styles.btnSecondary}
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Nazad
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
    // return (
    //     <div className={styles.stranica}>
    //         <main className={styles.sadrzaj}>
    //             {success ? (
    //                 <div className={styles.successCard}>
    //                     <div className={styles.successIcon}>✅</div>
    //
    //                     <h2>Plaćanje je uspešno izvršeno!</h2>
    //                     <p>Transakcija je prosleđena banci na obradu.</p>
    //
    //                     {/* ✅ SAMO AKO NIJE POSTOJAO */}
    //                     {!isExistingRecipient && (
    //                         <div className={styles.saveRecipientBox}>
    //                             <h4>Sačuvaj primaoca?</h4>
    //                             <p>
    //                                 {recipientName} nije u vašoj listi primalaca.
    //                                 Dodajte ga za brže buduće uplate.
    //                             </p>
    //
    //                             <button
    //                                 className={styles.btnPrimary}
    //                                 onClick={handleAddRecipient}
    //                             >
    //                                 + Dodaj primaoca
    //                             </button>
    //                         </div>
    //                     )}
    //
    //                     <div className={styles.actions}>
    //                         <button
    //                             className={styles.btnSecondary}
    //                             onClick={() => navigate('/payments/new')}
    //                         >
    //                             Novo plaćanje
    //                         </button>
    //
    //                         <button className={styles.btnGhost}>
    //                             Odštampaj potvrdu
    //                         </button>
    //                     </div>
    //                 </div>
    //             ) : (
    //                 <div className={styles.confirmCard}>
    //                     <h1>Potvrda plaćanja</h1>
    //
    //                     <div className={styles.summaryGrid}>
    //                         <div>
    //                             <strong>Primalac:</strong> {recipientName}
    //                         </div>
    //                         <div>
    //                             <strong>Račun:</strong> {recipientAccount}
    //                         </div>
    //                         <div>
    //                             <strong>Iznos:</strong>{' '}
    //                             {Number(amount).toLocaleString('sr-RS', {
    //                                 minimumFractionDigits: 2,
    //                             })}{' '}
    //                             RSD
    //                         </div>
    //                     </div>
    //
    //                     <div className={styles.otpSection}>
    //                         <p>Unesite SMS kod:</p>
    //
    //                         <div className={styles.otpInputs}>
    //                             {otp.map((digit, i) => (
    //                                 <input
    //                                     key={i}
    //                                     type="text"
    //                                     maxLength={1}
    //                                     value={digit}
    //                                     onChange={(e) =>
    //                                         handleOtpChange(i, e.target.value)
    //                                     }
    //                                     onPaste={(e) => handleOtpPaste(e, i)}
    //                                     onKeyDown={(e) =>
    //                                         handleKeyDown(e, i)
    //                                     }
    //                                     ref={(el) =>
    //                                         (inputRefs.current[i] = el)
    //                                     }
    //                                     className={styles.otpInput}
    //                                 />
    //                             ))}
    //                         </div>
    //
    //                         <button
    //                             type="button"
    //                             onClick={handleResend}
    //                             className={styles.resend}
    //                         >
    //                             Pošalji ponovo
    //                         </button>
    //                     </div>
    //
    //                     {error && <Alert tip="greska" poruka={error} />}
    //
    //                     <div className={styles.actions}>
    //                         <button
    //                             className={styles.btnPrimary}
    //                             onClick={handleConfirm}
    //                             disabled={
    //                                 loading || otp.join('').length !== 4
    //                             }
    //                         >
    //                             {loading ? (
    //                                 <>
    //                                     <Spinner small inline /> Proveravam...
    //                                 </>
    //                             ) : (
    //                                 'Potvrdi plaćanje'
    //                             )}
    //                         </button>
    //
    //                         <button
    //                             className={styles.btnSecondary}
    //                             onClick={() => navigate(-1)}
    //                             disabled={loading}
    //                         >
    //                             Nazad
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //         </main>
    //     </div>
    // );
}// // src/features/payments/PaymentSummary.jsx
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useRef } from 'react';
// import Spinner from '../../components/ui/Spinner';
// import Alert from '../../components/ui/Alert';
// import styles from './payment-summary.module.css'; // preporučujem zaseban fajl za ovu stranicu
// import { paymentsApi } from '../../api/endpoints/payments';
//
// export default function PaymentSummary() {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);
//
//     // OTP / SMS kod – 4 polja
//     const [otp, setOtp] = useState(['', '', '', '']);
//     const inputRefs = useRef([]);
//
//     if (!state) {
//         return <Alert tip="greska" poruka="Nema podataka o plaćanju." />;
//     }
//
//     const {
//         fromAccount,
//         recipientName,
//         recipientAccount,
//         amount,
//         paymentCode,
//         referenceNumber,
//         purpose,
//     } = state;
//
//     const handleOtpChange = (index, value) => {
//         if (value.length > 1) value = value.slice(-1);
//         if (!/^\d*$/.test(value)) return;
//
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);
//
//         if (value && index < 3) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };
//
//     const handleOtpPaste = (e, index) => {
//         e.preventDefault();
//         const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 4 - index);
//         if (!pasted) return;
//
//         const newOtp = [...otp];
//         for (let i = 0; i < pasted.length && index + i < 4; i++) {
//             newOtp[index + i] = pasted[i];
//         }
//         setOtp(newOtp);
//
//         const next = Math.min(index + pasted.length, 3);
//         inputRefs.current[next]?.focus();
//     };
//
//     const handleKeyDown = (e, index) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         }
//     };
//
//     const handleConfirm = async () => {
//         const otpCode = otp.join('');
//         if (otpCode.length !== 4) {
//             setError('Unesite kompletan kod od 4 cifre.');
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//
//         try {
//             // Primer poziva API-ja – prilagodi prema tvom backendu
//             await paymentsApi.createPayment({
//                 fromAccountId: fromAccount.id,
//                 recipientName,
//                 recipientAccount,
//                 amount,
//                 paymentCode,
//                 referenceNumber,
//                 purpose,
//                 otpCode, // šaljemo kod na backend
//             });
//
//             setSuccess(true);
//             setTimeout(() => {
//                 navigate('/payments');
//             }, 1800);
//         } catch  {
//             setError('Plaćanje nije uspelo. Proverite kod i pokušajte ponovo.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleResend = () => {
//         // TODO: implementiraj ponovno slanje SMS-a
//         alert('Kod je ponovo poslat (implementiraj backend poziv).');
//     };
//
//     return (
//         <div className={styles.stranica}>
//             <main className={styles.sadrzaj}>
//                 <div className={styles.header}>
//                     <div className={styles.breadcrumb}>Plaćanja › Potvrda</div>
//                     <h1 className={styles.pageTitle}>Potvrda plaćanja</h1>
//                     <p className={styles.pageDesc}>Proverite podatke pre slanja naloga</p>
//                 </div>
//
//                 <div className={styles.warning}>
//                     <span className={styles.warningIcon}>⚠</span>
//                     <div>
//                         <strong>Proverite podatke.</strong> Nakon potvrde transakcija se ne može opozvati.
//                     </div>
//                 </div>
//
//                 <div className={styles.confirmCard}>
//                     <div className={styles.summaryGrid}>
//                         <div className={styles.row}>
//                             <div className={styles.label}>Naziv primaoca</div>
//                             <div className={styles.value}>{recipientName}</div>
//                         </div>
//
//                         <div className={styles.row}>
//                             <div className={styles.label}>Račun primaoca</div>
//                             <div className={`${styles.value} ${styles.mono}`}>{recipientAccount}</div>
//                         </div>
//
//                         <div className={styles.row}>
//                             <div className={styles.label}>Sa računa</div>
//                             <div className={`${styles.value} ${styles.mono}`}>{fromAccount?.broj || '—'}</div>
//                         </div>
//
//                         <div className={styles.row}>
//                             <div className={styles.label}>Iznos</div>
//                             <div className={styles.amount}>
//                                 {Number(amount).toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RSD
//                             </div>
//                         </div>
//
//                         <div className={styles.row}>
//                             <div className={styles.label}>Šifra plaćanja</div>
//                             <div className={styles.value}>{paymentCode || '—'}</div>
//                         </div>
//
//                         {referenceNumber && (
//                             <div className={styles.row}>
//                                 <div className={styles.label}>Poziv na broj</div>
//                                 <div className={styles.value}>{referenceNumber}</div>
//                             </div>
//                         )}
//
//                         {purpose && (
//                             <div className={styles.row}>
//                                 <div className={styles.label}>Svrha plaćanja</div>
//                                 <div className={styles.value}>{purpose}</div>
//                             </div>
//                         )}
//                     </div>
//
//                     <div className={styles.otpSection}>
//                         <label className={styles.otpLabel}>
//                             Unesite kod koji ste dobili SMS-om
//                         </label>
//
//                         <div className={styles.otpInputs}>
//                             {otp.map((digit, i) => (
//                                 <input
//                                     key={i}
//                                     type="text"
//                                     maxLength={1}
//                                     value={digit}
//                                     onChange={(e) => handleOtpChange(i, e.target.value)}
//                                     onPaste={(e) => handleOtpPaste(e, i)}
//                                     onKeyDown={(e) => handleKeyDown(e, i)}
//                                     ref={(el) => (inputRefs.current[i] = el)}
//                                     className={styles.otpInput}
//                                     autoFocus={i === 0}
//                                     inputMode="numeric"
//                                     pattern="[0-9]*"
//                                 />
//                             ))}
//                         </div>
//
//                         <button type="button" className={styles.resend} onClick={handleResend}>
//                             Pošalji ponovo
//                         </button>
//                     </div>
//
//                     {error && <Alert tip="greska" poruka={error} />}
//                     {success && <Alert tip="uspeh" poruka="Plaćanje uspešno izvršeno!" />}
//
//                     <div className={styles.actions}>
//
//
//                         <button
//                             className={styles.btnPrimary}
//                             onClick={handleConfirm}
//                             disabled={loading || success || otp.join('').length !== 4}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Spinner small inline /> Proveravam...
//                                 </>
//                             ) : (
//                                 'Potvrdi plaćanje'
//                             )}
//                         </button>
//
//                         <button
//                             className={styles.btnSecondary}
//                             onClick={() => navigate(-1)}
//                             disabled={loading || success}
//                         >
//                             Nazad
//                         </button>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }
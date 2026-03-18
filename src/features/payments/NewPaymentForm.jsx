import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import Alert from '../../components/ui/Alert'
import styles from './payments.module.css'
import { paymentsApi } from "../../api/endpoints/payments.js"

// ── Uvezeni mock podaci ────────────────────────────────────────
import {
    FAKE_CURRENT_ACCOUNT,
    PAYMENT_CODES,
    QUICK_RECIPIENTS,
} from '/src/api/mock.js'


export default function NewPaymentForm() {
    const navigate = useNavigate()

    const [fromAccountId, setFromAccountId] = useState(FAKE_CURRENT_ACCOUNT.id)
    const [recipientName, setRecipientName] = useState('')
    const [recipientAccount, setRecipientAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentCode, setPaymentCode] = useState('289')
    const [referenceNumber, setReferenceNumber] = useState('')
    const [purpose, setPurpose] = useState('')

    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')

    // ── Dohvatanje sačuvanih primalaca ───────────────────────────────
    const { data: recipientsRes } = useFetch(() => paymentsApi.getRecipients())
    const savedRecipients = recipientsRes?.data || []

    // ── Dohvatanje korisničkih računa ────────────────────────────────
    const { data: accountsRes, loading: accountsLoading } = useFetch(() => paymentsApi.getMyAccounts())
    const userAccounts = accountsRes?.data || [FAKE_CURRENT_ACCOUNT]

    const filteredRecipients = [...QUICK_RECIPIENTS, ...savedRecipients].filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    )

    // Trenutno odabrani račun
    // Trenutno odabrani račun sa generisanjem formattedStanje ako ne postoji
    const selectedAccount = (() => {
        const acc = userAccounts.find(acc => acc.id === fromAccountId) || FAKE_CURRENT_ACCOUNT;
        return {
            ...acc,
            formattedStanje: acc.formattedStanje
                || acc.stanje?.toLocaleString('sr-RS', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + ' ' + acc.valuta
        };
    })();
    // ── Validacija ───────────────────────────────────────────────────
    const isAccountValid = /^\d{3}-\d{10}-\d{2}$/.test(recipientAccount.trim())
    const parsedAmount = Number(amount.replace(',', '.'))
    const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0
    const hasEnoughBalance = isAmountValid && parsedAmount <= selectedAccount.stanje

    const isValid =
        fromAccountId &&
        recipientName.trim().length >= 2 &&
        isAccountValid &&
        isAmountValid &&
        hasEnoughBalance &&
        paymentCode.trim() &&
        purpose.trim()

    const handleQuickSelect = (r) => {
        setRecipientName(r.name)
        setRecipientAccount(r.account)
        setSearch('')
    }

    const handleSubmit = () => {
        setError(null)

        if (!isValid) {
            setError(
                !hasEnoughBalance
                    ? `Nedovoljno sredstava na računu (${selectedAccount.formattedStanje})`
                    : 'Molimo popunite sva obavezna polja ispravno.'
            )
            return
        }

        navigate('/payments/confirm', {
            state: {
                fromAccountId,
                recipientName,
                recipientAccount,
                amount: parsedAmount,
                paymentCode,
                referenceNumber,
                purpose,
                fromAccount: selectedAccount, // opciono – za prikaz u confirm
            },
        })
    }

    return (
        <div className={styles.formContainer}>

            <div className={styles.accountHeader}>
                <div className={styles.accountInfo}>
                    <div className={styles.accountNumber}>
                        {selectedAccount.broj}
                    </div>
                    <div className={styles.accountName}>
                        {selectedAccount.displayName}
                    </div>
                    <div className={styles.balance}>
                        Raspoloživo: <strong>{selectedAccount.formattedStanje}</strong>
                    </div>
                </div>

                <div className={styles.accountSelector}>
                    <label className={styles.accountLabel}>Račun platioca</label>
                    {accountsLoading ? (
                        <div className={styles.loadingText}>Učitavanje računa...</div>
                    ) : (
                        <select
                            value={fromAccountId}
                            onChange={(e) => setFromAccountId(Number(e.target.value))}
                            className={styles.accountSelect}
                        >
                            {userAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.broj}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <h2 className={styles.title}>Nalog za plaćanje</h2>
            <p className={styles.subtitle}>— na teret Vašeg odabranog računa</p>

            {/* PRIMAOCI PLAĆANJA */}
            <div className={styles.quickRecipients}>
                <label>Primaoci plaćanja</label>
                <div className={styles.chips}>
                    {QUICK_RECIPIENTS.map(r => (
                        <button
                            key={r.name}
                            className={`${styles.chip} ${recipientName === r.name ? styles.active : ''}`}
                            onClick={() => handleQuickSelect(r)}
                        >
                            <span className={styles.initial}>{r.initial}</span>
                            {r.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* FORMA */}
            <div className={styles.fields}>
                <div className={styles.formGrid}>

                    <div className={styles.field}>
                        <label>NAZIV PRIMAOCA *</label>
                        <input
                            value={recipientName}
                            onChange={e => {
                                setRecipientName(e.target.value)
                                setSearch(e.target.value)
                            }}
                            placeholder="Ime, prezime ili firma"
                        />
                        {search && (
                            <div className={styles.dropdown}>
                                {filteredRecipients.length > 0 ? (
                                    filteredRecipients.map(r => (
                                        <div
                                            key={r.name}
                                            className={styles.dropdownItem}
                                            onClick={() => handleQuickSelect(r)}
                                        >
                                            {r.name} — {r.account}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.dropdownItem}>Nema rezultata</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>RAČUN PRIMAOCA *</label>
                        <input
                            value={recipientAccount}
                            onChange={e => setRecipientAccount(e.target.value)}
                            placeholder="npr. 265-0000012345-89"
                        />
                        {recipientAccount && !isAccountValid && (
                            <small className={styles.errorText}>
                                Račun mora biti u formatu xxx-xxxxxxxxxx-xx
                            </small>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>IZNOS *</label>
                        <div className={styles.amountWrapper}>
                            <input
                                type="text"
                                value={amount}
                                onChange={e => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                                placeholder="0,00"
                            />
                            <span className={styles.currency}>RSD</span>
                        </div>
                        {isAmountValid && !hasEnoughBalance && (
                            <small className={styles.errorText}>
                                Nedovoljno sredstava (max: {selectedAccount.formattedStanje})
                            </small>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>ŠIFRA PLAĆANJA *</label>
                        <select
                            value={paymentCode}
                            onChange={e => setPaymentCode(e.target.value)}
                        >
                            {PAYMENT_CODES.map(code => (
                                <option key={code.value} value={code.value}>
                                    {code.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>POZIV NA BROJ</label>
                        <input
                            value={referenceNumber}
                            onChange={e => setReferenceNumber(e.target.value)}
                            placeholder="npr. 97-0000000000000 ili 117-6926"
                        />
                    </div>

                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label>SVRHA PLAĆANJA *</label>
                        <textarea
                            value={purpose}
                            onChange={e => setPurpose(e.target.value)}
                            placeholder="Namen osnov zbog kojeg izvršavate uplatu"
                        />
                    </div>

                </div>
            </div>

            {error && <Alert tip="greska" poruka={error} />}

            <div className={styles.actions}>
                <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
                    Odustani
                </button>
                <button
                    className={styles.btnPrimary}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Nastavi
                </button>
            </div>

        </div>
    )
}
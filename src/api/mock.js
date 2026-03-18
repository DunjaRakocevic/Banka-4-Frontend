import api from './client';

const DELAY = 600;
const delay = ms => new Promise(r => setTimeout(r, ms));

const FAKE_OTP = "1234";

const FAKE_EMPLOYEE = {
    employee_id: 1,
    first_name: 'Petar',
    last_name: 'Petrović',
    email: 'petar.petrovic@rafbank.rs',
    username: 'ppetrovic',
    gender: 'M',
    date_of_birth: '1985-03-15',
    phone_number: '+381601234567',
    address: 'Knez Mihailova 10, Beograd',
    department: 'Management',
    position_id: 1,
    active: true,
    is_admin: true,
    permissions: [
        'employee.view',
        'employee.create',
        'employee.update',
        'employee.delete',
    ],
};

const FAKE_EMPLOYEES = [
    { employee_id: 1, first_name: 'Petar', last_name: 'Petrović', email: 'petar.petrovic@rafbank.rs', username: 'ppetrovic', position_id: 1, department: 'Management', active: true, gender: 'M', date_of_birth: '1985-03-15', phone_number: '+381601234567', address: 'Knez Mihailova 10' },
    { employee_id: 2, first_name: 'Ana', last_name: 'Jovanović', email: 'ana.jovanovic@rafbank.rs', username: 'ajovanovic', position_id: 2, department: 'Finance', active: true, gender: 'F', date_of_birth: '1990-07-22', phone_number: '+381601234568', address: 'Bulevar Kralja Aleksandra 5' },
    { employee_id: 3, first_name: 'Marko', last_name: 'Nikolić', email: 'marko.nikolic@rafbank.rs', username: 'mnikolic', position_id: 3, department: 'IT', active: true, gender: 'M', date_of_birth: '1992-11-03', phone_number: '+381601234569', address: 'Nemanjina 15' },
    { employee_id: 4, first_name: 'Jelena', last_name: 'Đorđević', email: 'jelena.djordjevic@rafbank.rs', username: 'jdjordjevic', position_id: 4, department: 'Finance', active: false, gender: 'F', date_of_birth: '1988-01-10', phone_number: '+381601234570', address: 'Cara Dušana 20' },
    { employee_id: 5, first_name: 'Stefan', last_name: 'Popović', email: 'stefan.popovic@rafbank.rs', username: 'spopovic', position_id: 5, department: 'IT', active: true, gender: 'M', date_of_birth: '1995-05-18', phone_number: '+381601234571', address: 'Terazije 8' },
    { employee_id: 6, first_name: 'Milica', last_name: 'Stanković', email: 'milica.stankovic@rafbank.rs', username: 'mstankovic', position_id: 6, department: 'HR', active: true, gender: 'F', date_of_birth: '1991-09-25', phone_number: '+381601234572', address: 'Savska 30' },
    { employee_id: 7, first_name: 'Nikola', last_name: 'Ilić', email: 'nikola.ilic@rafbank.rs', username: 'nilic', position_id: 7, department: 'IT', active: false, gender: 'M', date_of_birth: '1993-12-07', phone_number: '+381601234573', address: 'Vojvode Stepe 42' },
    { employee_id: 8, first_name: 'Ivana', last_name: 'Marković', email: 'ivana.markovic@rafbank.rs', username: 'imarkovic', position_id: 8, department: 'Finance', active: true, gender: 'F', date_of_birth: '1989-04-14', phone_number: '+381601234574', address: 'Balkanska 12' },
];


const FAKE_ACCOUNTS = [
    { id: 1, broj: "170-0000123456789-01", displayName: "Dinarski račun 1", valuta: "RSD", stanje: 458920.75, tip: "Tekući račun", active: true },
    { id: 2, broj: "170-0000987654321-89", valuta: "EUR", displayName: "Devizni račun EUR", stanje: 12450.30, tip: "Devizni račun", active: true },
    { id: 3, broj: "170-0000555123456-77", valuta: "RSD",displayName: "Dinarski račun 2", stanje: 128450.00, tip: "Štedni račun", active: true },
    { id: 4, broj: "170-0000777888999-22", valuta: "USD", displayName: "Devizni račun USD", stanje: 8750.45, tip: "Devizni račun", active: false },
];

let FAKE_TRANSFERS = [
    {
        id: 1001,
        date: "2025-03-10T14:35:22",
        fromAccountNumber: "170-0000123456789-01",
        fromCurrency: "RSD",
        toAccountNumber: "170-0000987654321-89",
        toCurrency: "EUR",
        initialAmount: 117200.00,
        finalAmount: 1000.00,
        commission: 200.00,
        exchangeRate: 117.20,
        transactionId: "TRF-20250310-001",
        status: "Uspešno",
    },
    {
        id: 1002,
        date: "2025-02-28T09:12:45",
        fromAccountNumber: "170-0000987654321-89",
        fromCurrency: "EUR",
        toAccountNumber: "170-0000123456789-01",
        toCurrency: "RSD",
        initialAmount: 500.00,
        finalAmount: 58500.00,
        commission: 0.00,
        exchangeRate: 117.00,
        transactionId: "TRF-20250228-002",
        status: "Uspešno",
    },
];

const FAKE_RATES = [
    { code: 'EUR', flag: '/flags/eu.svg', buy: 116.8, mid: 117.2, sell: 117.6 },
    { code: 'CHF', flag: '/flags/ch.svg', buy: 120.1, mid: 120.7, sell: 121.3 },
    { code: 'USD', flag: '/flags/us.svg', buy: 107.5, mid: 108.0, sell: 108.5 },
    { code: 'GBP', flag: '/flags/gb.svg', buy: 135.2, mid: 136.0, sell: 136.8 },
    { code: 'JPY', flag: '/flags/jp.svg', buy: 0.72, mid: 0.74, sell: 0.76 },
    { code: 'CAD', flag: '/flags/ca.svg', buy: 79.5, mid: 80.0, sell: 80.5 },
    { code: 'AUD', flag: '/flags/au.svg', buy: 71.2, mid: 71.8, sell: 72.4 },
    { code: 'RSD', flag: '/flags/rs.svg', buy: 1, mid: 1, sell: 1 },
];

let FAKE_RECIPIENTS = [
    { id: 1, name: 'Elektrodistribucija', account: '160000000000000001' },
    { id: 2, name: 'Infostan', account: '160000000000000002' },
];

let FAKE_PAYMENTS = [];

// src/api/mock.js  (ili gde god držiš FAKE_ACCOUNTS, FAKE_RECIPIENTS, itd.)

export const FAKE_CURRENT_ACCOUNT = {
    id: 1,
    broj: "170-0000123456-78",          // ← realističniji format
    displayName: "Dinarski račun 1",
    stanje: 458920.75,
    valuta: "RSD",
    formattedStanje: "458.920,75 RSD",   // možeš generisati u komponenti, ali ok i ovde
};

// Brzi primaoci – ljudi kojima se često plaća
export const QUICK_RECIPIENTS = [
    {
        initial: "I",
        name: "Ivan",
        account: "265-0000012345-89",
    },
    {
        initial: "Ig",
        name: "Ignjat",
        account: "265-0000098765-43",
    },
    {
        initial: "A",
        name: "Andrija",
        account: "170-1234567890-12",
    },
];


export const PAYMENT_CODES = [
    { value: "189", label: "189 – Plaćanje fizičkim licima" },
    { value: "221", label: "221 – Plaćanje robe i usluga – finalna potrošnja" },
    { value: "225", label: "225 – Plaćanje zakupa javnim ustanovama" },
    { value: "240", label: "240 – Plaćanje zarada i drugih ličnih primanja" },
    { value: "241", label: "241 – Neoporeziva davanja zaposlenima" },
    { value: "248", label: "248 – Plaćanje zakupnine fizičkim licima, kamata, dividendi" },
    { value: "253", label: "253 – Uplate javnih prihoda (pojedinačni porezi i doprinosi)" },
    { value: "289", label: "289 – Transakcije po nalogu građana (najčešće za fizička lica)" },
    { value: "291", label: "291 – Plaćanje usluga platnog prometa" },
    { value: "820", label: "820 – Donacije, sponzorstva, humanitarna pomoć" },
];

// const userAccounts = [
//     FAKE_CURRENT_ACCOUNT,
//     {
//         id: 2,
//         broj: "170-0000987654-32",
//         displayName: "Devizni račun EUR",
//         formattedStanje: "12.450,30 EUR",
//         valuta: "EUR",
//     },
//     {
//         id: 3,
//         broj: "265-5550000123-89",
//         displayName: "Štedni račun",
//         formattedStanje: "1.284.500,00 RSD",
//         valuta: "RSD",
//     },
// ];
api.interceptors.request.use(async config => {
    await delay(DELAY);

    const { method, url, data: rawData, params } = config;
    const data = typeof rawData === 'string' ? JSON.parse(rawData || '{}') : rawData ?? {};
    const path = url?.replace(import.meta.env.VITE_API_URL ?? '', '') ?? '';

    if (method === 'post' && path === '/login') {
        if (data.email && data.password) {
            return throwFakeResponse(config, {
                token: 'fake-jwt-token-123',
                refresh_token: 'fake-refresh-token-123',
                user: FAKE_EMPLOYEE,
            });
        }
        return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
    }

    if (method === 'post' && path === '/refresh') {
        return throwFakeResponse(config, {
            token: 'fake-jwt-token-123',
            refresh_token: 'fake-refresh-token-123',
        });
    }

    if (method === 'post' && path === '/register') {
        const novi = { employee_id: Date.now(), ...data };
        FAKE_EMPLOYEES.push(novi);
        return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
    }

    if (method === 'post' && path === '/activate') {
        return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
    }

    if (method === 'post' && path === '/forgot-password') {
        return throwFakeResponse(config, { message: 'Email je poslat.' });
    }

    if (method === 'post' && path === '/reset-password') {
        return throwFakeResponse(config, { message: 'Lozinka je promenjena.' });
    }

    if (method === 'post' && path === '/change-password') {
        return throwFakeResponse(config, { message: 'Lozinka je uspešno promenjena.' });
    }

    const idMatch = path.match(/^\/(\d+)$/);

    if (method === 'get' && idMatch) {
        const emp = FAKE_EMPLOYEES.find(e => e.employee_id === Number(idMatch[1]));
        if (emp) return throwFakeResponse(config, { data: emp });
        return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
    }

    if (method === 'patch' && idMatch) {
        const idx = FAKE_EMPLOYEES.findIndex(e => e.employee_id === Number(idMatch[1]));
        if (idx !== -1) {
            Object.assign(FAKE_EMPLOYEES[idx], data);
            return throwFakeResponse(config, { data: FAKE_EMPLOYEES[idx], message: 'Zaposleni je ažuriran.' });
        }
        return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
    }

    if (method === 'delete' && idMatch) {
        const idx = FAKE_EMPLOYEES.findIndex(e => e.employee_id === Number(idMatch[1]));
        if (idx !== -1) {
            FAKE_EMPLOYEES.splice(idx, 1);
            return throwFakeResponse(config, { message: 'Zaposleni je obrisan.' });
        }
        return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
    }


    if (method === 'get' && path === '/client/recipients') {
        return throwFakeResponse(config, { data: [...FAKE_RECIPIENTS] });
    }

    if (method === 'post' && path === '/client/recipients') {
        const novi = {
            id: Date.now(),
            ...data,
        };

        FAKE_RECIPIENTS.push(novi);

        return throwFakeResponse(config, { data: novi }, 201);
    }

    if (method === 'put' && path.startsWith('/client/recipients/')) {
        const id = Number(path.split('/').pop());

        const idx = FAKE_RECIPIENTS.findIndex(r => r.id === id);

        if (idx === -1) {
            return throwFakeError(config, 404, 'Recipient not found');
        }

        FAKE_RECIPIENTS[idx] = { ...FAKE_RECIPIENTS[idx], ...data };

        return throwFakeResponse(config, { data: FAKE_RECIPIENTS[idx] });
    }

    if (method === 'delete' && path.startsWith('/client/recipients/')) {
        const id = Number(path.split('/').pop());

        FAKE_RECIPIENTS = FAKE_RECIPIENTS.filter(r => r.id !== id);

        return throwFakeResponse(config, { message: 'Deleted' });
    }

    if (method === 'post' && path === '/client/payments') {
        const {
            fromAccountId,
            recipientName,
            recipientAccount,
            amount,
            paymentCode,
            referenceNumber,
            purpose,
            otpCode,
        } = data;

        if (otpCode !== FAKE_OTP) {
            return throwFakeError(config, 400, 'Neispravan OTP kod');
        }
        const fromAcc = FAKE_ACCOUNTS.find(a => a.id === fromAccountId);

        if (!fromAcc) {
            return throwFakeError(config, 404, 'Account not found');
        }

        if (amount <= 0 || amount > fromAcc.stanje) {
            return throwFakeError(config, 400, 'Invalid amount');
        }

        // skini pare
        fromAcc.stanje -= amount;

        const newPayment = {
            id: Date.now(),
            date: new Date().toISOString(),
            fromAccount: fromAcc.broj,
            recipientName,
            recipientAccount,
            amount,
            currency: fromAcc.valuta,
            paymentCode,
            referenceNumber,
            purpose,
            status: 'Uspešno',
        };

        FAKE_PAYMENTS.unshift(newPayment);

        return throwFakeResponse(config, {
            message: 'Payment successful',
            data: newPayment,
        }, 201);
    }




    if (method === 'get' && path === '') {
        let filtered = [...FAKE_EMPLOYEES];
        if (params?.email) filtered = filtered.filter(e => e.email.toLowerCase().includes(params.email.toLowerCase()));
        if (params?.first_name) filtered = filtered.filter(e => e.first_name.toLowerCase().includes(params.first_name.toLowerCase()));
        if (params?.last_name) filtered = filtered.filter(e => e.last_name.toLowerCase().includes(params.last_name.toLowerCase()));
        if (params?.position) filtered = filtered.filter(e => String(e.position_id).includes(params.position));
        const page = Number(params?.page) || 1;
        const pageSize = Number(params?.page_size) || 20;
        const start = (page - 1) * pageSize;
        const sliced = filtered.slice(start, start + pageSize);
        return throwFakeResponse(config, {
            data: sliced,
            total: filtered.length,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(filtered.length / pageSize),
        });
    }

    if (method === 'get' && path === '/exchange/rates') {
        return throwFakeResponse(config, FAKE_RATES);
    }

    if (method === 'get' && path === '/client/accounts') {
        return throwFakeResponse(config, { data: FAKE_ACCOUNTS });
    }

    if (method === 'get' && path === '/client/transfers') {
        return throwFakeResponse(config, { data: [...FAKE_TRANSFERS] });
    }

    if (method === 'post' && path === '/client/transfers/preview') {
        const { fromAccountId, toAccountId, amount } = data;
        const fromAcc = FAKE_ACCOUNTS.find(a => a.id === fromAccountId);
        const toAcc = FAKE_ACCOUNTS.find(a => a.id === toAccountId);
        if (!fromAcc || !toAcc) return throwFakeError(config, 404, 'Račun nije pronađen');
        if (fromAcc.id === toAcc.id) return throwFakeError(config, 400, 'Izvorni i odredišni račun ne mogu biti isti');
        if (amount <= 0) return throwFakeError(config, 400, 'Iznos mora biti veći od 0');
        if (amount > fromAcc.stanje) return throwFakeError(config, 400, 'Nedovoljno sredstava na računu');

        let kurs = 1;
        if (fromAcc.valuta !== toAcc.valuta) {
            const fromRate = FAKE_RATES.find(r => r.code === fromAcc.valuta)?.mid ?? 1;
            const toRate = FAKE_RATES.find(r => r.code === toAcc.valuta)?.mid ?? 1;
            kurs = fromRate / toRate;
        }

        return throwFakeResponse(config, {
            data: {
                kurs: kurs.toFixed(2),
                finalAmount: amount * kurs,
                message: 'Pregled uspešan',
            }
        });
    }

    if (method === 'post' && path === '/client/transfers') {
        const { fromAccountId, toAccountId, amount } = data;
        const fromAcc = FAKE_ACCOUNTS.find(a => a.id === fromAccountId);
        const toAcc = FAKE_ACCOUNTS.find(a => a.id === toAccountId);

        if (!fromAcc || !toAcc || amount <= 0 || amount > fromAcc.stanje) {
            return throwFakeError(config, 400, 'Nevalidan transfer');
        }

        fromAcc.stanje -= amount;
        let added = amount;
        let kurs = null;
        let provizija = 0;

        if (fromAcc.valuta !== toAcc.valuta) {
            const fromRate = FAKE_RATES.find(r => r.code === fromAcc.valuta)?.mid ?? 1;
            const toRate = FAKE_RATES.find(r => r.code === toAcc.valuta)?.mid ?? 1;
            kurs = fromRate / toRate;
            provizija = amount * 0.003;
            added = (amount - provizija) * kurs;
            toAcc.stanje += added;
        } else {
            toAcc.stanje += amount;
        }

        const newTransfer = {
            id: Date.now(),
            date: new Date().toISOString(),
            fromAccountNumber: fromAcc.broj,
            fromCurrency: fromAcc.valuta,
            toAccountNumber: toAcc.broj,
            toCurrency: toAcc.valuta,
            initialAmount: amount,
            finalAmount: added,
            commission: provizija,
            exchangeRate: kurs,
            transactionId: `TRF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(FAKE_TRANSFERS.length + 1).padStart(3,'0')}`,
            status: 'Uspešno',
        };

        FAKE_TRANSFERS.unshift(newTransfer);

        return throwFakeResponse(config, { message: 'Transfer uspešno izvršen', data: newTransfer }, 201);
    }

    return config;
});

function throwFakeResponse(config, responseData, status = 200) {
    config.adapter = () =>
        Promise.resolve({
            data: responseData,
            status,
            headers: {},
            config,
            request: {},
        });
    return config;
}

function throwFakeError(config, status, errorMsg) {
    config.adapter = () =>
        Promise.reject({
            response: {
                status,
                data: { error: errorMsg },
            },
            config,
        });
    return config;
}
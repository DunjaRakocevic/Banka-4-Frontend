import { useRef, useLayoutEffect, useState, useMemo } from 'react';
import gsap from 'gsap';

// Layout & UI (Pratimo tvoj folder structure sa slike)
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

// Features (Tvoje izdvojene komponente)
import PaymentFilters from '../features/payments/PaymentFilters';
import PaymentTable from '../features/payments/PaymentTable';

import styles from './PaymentOverview.module.css';

export default function PaymentOverview() {
  const pageRef = useRef(null);

  // 1. STATE ZA PODATKE (Pravilo 10.3 - Loading/Error)
  const [loading] = useState(false);
  const [error] = useState(null);
  
  // Prošireni podaci da podrže "Menjačnicu" i "Plaćanja" (Zahtev 1)
  const [transactions] = useState([
    { id: 1, date: '2024-03-14 14:20', recipient: 'Restoran "Sidro"', amount: -4200.00, currency: 'RSD', status: 'Realizovano', type: 'payment', fee: 15.00, model: '97', reference: '12-345-678' },
    { id: 2, date: '2024-03-14 12:15', recipient: 'Menjačnica (RSD -> EUR)', amount: -11750.00, currency: 'RSD', status: 'U obradi', type: 'exchange', fee: 0.00, model: '00', reference: 'TRF-9921' },
    { id: 3, date: '2024-03-13 09:00', recipient: 'Infostan', amount: -8500.00, currency: 'RSD', status: 'Odbijeno', type: 'payment', fee: 45.00, model: '11', reference: 'INF-2024-X' }
  ]);

  // 2. STATE ZA KARTICE (Tvoj novi zahtev sa slike 99)
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' ili 'exchange'

  // 3. STATE ZA FILTERE (Kontrolisane komponente - Pravilo 10.2)
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: ''
  });

  // 4. LOGIKA FILTRIRANJA (useMemo za performanse)
  const filteredData = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter(t => {
      // Prvo filtriramo po kartici (Pravilo 1)
      const matchTab = activeTab === 'payments' ? t.type === 'payment' : t.type === 'exchange';
      if (!matchTab) return false;

      // Zatim tvoji ostali filteri
      const matchStatus = !filters.status || t.status === filters.status;
      const tDate = new Date(t.date).getTime();
      const matchDateFrom = !filters.dateFrom || tDate >= new Date(filters.dateFrom).getTime();
      const matchDateTo = !filters.dateTo || tDate <= new Date(filters.dateTo).getTime();

      const tAmount = Math.abs(t.amount);
      const matchAmountFrom = !filters.amountFrom || tAmount >= parseFloat(filters.amountFrom);
      const matchAmountTo = !filters.amountTo || tAmount <= parseFloat(filters.amountTo);

      return matchStatus && matchDateFrom && matchDateTo && matchAmountFrom && matchAmountTo;
    });
  }, [filters, transactions, activeTab]);

  // 5. ANIMACIJA (Pravilo 10.1)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sadrzaj', { 
        opacity: 0, 
        y: 20, 
        stagger: 0.1, 
        duration: 0.4, 
        ease: 'power2.out' 
      });
    }, pageRef);
    return () => ctx.revert();
  }, [activeTab]); // Animacija se ponavlja kad promeniš karticu

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message="Greška pri učitavanju." />;

  return (
    <div className={styles.pageContainer} ref={pageRef}>
      <Navbar />
      
      <main className={styles.content}>
        <header className="sadrzaj">
          <h1 className={styles.title}>Pregled plaćanja</h1>
          <p className={styles.subtitle}>Istorija transakcija i menjačkih poslova</p>
        </header>

        {/* KARTICE (Tabs) - Izgled sa tvoje slike 99 */}
        <div className={`${styles.tabsContainer} sadrzaj`}>
          <button 
            className={`${styles.tab} ${activeTab === 'payments' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Domaća plaćanja
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'exchange' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('exchange')}
          >
            Menjačnica
          </button>
        </div>

        {/* FILTERI */}
        <section className="sadrzaj">
          <PaymentFilters filters={filters} setFilters={setFilters} />
        </section>

        {/* TABELA (Sada izdvojena i čista) */}
        <div className={`${styles.tableCard} sadrzaj`}>
          <PaymentTable 
            transactions={filteredData} 
            onRowClick={(trans) => console.log("Otvaram modal za:", trans)}
          />
        </div>
      </main>
    </div>
  );
}
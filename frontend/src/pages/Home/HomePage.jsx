import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';
import PromotionBanner from './LocalComponents/PromotionBanner';
import HotelBookingCard from './LocalComponents/HotelBookingCard';
import FlightsSearchCard from './LocalComponents/FlightsSearchCard';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearch = (payload) => {
    const fromCode = payload?.from?.cityCode || payload?.from?.airportCode || 'SHA'
    const toCode = payload?.to?.cityCode || payload?.to?.airportCode || 'BJS'
    const params = new URLSearchParams({
      trip: payload.tripType || 'oneway',
      from: fromCode,
      to: toCode,
      departDate: payload.departDate || todayString(),
      adults: '1',
      children: '0',
      infants: '0',
      cabin: 'economy',
      directOnly: 'false',
      returnDate: payload.returnDate || ''
    });
    navigate(`/flights/results?${params.toString()}`);
  };

  function todayString() {
    const d = new Date();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${m}-${dd}`
  }
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <PromotionBanner />
          <div className={styles.rightPane}>
            <FlightsSearchCard onSearch={handleSearch} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
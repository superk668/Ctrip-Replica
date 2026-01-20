import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';
import PromotionBanner from './LocalComponents/PromotionBanner';
import FlightsSearchCard from './LocalComponents/FlightsSearchCard';

import mainAd from '../../assets/images/homepage_ad/main_ad.png';
import col1item1 from '../../assets/images/homepage_ad/col1item1.jpg';
import col1item2 from '../../assets/images/homepage_ad/col1item2.jpg';
import col1item3 from '../../assets/images/homepage_ad/col1item3.jpg';
import col1item4 from '../../assets/images/homepage_ad/col1item4.jpg';
import col1item5 from '../../assets/images/homepage_ad/col1item5.jpg';
import col2item1 from '../../assets/images/homepage_ad/col2item1.jpg';
import col2item2 from '../../assets/images/homepage_ad/col2item2.jpg';
import col2item3 from '../../assets/images/homepage_ad/col2item3.jpg';
import col2item4 from '../../assets/images/homepage_ad/col2item4.jpg';
import col2item5 from '../../assets/images/homepage_ad/col2item5.jpg';
import col3item1 from '../../assets/images/homepage_ad/col3item1.jpg';
import col3item2 from '../../assets/images/homepage_ad/col3item2.jpg';
import col3item3 from '../../assets/images/homepage_ad/col3item3.jpg';
import col3item4 from '../../assets/images/homepage_ad/col3item4.jpg';
import col3item5 from '../../assets/images/homepage_ad/col3item5.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const parseCode = (txt) => {
    const m = /\(([^)]+)\)/.exec(String(txt || ''))
    return m ? m[1] : ''
  }

  const addDaysISO = (iso, days) => {
    const d = new Date(String(iso || todayString()))
    d.setDate(d.getDate() + Number(days || 0))
    const m = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${d.getFullYear()}-${m}-${dd}`
  }

  const columnThumbs = {
    weekend: [col1item1, col1item2, col1item3, col1item4, col1item5],
    grassland: [col2item1, col2item2, col2item3, col2item4, col2item5],
    seaside: [col3item1, col3item2, col3item3, col3item4, col3item5],
  };

  const lowFareColumns = [
    {
      key: 'weekend',
      title: '周末省心游',
      theme: 'teal',
      items: [
        { rank: 1, from: '上海', to: '杭州', date: '01-24 至 01-27', price: '¥458起', discount: '2折', imgSrc: col1item1 },
        { rank: 2, from: '上海', to: '南京', date: '01-30 至 01-31', price: '¥458起', discount: '2.2折', imgSrc: col1item2 },
        { rank: 3, from: '上海', to: '大连', date: '01-23 至 01-25', price: '¥539起', discount: '1.7折', imgSrc: col1item3 },
        { rank: 4, from: '上海', to: '合肥', date: '01-24 至 01-25', price: '¥600起', discount: '2.8折', imgSrc: col1item4 },
        { rank: 5, from: '上海', to: '沈阳', date: '01-31 至 02-03', price: '¥652起', discount: '2.6折', imgSrc: col1item5 },
      ],
    },
    {
      key: 'grassland',
      title: '爱上大草原',
      theme: 'orange',
      items: [
        { rank: 1, from: '上海', to: '通辽', date: '2026-03-18 周三', price: '¥230起', discount: '1.1折', imgSrc: col2item1 },
        { rank: 2, from: '上海', to: '呼和浩特', date: '2026-03-11 周三', price: '¥350起', discount: '1.2折', imgSrc: col2item2 },
        { rank: 3, from: '上海', to: '鄂尔多斯', date: '2026-01-26 周一', price: '¥410起', discount: '1.4折', imgSrc: col2item3 },
        { rank: 4, from: '上海', to: '满洲里', date: '2026-03-02 周一', price: '¥429起', discount: '1.1折', imgSrc: col2item4 },
        { rank: 5, from: '上海', to: '乌鲁木齐', date: '2026-03-11 周三', price: '¥520起', discount: '2.1折', imgSrc: col2item5 },
      ],
    },
    {
      key: 'seaside',
      title: '海边浪一浪',
      theme: 'blue',
      items: [
        { rank: 1, from: '上海', to: '厦门', date: '2026-03-05 周四', price: '¥200起', discount: '1.1折', imgSrc: col3item1 },
        { rank: 2, from: '上海', to: '大连', date: '2026-03-03 周二', price: '¥200起', discount: '1.3折', imgSrc: col3item2 },
        { rank: 3, from: '上海', to: '青岛', date: '2026-01-21 周日', price: '¥274起', discount: '2折', imgSrc: col3item3 },
        { rank: 4, from: '上海', to: '福州', date: '2026-03-02 周一', price: '¥300起', discount: '2.1折', imgSrc: col3item4 },
        { rank: 5, from: '上海', to: '日照', date: '2026-01-25 周日', price: '¥300起', discount: '4折', imgSrc: col3item5 },
      ],
    },
  ];

  const handleSearch = (payload) => {
    const trip = payload?.tripType || 'oneway'
    const fromCode = payload?.from?.cityCode || payload?.from?.airportCode || parseCode(payload?.fromCity) || 'SHA'
    const toCode = payload?.to?.cityCode || payload?.to?.airportCode || parseCode(payload?.toCity) || 'BJS'
    const departDate = payload?.departDate || todayString()
    const params = new URLSearchParams({
      trip,
      from: fromCode,
      to: toCode,
      departDate,
      adults: '1',
      children: '0',
      infants: '0',
      cabin: 'economy',
      directOnly: 'false'
    })

    if (trip === 'round') {
      const ret = payload?.returnDate || addDaysISO(departDate, 1)
      params.set('returnDate', ret)
      params.set('leg', 'go')
    }

    navigate(`/flights/results?${params.toString()}`)
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
            <div className={styles.searchAdWrap}>
              <FlightsSearchCard onSearch={handleSearch} />
              <div className={styles.adBanner}>
                <img className={styles.adBannerImage} src={mainAd} alt="广告位" />
              </div>

              <section className={styles.lowFareSection}>
                <div className={styles.lowFareHeader}>
                  <div className={styles.lowFareTitle}>低价速报</div>
                  <div className={styles.lowFareFrom}>
                    <span className={styles.lowFareFromLabel}>出发地:</span>
                    <input className={styles.lowFareFromInput} placeholder="请输入出发地" />
                  </div>
                  <div className={styles.lowFareMore}>更多目的地 &gt;</div>
                </div>

                <div className={styles.lowFareGrid}>
                  {lowFareColumns.map((col) => (
                    <div key={col.key} className={`${styles.lowFareCard} ${styles[`lowFareCard_${col.theme}`]}`}>
                      <div className={styles.lowFareCardHead}>
                        <div className={styles.lowFareCardHeadTitle}>{col.title}</div>
                        <div className={styles.lowFareCardHeadArrow} aria-hidden="true">&gt;</div>
                      </div>
                      <div className={styles.lowFareCardBody}>
                        {col.items.map((it) => (
                          <div key={`${col.key}-${it.rank}-${it.to}`} className={styles.lowFareRow}>
                            <div className={`${styles.lowFareRank} ${it.rank >= 4 ? styles.lowFareRankMuted : ''}`}>{it.rank}</div>
                            <img
                              className={styles.lowFareThumb}
                              src={it.imgSrc || columnThumbs?.[col.key]?.[it.rank - 1]}
                              alt={String(it.to || '')}
                            />
                            <div className={styles.lowFareInfo}>
                              <div className={styles.lowFareRoute}>上海⇆{it.to}</div>
                            </div>
                            <div className={styles.lowFarePriceBox}>
                              <div className={styles.lowFarePrice}>{it.price}</div>
                              <div className={styles.lowFareDiscount}>{it.discount}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

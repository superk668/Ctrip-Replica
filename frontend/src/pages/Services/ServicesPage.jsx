import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ServicesPage.module.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const ServicesPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem('bookingSelection')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [passenger, setPassenger] = useState(() => {
    try {
      const raw = sessionStorage.getItem('passengerInfo')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  useEffect(() => {
    try { sessionStorage.setItem('bookingStage', '2') } catch(_) {}
  }, [])
  if (!data) return (
    <div className={styles.container}><Header /><main className={styles.main}><div className={styles.empty}>暂无数据</div></main><Footer /></div>
  )
  const { flight, package: pkg } = data
  const surcharges = { service: 48, build: 50, fuel: 20 }
  const total = (pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel

  const SummaryCard = () => (
    <div className={styles.sideCard}>
      <div className={styles.sideHead}>
        <div className={styles.sideTitle}>11-25 周二  {flight?.from?.city} → {flight?.to?.city}</div>
        <div className={styles.sideSub}>经济舱</div>
      </div>
      <div className={styles.timeRow}>
        <div>
          <div className={styles.bigTime}>{flight?.from?.time}</div>
          <div className={styles.airport}>大兴国际机场</div>
        </div>
        <div className={styles.flightAxis}>↔</div>
        <div>
          <div className={styles.bigTime}>{flight?.to?.time}</div>
          <div className={styles.airport}>浦东国际机场T1</div>
        </div>
      </div>
      <div className={styles.listBlock}>
        <div className={styles.sumRow}><span className={styles.link}>成人套餐</span><span className={styles.price}>¥{pkg?.price}</span><span className={styles.count}>x 1</span></div>
        <div className={styles.sumRow}><span className={styles.link}>金牌服务包</span><span className={styles.price}>¥{surcharges.service}</span><span className={styles.count}>x 1</span></div>
        <div className={styles.sumRow}><span>机建</span><span className={styles.price}>¥{surcharges.build}</span><span className={styles.count}>x 1</span></div>
        <div className={styles.sumRow}><span>燃油税</span><span className={styles.price}>¥{surcharges.fuel}</span><span className={styles.count}>x 1</span></div>
      </div>
      <div className={styles.giftLabel}>赠品 订票即享</div>
      <div className={styles.giftItem}>租车92折优惠券 <span className={styles.free}>免费</span></div>
      <div className={styles.giftItem}>赠接送机最高8折券 <span className={styles.free}>免费</span></div>
      <div className={styles.totalWrap}><span className={styles.total}>¥{total}</span></div>
    </div>
  )

  const InsuranceIllustration = () => (
    <svg className={styles.illustration} viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="160" fill="#eef5ff" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#7aa6e8" fontSize="14">占位 保险插图</text>
    </svg>
  )

  const InsuranceCard = ({ title, desc, price }) => (
    <div className={styles.insCard}>
      <div className={styles.insHeader}>
        <span className={styles.insTitle}>{title}</span>
        <span className={styles.insPrice}>{price}</span>
      </div>
      <div className={styles.insDesc}>{desc}</div>
      <button className={styles.addBtn}>添加保障</button>
    </div>
  )

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.grid}> 
          <div>
            <div className={styles.topBar}>
              <div className={styles.userBadge}>
                {(() => {
                  const name = passenger?.name || '乘机人'
                  const idt = passenger?.idType || '身份证'
                  const idn = String(passenger?.idNumber || '').replace(/\s+/g,'')
                  const idfmt = idn.length===18 ? `${idn.slice(0,6)} ${idn.slice(6,10)} ${idn.slice(10,14)} ${idn.slice(14)}` : idn
                  return `1 成人  ${name}  ${idt} ${idfmt}`
                })()}
              </div>
              <div className={styles.contact}>
                {(() => {
                  const cc = passenger?.contactCountryCode || '中国 86'
                  const code = (cc.match(/\d+/)?.[0] || '86')
                  const ph = passenger?.contactPhone || ''
                  return `联系人  (+${code})${ph}`
                })()}
              </div>
            </div>
            <section className={styles.panel}>
              <div className={styles.panelTitle}>为行程添加保障</div>
              <div className={styles.panelSub}>出行有保险，家人更放心</div>
              <div className={styles.insLayout}>
                <div className={styles.insLeft}><InsuranceIllustration /></div>
                <div className={styles.insRight}>
                  <InsuranceCard title="航意航延组合险" desc="意外保障高至350万，延误最高赔300，返航/备降赔100" price="¥40/人" />
                  <InsuranceCard title="航空意外险" desc="航空意外保额高达500万，含意外医疗、行李损失等保障" price="¥39/人" />
                  <InsuranceCard title="国内旅行险" desc="保2天，最高保额180万，含航意险及旅行保障" price="¥75/人" />
                </div>
              </div>
              <div className={styles.checkRow}><input type="checkbox" /> 我不需要额外保障</div>
            </section>
          </div>
          <div>
            <SummaryCard />
          </div>
        </div>
        <div className={styles.actionRow}>
          <div className={styles.actionCard}>
            <button className={styles.nextBtn} onClick={() => { try { sessionStorage.setItem('bookingStage','3') } catch(_) {}; navigate('/booking/payment') }}>下一步</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage

import React, { useEffect, useState } from 'react'
import styles from './CompletePage.module.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const CompletePage = () => {
  const [data, setData] = useState(() => {
    try { const cached = sessionStorage.getItem('bookingSelection'); return cached ? JSON.parse(cached) : null } catch { return null }
  })
  useEffect(() => { try { sessionStorage.setItem('bookingStage', '4') } catch(_) {} }, [])
  const { flight, package: pkg } = data || {}
  const surcharges = { service: 48, build: 50, fuel: 20 }
  const total = ((pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel).toFixed(0)
  const [passenger, setPassenger] = useState(() => {
    try {
      const raw = sessionStorage.getItem('passengerInfo')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const idFormatted = (() => {
    const idn = String(passenger?.idNumber || '').replace(/\s+/g,'')
    if (idn.length === 18) return `${idn.slice(0,6)} ${idn.slice(6,10)} ${idn.slice(10,14)} ${idn.slice(14)}`
    return idn
  })()
  const contactLabel = (() => {
    const cc = passenger?.contactCountryCode || '中国 86'
    const code = (cc.match(/\d+/)?.[0] || '86')
    const ph = passenger?.contactPhone || ''
    return `(+${code})${ph}`
  })()

  useEffect(() => {
    const run = async () => {
      try {
        if (!data || !passenger) return
        try { const lock = sessionStorage.getItem('orderCreateLock'); if (lock) return; sessionStorage.setItem('orderCreateLock','1') } catch(_) {}
        const exist = sessionStorage.getItem('createdOrderId')
        if (exist) return
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
        let phone
        try { const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null; phone = u ? JSON.parse(u)?.phone : undefined } catch(_) {}
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`
        if (phone) headers['x-user-phone'] = String(phone)
        const dstr = new Date().toISOString().slice(0,10)
        const departISO = `${dstr}T${(flight?.from?.time||'00:00')}:00`
        const arriveISO = `${dstr}T${(flight?.to?.time||'00:00')}:00`
        const productTitle = `单程机票 ${flight?.from?.city||''} → ${flight?.to?.city||''}`
        const idn = String(passenger?.idNumber || '')
        const idMasked = idn.length>=8 ? `${idn.slice(0,4)}****${idn.slice(-4)}` : idn.replace(/.(?=.{2})/g,'*')
        const travelerInfo = [{ name: passenger?.name || '', idMasked }]
        const cc = passenger?.contactCountryCode || '中国 86'
        const code = (cc.match(/\d+/)?.[0] || '86')
        const contactInfo = { phone: `+${code}${passenger?.contactPhone || ''}` }
        const priceDetails = { items: [
          { label: '成人套餐', price: Number(pkg?.price || 0), count: 1 },
          { label: '金牌服务包', price: surcharges.service, count: 1 },
          { label: '机建', price: surcharges.build, count: 1 },
          { label: '燃油税', price: surcharges.fuel, count: 1 }
        ], total: Number(total) }
        const productInfo = { type: 'flight', title: productTitle, departCity: flight?.from?.city, arriveCity: flight?.to?.city, departTime: departISO, arriveTime: arriveISO, seatType: '经济舱', number: flight?.flightNo || '' }
        const payload = { productType: 'flight', productTitle, totalAmount: Number(total), productInfo, travelerInfo, contactInfo, priceDetails }
        const res = await fetch('/api/orders/create', { method: 'POST', headers, body: JSON.stringify(payload) })
        if (res.ok) {
          const j = await res.json()
          try { sessionStorage.setItem('createdOrderId', j.orderId) } catch(_) {}
        }
      } catch (_) {}
      finally { try { sessionStorage.removeItem('orderCreateLock') } catch(_) {} }
    }
    run()
  }, [data, passenger])

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.centerWrap}>
          <div className={styles.orderCard}>
            <div className={styles.title}>订单信息</div>
            <div className={styles.amount}>¥{total}</div>
            {(() => {
              const fromCity = (flight?.from?.city || '').trim()
              const toCity = (flight?.to?.city || '').trim()
              return fromCity && toCity ? (
                <div className={styles.route}>{fromCity} → {toCity}</div>
              ) : null
            })()}
            <div className={styles.timeRow}>
              <div>
                <div className={styles.bigTime}>{flight?.from?.time || '20:50'}</div>
                <div className={styles.airport}>{flight?.from?.airport || '大兴国际机场'}</div>
              </div>
              <div className={styles.axis}>→</div>
              <div>
                <div className={styles.bigTime}>{flight?.to?.time || '22:55'}</div>
                <div className={styles.airport}>{flight?.to?.airport || '浦东国际机场T1'}</div>
              </div>
            </div>
            <div className={styles.infoRow}>乘机人：{passenger?.name || '乘机人'} · {passenger?.idType || '证件'} {idFormatted}{passenger?.passengerPhone ? ` · 手机 (+${(passenger?.countryCode||'中国 86').match(/\d+/)?.[0]||'86'})${passenger?.passengerPhone}` : ''}</div>
            <div className={styles.infoRow}>联系人：{contactLabel}</div>
            <div className={styles.summaryList}>
              <div className={styles.sumRow}><div className={styles.sumName}>成人套餐</div><div className={styles.sumPrice}>¥{Number(pkg?.price || 0)}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>金牌服务包</div><div className={styles.sumPrice}>¥{surcharges.service}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>机建</div><div className={styles.sumPrice}>¥{surcharges.build}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>燃油税</div><div className={styles.sumPrice}>¥{surcharges.fuel}</div><div className={styles.sumCount}>x 1</div></div>
            </div>
            <div className={styles.giftRow}>赠品 订票即享</div>
            <div className={styles.giftItem}>租车92折优惠券 <span className={styles.free}>免费</span></div>
            <div className={styles.giftItem}>赠接送机最高8折券 <span className={styles.free}>免费</span></div>
          </div>
          <div className={styles.successText}>成功出票</div>
          <a className={styles.homeBtn} href="/home">返回首页</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CompletePage

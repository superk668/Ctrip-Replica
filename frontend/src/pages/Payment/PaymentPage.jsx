import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PaymentPage.module.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const PaymentPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(() => {
    try { const cached = sessionStorage.getItem('bookingSelection'); return cached ? JSON.parse(cached) : null } catch { return null }
  })
  const [orderData, setOrderData] = useState(null)
  const [loadingOrder, setLoadingOrder] = useState(true)

  useEffect(() => { 
    try { sessionStorage.setItem('bookingStage', '3') } catch(_) {} 
    
    // Fetch order details
    const fetchOrder = async () => {
      const oid = sessionStorage.getItem('createdOrderId')
      if (!oid) { setLoadingOrder(false); return }
      try {
        const token = localStorage.getItem('token')
        const headers = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
        let phone
        try { const u = localStorage.getItem('user'); phone = u ? JSON.parse(u)?.phone : undefined } catch(_) {}
        if (phone) headers['x-user-phone'] = String(phone)
        
        const res = await fetch(`/api/orders/${oid}`, { headers })
        if (res.ok) {
          const j = await res.json()
          setOrderData(j)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingOrder(false)
      }
    }
    fetchOrder()
  }, [])

  const [remainMs, setRemainMs] = useState(() => {
    try {
      const key = 'paymentCountdownStartAt'
      const v = sessionStorage.getItem(key)
      const now = Date.now()
      const start = v ? Number(v) : NaN
      const total = 15 * 60 * 1000
      if (!Number.isFinite(start) || now - start > total || start > now) {
        sessionStorage.setItem(key, String(now))
        return total
      }
      return Math.max(0, total - (now - start))
    } catch { return 15 * 60 * 1000 }
  })
  useEffect(() => {
    const key = 'paymentCountdownStartAt'
    const tick = () => {
      try {
        const v = sessionStorage.getItem(key)
        const start = v ? Number(v) : Date.now()
        const now = Date.now()
        const total = 15 * 60 * 1000
        const rest = Math.max(0, total - (now - start))
        setRemainMs(rest)
      } catch {
        setRemainMs(ms => Math.max(0, ms - 1000))
      }
    }
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])
  const fmt = (ms) => {
    const s = Math.floor(ms / 1000)
    const hh = String(Math.floor(s / 3600)).padStart(2, '0')
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }
  const computeDeadlineLabel = () => {
    try {
      const v = sessionStorage.getItem('paymentCountdownStartAt')
      const start = v ? Number(v) : Date.now()
      const d = new Date(start + 15 * 60 * 1000)
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    } catch {
      const d = new Date(Date.now() + 15 * 60 * 1000)
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    }
  }
  const [deadlineLabel, setDeadlineLabel] = useState(computeDeadlineLabel())
  useEffect(() => {
    setDeadlineLabel(computeDeadlineLabel())
  }, [remainMs])
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    if (remainMs <= 0 && !expired) setExpired(true)
  }, [remainMs])

  if (!data && !orderData) return (
    <div className={styles.container}><Header /><main className={styles.main}><div className={styles.empty}>暂无支付数据</div></main><Footer /></div>
  )
  
  // Calculate total and get passenger info
  let total = 0
  let passengerList = []
  
  if (orderData) {
    total = Number(orderData.priceDetails?.total || orderData.totalAmount || 0)
    passengerList = orderData.travelerInfo || []
  } else {
    // Fallback if order fetch fails or pending
    const { package: pkg } = data || {}
    const surcharges = { service: 48, build: 50, fuel: 20 }
    let count = 1
    try {
        const passengerInfo = JSON.parse(sessionStorage.getItem('passengerInfo'))
        if (passengerInfo?.passengerList) count = passengerInfo.passengerList.length
    } catch(e) {}
    total = ((pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel) * count
    
    // Try to get passenger names for fallback display
    try {
        const passengerInfo = JSON.parse(sessionStorage.getItem('passengerInfo'))
        passengerList = passengerInfo?.passengerList || (passengerInfo ? [passengerInfo] : [])
    } catch(e) {}
  }
  
  const { flight } = data || {}
  const displayFlight = orderData?.productInfo ? {
    from: { city: orderData.productInfo.departCity, time: orderData.productInfo.departTime?.slice(11,16) },
    to: { city: orderData.productInfo.arriveCity },
    model: '机型',
    flightNo: orderData.productInfo.number
  } : flight


  const [method, setMethod] = useState('saved')
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const payLabel = method === 'new' ? '新卡支付' : '银行卡支付'
  
  const handlePay = async () => {
      const oid = sessionStorage.getItem('createdOrderId')
      if (oid) {
          try {
              const token = localStorage.getItem('token')
              const headers = { 'Content-Type': 'application/json' }
              if (token) headers['Authorization'] = `Bearer ${token}`
              let phone
              try { const u = localStorage.getItem('user'); phone = u ? JSON.parse(u)?.phone : undefined } catch(_) {}
              if (phone) headers['x-user-phone'] = String(phone)
              
              await fetch(`/api/orders/${oid}/pay`, { 
                  method: 'POST', 
                  headers,
                  body: JSON.stringify({ method })
              })
          } catch(e) {
              console.error(e)
          }
      }
      try { sessionStorage.setItem('bookingStage','4') } catch(_) {}
      navigate('/booking/complete')
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.wrap}>
          <div className={styles.pageTitle}>安全支付</div>

          <section className={styles.summaryCard}>
            <div className={styles.amountRow}>
              <div>订单金额 <span className={styles.amount}>¥{total.toFixed(0)}</span></div>
              <div className={styles.countdown}>剩余时间: <span className={styles.countdownNum}>{fmt(remainMs)}</span>，超时订单可能会被取消</div>
            </div>
            <div className={styles.orderText}>
              单程机票 {displayFlight?.from?.city} → {displayFlight?.to?.city}
            </div>
            <div className={styles.orderSub}>飞机 {displayFlight?.model || '波音737'} · 出发时间: {new Date().toISOString().slice(0,10)} {displayFlight?.from?.time}</div>
            
            {passengerList.map((p, i) => (
                <div key={i} className={styles.orderSub}>
                    乘机人: {p.name} 乘机证件: {p.idMasked || (p.idNumber||'').replace(/.(?=.{2})/g,'*')}
                </div>
            ))}
            
            <div className={styles.warnBar}>机票价格按动态报价，请在{deadlineLabel}前完成付款</div>
          </section>

          <section className={styles.methodCard}>
            <div className={`${styles.optionRow} ${method==='saved'?styles.optionActive:''}`} onClick={()=>setMethod('saved')}>
              <div className={method==='saved'?styles.radioActive:styles.radio} />
              <div className={styles.bankIcon}>占位</div>
              <div className={styles.optionText}>中国银行储蓄卡(9532)</div>
            </div>
            <div className={`${styles.optionRow} ${method==='new'?styles.optionActive:''}`} onClick={()=>setMethod('new')}>
              <div className={method==='new'?styles.radioActive:styles.radio} />
              <div className={styles.optionText}>使用新卡支付</div>
            </div>
            {method==='new' && (
              <div className={styles.newCardForm}>
                <div className={styles.formGridFirst}>
                  <input className={styles.input} placeholder="卡号" value={newCard.number} onChange={e=>setNewCard({...newCard, number: e.target.value})} />
                </div>
                <div className={styles.formGrid}>
                  <input className={styles.input} placeholder="持卡人姓名" value={newCard.name} onChange={e=>setNewCard({...newCard, name: e.target.value})} />
                  <input className={styles.input} placeholder="有效期 MM/YY" value={newCard.expiry} onChange={e=>setNewCard({...newCard, expiry: e.target.value})} />
                  <input className={styles.input} placeholder="CVV" value={newCard.cvv} onChange={e=>setNewCard({...newCard, cvv: e.target.value})} />
                </div>
              </div>
            )}
            <button className={styles.payBtn} onClick={handlePay}>{payLabel} ¥{total.toFixed(0)}</button>
          </section>

          <section className={styles.alipayCard}>
            <div className={styles.alipayHead}>
              <div className={styles.alipayIcon}>占位</div>
              <div className={styles.alipayLabel}>支付宝</div>
              <div className={styles.moreLink}>更多支付方式 ▾</div>
            </div>
          </section>

          <div className={styles.pciWrap}>
            <div className={styles.pciIcon}>占位</div>
            <div className={styles.pciText}>符合支付卡安全标准 PCI DSS</div>
          </div>
          {expired && (
            <div className={styles.modalOverlay} role="dialog" aria-modal="true">
              <div className={styles.modalCard}>
                <div className={styles.modalTitle}>超出时间</div>
                <div className={styles.modalMessage}>请重新开始订单</div>
                <div className={styles.modalActions}>
                  <a href="/home" className={styles.primaryBtn}>返回首页</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PaymentPage

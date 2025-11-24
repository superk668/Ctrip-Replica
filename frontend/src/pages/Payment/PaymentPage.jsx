import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PaymentPage.module.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const PaymentPage = () => {
  const [data, setData] = useState(() => {
    try { const cached = sessionStorage.getItem('bookingSelection'); return cached ? JSON.parse(cached) : null } catch { return null }
  })
  useEffect(() => { try { sessionStorage.setItem('bookingStage', '3') } catch(_) {} }, [])
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
  if (!data) return (
    <div className={styles.container}><Header /><main className={styles.main}><div className={styles.empty}>暂无支付数据</div></main><Footer /></div>
  )
  const { flight, package: pkg } = data
  const surcharges = { service: 48, build: 50, fuel: 20 }
  const total = (pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel

  const navigate = useNavigate()
  const [method, setMethod] = useState('saved')
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const payLabel = method === 'new' ? '新卡支付' : '银行卡支付'
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
              单程机票 {flight?.from?.city} → {flight?.to?.city}
            </div>
            <div className={styles.orderSub}>飞机 {flight?.model || '波音737'} · 出发时间: {new Date().toISOString().slice(0,10)} {flight?.from?.time}</div>
            <div className={styles.orderSub}>乘机人: 刘旭航 乘机证件: 身份证360924200509010812</div>
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
            <button className={styles.payBtn} onClick={() => { try { sessionStorage.setItem('bookingStage','4') } catch(_) {}; navigate('/booking/complete') }}>{payLabel} ¥{total.toFixed(0)}</button>
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

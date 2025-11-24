import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BookingPage.module.css'
import GlobalHeader from '../../components/Header/Header'

const BookingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search])
  const flightId = qs.get('flight') || ''
  const pkgId = qs.get('pkg') || ''

  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem('bookingSelection')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })

  useEffect(() => {
    // 如果没有缓存且没有必要参数，回到航班列表
    if (!data || !data.flight || !data.package) {
      // 在带参数的情况下尝试轻量恢复
      if (flightId && pkgId) {
        try {
          const cached = sessionStorage.getItem('bookingSelection')
          if (cached) setData(JSON.parse(cached))
          else navigate('/flights/results')
        } catch {
          navigate('/flights/results')
        }
      } else {
        navigate('/flights/results')
      }
    }
  }, [flightId, pkgId])

  if (!data) return null
  const { flight, package: pkg } = data
  const surcharges = { service: 48, build: 50, fuel: 20 }
  const total = (pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel

  const [idType, setIdType] = useState('身份证')
  const [countryCode, setCountryCode] = useState('中国 86')
  const [passengerName, setPassengerName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [contactCountryCode, setContactCountryCode] = useState('中国 86')
  const [contactPhone, setContactPhone] = useState('')
  const [errName, setErrName] = useState('')
  const [errId, setErrId] = useState('')
  const [errPassengerPhone, setErrPassengerPhone] = useState('')
  const [errContactPhone, setErrContactPhone] = useState('')

  useEffect(() => {
    // 顶栏进度默认为第 1 步：乘机信息
    try {
      sessionStorage.setItem('bookingStage', '1')
      sessionStorage.removeItem('createdOrderId')
      sessionStorage.removeItem('orderCreateLock')
    } catch (_) {}
  }, [])

  // 将购票进度移至全局 Header 顶栏中显示，避免页面内重复显示

  const isValidChineseID = (id) => {
    const s = String(id || '').toUpperCase()
    if (!/^\d{17}[\dX]$/.test(s)) return false
    const w = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
    const m = '10X98765432'
    let sum = 0
    for (let i = 0; i < 17; i++) sum += Number(s[i]) * w[i]
    const code = m[sum % 11]
    if (s[17] !== code) return false
    const y = Number(s.slice(6,10)), mo = Number(s.slice(10,12)), d = Number(s.slice(12,14))
    if (y < 1900 || mo < 1 || mo > 12 || d < 1 || d > 31) return false
    return true
  }
  const isValidPhone = (cc, p) => {
    const s = String(p || '').trim()
    if (!s) return false
    if ((cc || '').includes('中国 86')) return /^1[3-9]\d{9}$/.test(s)
    return /^\d{6,15}$/.test(s)
  }
  const validateAndProceed = () => {
    const nameOk = !!String(passengerName || '').trim()
    const idOk = idType === '身份证' ? isValidChineseID(idNumber) : !!String(idNumber || '').trim()
    const contactOk = isValidPhone(contactCountryCode, contactPhone)
    const passengerOk = passengerPhone ? isValidPhone(countryCode, passengerPhone) : true
    setErrName(nameOk ? '' : '请输入乘机人姓名')
    setErrId(idOk ? '' : '证件号码格式不正确')
    setErrContactPhone(contactOk ? '' : '联系人手机号格式不正确')
    setErrPassengerPhone(passengerOk ? '' : '乘机人手机号格式不正确')
    if (nameOk && idOk && contactOk && passengerOk) {
      try {
        const payload = {
          name: passengerName,
          idType,
          idNumber,
          countryCode,
          passengerPhone,
          contactCountryCode,
          contactPhone,
        }
        sessionStorage.setItem('passengerInfo', JSON.stringify(payload))
      } catch(_) {}
      try { sessionStorage.setItem('bookingStage', '2') } catch(_) {}
      navigate('/booking/services')
    }
  }

  

  return (
    <div>
      <GlobalHeader />
      <main className={styles.container}>
      <div className={styles.grid}>
        <div>
          {/* 顶部提示 */}
          <div className={styles.card}>
            <div className={styles.hint}>部分改签/退票需联系供应商办理；政策以航空公司为准。</div>
          </div>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>乘机人</div>
            <div className={styles.passengerGrid}>
              <input className={`${styles.input} ${styles.fullRow} ${errName?styles.invalid:''}`} placeholder="姓名" value={passengerName} onChange={e=>setPassengerName(e.target.value)} />
              <select value={idType} onChange={e=>setIdType(e.target.value)} className={styles.select}>
                <option>身份证</option>
                <option>护照</option>
                <option>港澳通行证</option>
                <option>台湾通行证</option>
              </select>
              <input className={`${styles.input} ${errId?styles.invalid:''}`} placeholder="登机证件号码" value={idNumber} onChange={e=>setIdNumber(e.target.value)} />
              <select value={countryCode} onChange={e=>setCountryCode(e.target.value)} className={styles.select}>
                <option>中国 86</option>
                <option>中国香港 852</option>
                <option>中国台湾 886</option>
                <option>美国 1</option>
              </select>
              <input className={`${styles.input} ${errPassengerPhone?styles.invalid:''}`} placeholder="乘机人手机号码（选填）" value={passengerPhone} onChange={e=>setPassengerPhone(e.target.value)} />
            </div>
            {errName && <div className={styles.errorText}>{errName}</div>}
            {errId && <div className={styles.errorText}>{errId}</div>}
            {errPassengerPhone && <div className={styles.errorText}>{errPassengerPhone}</div>}
            <div className={styles.checkboxRow}><input type="checkbox" /> 常旅客卡</div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionTitle}>联系人</div>
            <div className={styles.passengerGrid}>
              <select className={styles.select} value={contactCountryCode} onChange={e=>setContactCountryCode(e.target.value)}>
                <option>中国 86</option>
                <option>中国香港 852</option>
                <option>中国台湾 886</option>
                <option>美国 1</option>
              </select>
              <input className={`${styles.input} ${errContactPhone?styles.invalid:''}`} placeholder="手机号，接收航变信息" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} />
            </div>
            {errContactPhone && <div className={styles.errorText}>{errContactPhone}</div>}
          </div>
          <div className={styles.card} style={{textAlign:'center'}}>
            <button className={styles.nextBtn} onClick={validateAndProceed}>下一步</button>
          </div>
        </div>
        <div>
          <div className={styles.card}>
            <div className={styles.summaryHeader}>
              <div className={styles.flightTitle}>{flight?.from?.code} → {flight?.to?.code}</div>
              <div>经济舱</div>
            </div>
            <div className={styles.timeBlock}>
              <div>
                <div style={{fontSize:'24px', fontWeight:700}}>{flight?.from?.time}</div>
                <div className={styles.airport}>{flight?.from?.airport}国际机场 {flight?.from?.terminal}</div>
              </div>
              <div>→</div>
              <div>
                <div style={{fontSize:'24px', fontWeight:700}}>{flight?.to?.time}</div>
                <div className={styles.airport}>{flight?.to?.airport}国际机场 {flight?.to?.terminal}</div>
              </div>
            </div>
            <div className={styles.summaryList}>
              <div className={styles.sumRow}><div className={styles.sumName}>成人</div><div className={styles.sumPrice}>¥{pkg?.price}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>金牌服务包</div><div className={styles.sumPrice}>¥{surcharges.service}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>机建</div><div className={styles.sumPrice}>¥{surcharges.build}</div><div className={styles.sumCount}>x 1</div></div>
              <div className={styles.sumRow}><div className={styles.sumName}>燃油税</div><div className={styles.sumPrice}>¥{surcharges.fuel}</div><div className={styles.sumCount}>x 1</div></div>
            </div>
            <div className={styles.giftRow}>赠品 订票即享：租车92折优惠券 / 嫌接送机最高8折券</div>
            <div className={styles.totalRow}><span className={styles.totalText}>合计</span><span className={styles.totalPrice}>¥{total}</span></div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}

export default BookingPage

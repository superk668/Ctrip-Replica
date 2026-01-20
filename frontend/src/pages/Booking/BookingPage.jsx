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
    const hasSingle = !!(data && data.flight && data.package)
    const hasJoint = !!(data && data.joint && data.legs && data.legs.go && data.legs.back && data.legs.go.flight && data.legs.go.package && data.legs.back.flight && data.legs.back.package)
    if (!data || (!hasSingle && !hasJoint)) {
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

  const isJoint = !!(data && data.joint && data.legs && data.legs.go && data.legs.back)
  const legs = isJoint
    ? [
      { key: 'go', label: '去程', flight: data.legs.go.flight, pkg: data.legs.go.package },
      { key: 'back', label: '返程', flight: data.legs.back.flight, pkg: data.legs.back.package }
    ]
    : [{ key: 'go', label: '去程', flight: data.flight, pkg: data.package }]

  const primaryFlight = legs[0]?.flight
  const primaryPkg = legs[0]?.pkg
  const surcharges = { service: 48, build: 50, fuel: 20 }

  const [passengerList, setPassengerList] = useState([{
    id: 'p-' + Math.random().toString(36).slice(2),
    name: '',
    idType: '身份证',
    idNumber: '',
    countryCode: '中国 86',
    passengerPhone: '',
    errors: {}
  }])
  const [selectedTravelerIds, setSelectedTravelerIds] = useState([])
  const [contactCountryCode, setContactCountryCode] = useState('中国 86')
  const [contactPhone, setContactPhone] = useState('')
  const [errContactPhone, setErrContactPhone] = useState('')

  // New: Fetch frequent travelers
  const [frequentTravelers, setFrequentTravelers] = useState([])
  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const res = await fetch('/api/users/me/travelers', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const j = await res.json()
        if (j.success && Array.isArray(j.data?.items)) {
          setFrequentTravelers(j.data.items)
        }
      } catch (_) {}
    }
    fetchTravelers()
  }, [])

  const handleTravelerCheck = (t, checked) => {
    if (checked) {
      setSelectedTravelerIds(prev => [...prev, t.id])
      
      // Logic: If there is a completely empty unfilled form (name & id empty), fill it.
      // Otherwise add new form.
      const emptyIndex = passengerList.findIndex(p => !p.name && !p.idNumber)
      
      const newPassengerData = {
        name: t.name || '',
        idType: (['身份证', '护照', '港澳通行证', '台湾通行证'].includes(t.document?.type) ? t.document?.type : '身份证'),
        idNumber: t.document?.no || '',
        countryCode: '中国 86',
        passengerPhone: t.phone || '', // Fill phone if available
        errors: {},
        sourceTravelerId: t.id
      }

      if (emptyIndex !== -1) {
        setPassengerList(prev => {
          const next = [...prev]
          next[emptyIndex] = { ...next[emptyIndex], ...newPassengerData }
          return next
        })
      } else {
        setPassengerList(prev => [...prev, {
          id: 'p-' + Math.random().toString(36).slice(2),
          ...newPassengerData
        }])
      }
    } else {
      setSelectedTravelerIds(prev => prev.filter(id => id !== t.id))
      // Remove form linked to this traveler
      setPassengerList(prev => {
        // Find if any passenger is linked to this traveler
        const idx = prev.findIndex(p => p.sourceTravelerId === t.id)
        if (idx !== -1) {
          // If found, remove it. BUT if it's the only one, maybe clear it instead?
          // User requirement implies "clicking checkbox... fills data". Uncheck implies removal.
          // If it's the only form, we probably shouldn't remove it completely to leave at least one form?
          // But usually "uncheck" means "I don't want this person".
          // If list becomes empty, we should probably add a blank one.
          const next = prev.filter((_, i) => i !== idx)
          if (next.length === 0) {
            return [{
              id: 'p-' + Math.random().toString(36).slice(2),
              name: '',
              idType: '身份证',
              idNumber: '',
              countryCode: '中国 86',
              passengerPhone: '',
              errors: {}
            }]
          }
          return next
        }
        return prev
      })
    }
  }

  const updatePassenger = (index, field, value) => {
    setPassengerList(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      // Clear error if typing
      if (next[index].errors[field]) {
        next[index].errors = { ...next[index].errors }
        delete next[index].errors[field]
      }
      // If manual edit changes name/id, maybe unlink from sourceTravelerId?
      // For now, keep it simple.
      return next
    })
  }

  const addPassenger = () => {
    setPassengerList(prev => [...prev, {
      id: 'p-' + Math.random().toString(36).slice(2),
      name: '',
      idType: '身份证',
      idNumber: '',
      countryCode: '中国 86',
      passengerPhone: '',
      errors: {}
    }])
  }

  const removePassenger = (index) => {
    const p = passengerList[index]
    if (p.sourceTravelerId) {
      setSelectedTravelerIds(prev => prev.filter(id => id !== p.sourceTravelerId))
    }
    setPassengerList(prev => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) {
         return [{
          id: 'p-' + Math.random().toString(36).slice(2),
          name: '',
          idType: '身份证',
          idNumber: '',
          countryCode: '中国 86',
          passengerPhone: '',
          errors: {}
        }]
      }
      return next
    })
  }


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
  const validateAndProceed = async () => {
    let allValid = true
    const newPassengerList = passengerList.map(p => {
      const errors = {}
      if (!String(p.name || '').trim()) errors.name = '请输入乘机人姓名'
      
      const idOk = p.idType === '身份证' ? isValidChineseID(p.idNumber) : !!String(p.idNumber || '').trim()
      if (!idOk) errors.idNumber = '证件号码格式不正确'
      
      if (p.passengerPhone && !isValidPhone(p.countryCode, p.passengerPhone)) {
        errors.passengerPhone = '手机号格式不正确'
      }
      
      if (Object.keys(errors).length > 0) allValid = false
      return { ...p, errors }
    })
    
    setPassengerList(newPassengerList)

    const contactOk = isValidPhone(contactCountryCode, contactPhone)
    setErrContactPhone(contactOk ? '' : '联系人手机号格式不正确')
    if (!contactOk) allValid = false

    if (allValid) {
      try {
        const payload = {
            passengerList: newPassengerList.map(p => ({
                name: p.name,
                idType: p.idType,
                idNumber: p.idNumber,
                countryCode: p.countryCode,
                passengerPhone: p.passengerPhone
            })),
            contactCountryCode,
            contactPhone
        }
        sessionStorage.setItem('passengerInfo', JSON.stringify(payload))

        // Create Order with pending_payment status
        const token = localStorage.getItem('token')
        let phone
        try { const u = localStorage.getItem('user'); phone = u ? JSON.parse(u)?.phone : undefined } catch(_) {}
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`
        if (phone) headers['x-user-phone'] = String(phone)
        
        const dstr = new Date().toISOString().slice(0,10)
        const buildLegInfo = (f) => {
          const departISO = `${dstr}T${(f?.from?.time||'00:00')}:00`
          const arriveISO = `${dstr}T${(f?.to?.time||'00:00')}:00`
          return {
            departCity: f?.from?.city,
            arriveCity: f?.to?.city,
            departTime: departISO,
            arriveTime: arriveISO,
            seatType: '经济舱',
            number: f?.flightNo || ''
          }
        }

        const productTitle = isJoint
          ? `往返机票 ${primaryFlight?.from?.city||''} ↔ ${primaryFlight?.to?.city||''}`
          : `单程机票 ${primaryFlight?.from?.city||''} → ${primaryFlight?.to?.city||''}`
        
        const travelerInfo = newPassengerList.map(p => {
            const idn = String(p.idNumber || '')
            const idMasked = idn.length>=8 ? `${idn.slice(0,4)}****${idn.slice(-4)}` : idn.replace(/.(?=.{2})/g,'*')
            return { name: p.name, idMasked }
        })

        const cc = contactCountryCode || '中国 86'
        const code = (cc.match(/\d+/)?.[0] || '86')
        const contactInfo = { phone: `+${code}${contactPhone || ''}` }
        
        const count = newPassengerList.length
        const basePkgTotal = legs.reduce((sum, it) => sum + Number(it?.pkg?.price || 0), 0)
        const surchargeTotal = (surcharges.service + surcharges.build + surcharges.fuel) * legs.length
        const currentTotal = basePkgTotal * count + surchargeTotal * count

        const priceItems = []
        legs.forEach(it => {
          priceItems.push({ label: isJoint ? `成人套餐（${it.label}）` : '成人套餐', price: Number(it?.pkg?.price || 0), count })
          priceItems.push({ label: isJoint ? `金牌服务包（${it.label}）` : '金牌服务包', price: surcharges.service, count })
          priceItems.push({ label: isJoint ? `机建（${it.label}）` : '机建', price: surcharges.build, count })
          priceItems.push({ label: isJoint ? `燃油税（${it.label}）` : '燃油税', price: surcharges.fuel, count })
        })

        const priceDetails = { items: priceItems, total: Number(currentTotal) }

        const legInfos = legs.map(it => buildLegInfo(it.flight))
        const productInfo = {
          type: 'flight',
          tripType: isJoint ? 'round' : 'oneway',
          title: productTitle,
          departCity: legInfos[0]?.departCity,
          arriveCity: legInfos[0]?.arriveCity,
          departTime: legInfos[0]?.departTime,
          arriveTime: legInfos[0]?.arriveTime,
          seatType: '经济舱',
          number: legInfos[0]?.number,
          legs: isJoint ? legInfos : undefined
        }
        
        const orderPayload = { 
            productType: 'flight', 
            productTitle, 
            totalAmount: Number(currentTotal), 
            productInfo, 
            travelerInfo, 
            contactInfo, 
            priceDetails,
            status: 'pending_payment'
        }
        
        const res = await fetch('/api/orders/create', { method: 'POST', headers, body: JSON.stringify(orderPayload) })
        if (res.ok) {
          const j = await res.json()
          sessionStorage.setItem('createdOrderId', j.orderId)
        }
      } catch(e) {
        console.error('Order creation failed:', e)
      }
      try { sessionStorage.setItem('bookingStage', '2') } catch(_) {}
      navigate('/booking/services')
    }
  }

  const passengerCount = passengerList.length
  const basePkgTotal = legs.reduce((sum, it) => sum + Number(it?.pkg?.price || 0), 0)
  const surchargeTotal = (surcharges.service + surcharges.build + surcharges.fuel) * legs.length
  const currentTotal = basePkgTotal * passengerCount + surchargeTotal * passengerCount

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
            
            {/* 常用旅客复选框 */}
            {frequentTravelers.length > 0 && (
              <div className={styles.frequentTravelerBar}>
                {frequentTravelers.map(t => (
                  <label key={t.id} className={styles.ftCheckbox}>
                    <input 
                      type="checkbox" 
                      checked={selectedTravelerIds.includes(t.id)}
                      onChange={(e) => handleTravelerCheck(t, e.target.checked)}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            )}

            {/* 乘机人表单列表 */}
            {passengerList.map((p, index) => (
              <div key={p.id} className={styles.passengerCard}>
                <div className={styles.passengerIndex}>{index + 1}</div>
                <div className={styles.passengerForm}>
                  <div className={styles.formHeader}>
                    <div style={{fontWeight:600}}>成人票</div>
                    <button className={styles.deleteBtn} onClick={() => removePassenger(index)}>
                      删除
                    </button>
                  </div>
                  
                  <div className={styles.passengerGrid}>
                    <div className={styles.fullRow}>
                        <input 
                            className={`${styles.input} ${p.errors.name ? styles.invalid : ''}`} 
                            placeholder="姓名，请与证件保持一致" 
                            value={p.name} 
                            onChange={e => updatePassenger(index, 'name', e.target.value)} 
                        />
                        {p.errors.name && <div className={styles.errorText}>{p.errors.name}</div>}
                    </div>
                    
                    <div>
                        <select 
                            value={p.idType} 
                            onChange={e => updatePassenger(index, 'idType', e.target.value)} 
                            className={styles.select}
                        >
                            <option>身份证</option>
                            <option>护照</option>
                            <option>港澳通行证</option>
                            <option>台湾通行证</option>
                        </select>
                    </div>
                    
                    <div>
                        <input 
                            className={`${styles.input} ${p.errors.idNumber ? styles.invalid : ''}`} 
                            placeholder="证件号码" 
                            value={p.idNumber} 
                            onChange={e => updatePassenger(index, 'idNumber', e.target.value)} 
                        />
                        {p.errors.idNumber && <div className={styles.errorText}>{p.errors.idNumber}</div>}
                    </div>
                    
                    <div>
                        <select 
                            value={p.countryCode} 
                            onChange={e => updatePassenger(index, 'countryCode', e.target.value)} 
                            className={styles.select}
                        >
                            <option>中国 86</option>
                            <option>中国香港 852</option>
                            <option>中国台湾 886</option>
                            <option>美国 1</option>
                        </select>
                    </div>
                    
                    <div>
                        <input 
                            className={`${styles.input} ${p.errors.passengerPhone ? styles.invalid : ''}`} 
                            placeholder="手机号（选填）" 
                            value={p.passengerPhone} 
                            onChange={e => updatePassenger(index, 'passengerPhone', e.target.value)} 
                        />
                        {p.errors.passengerPhone && <div className={styles.errorText}>{p.errors.passengerPhone}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className={styles.addPassengerBtn} onClick={addPassenger}>
              + 新增乘机人
            </button>
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
              <div className={styles.flightTitle}>{primaryFlight?.from?.code} {isJoint ? '↔' : '→'} {primaryFlight?.to?.code}</div>
              <div>经济舱</div>
            </div>
            <div className={styles.timeBlock}>
              <div>
                <div style={{fontSize:'24px', fontWeight:700}}>{primaryFlight?.from?.time}</div>
                <div className={styles.airport}>{primaryFlight?.from?.airport}国际机场 {primaryFlight?.from?.terminal}</div>
              </div>
              <div>→</div>
              <div>
                <div style={{fontSize:'24px', fontWeight:700}}>{primaryFlight?.to?.time}</div>
                <div className={styles.airport}>{primaryFlight?.to?.airport}国际机场 {primaryFlight?.to?.terminal}</div>
              </div>
            </div>
            <div className={styles.summaryList}>
              {legs.map(it => (
                <div key={it.key} className={styles.sumRow}><div className={styles.sumName}>{`成人套餐（${it.label}）`}</div><div className={styles.sumPrice}>¥{it?.pkg?.price}</div><div className={styles.sumCount}>x {passengerCount}</div></div>
              ))}
              {legs.map(it => (
                <div key={`${it.key}-service`} className={styles.sumRow}><div className={styles.sumName}>{`金牌服务包（${it.label}）`}</div><div className={styles.sumPrice}>¥{surcharges.service}</div><div className={styles.sumCount}>x {passengerCount}</div></div>
              ))}
              {legs.map(it => (
                <div key={`${it.key}-build`} className={styles.sumRow}><div className={styles.sumName}>{`机建（${it.label}）`}</div><div className={styles.sumPrice}>¥{surcharges.build}</div><div className={styles.sumCount}>x {passengerCount}</div></div>
              ))}
              {legs.map(it => (
                <div key={`${it.key}-fuel`} className={styles.sumRow}><div className={styles.sumName}>{`燃油税（${it.label}）`}</div><div className={styles.sumPrice}>¥{surcharges.fuel}</div><div className={styles.sumCount}>x {passengerCount}</div></div>
              ))}
            </div>
            <div className={styles.giftRow}>赠品 订票即享：租车92折优惠券 / 嫌接送机最高8折券</div>
            <div className={styles.totalRow}><span className={styles.totalText}>合计</span><span className={styles.totalPrice}>¥{currentTotal}</span></div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}

export default BookingPage

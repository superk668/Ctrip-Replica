import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ServicesPage.module.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PromotionBanner from '../Home/LocalComponents/PromotionBanner'
import qrPng from '../../components/Footer/assets/login_qr_code.png'

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
  const [selectedInsurance, setSelectedInsurance] = useState(() => {
    try {
      const cached = sessionStorage.getItem('selectedInsurance')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [skipInsurance, setSkipInsurance] = useState(() => {
    try {
      const cached = sessionStorage.getItem('skipInsurance')
      return cached ? JSON.parse(cached) : false
    } catch { return false }
  })
  useEffect(() => {
    // 不再设置购票进度，以避免头部显示进度条
  }, [])
  const hubMode = true
  const flight = null
  const pkg = null
  
  // Validation functions
  const validateIdNumber = (idNumber, idType = '身份证') => {
    if (!idNumber) return false
    
    if (idType === '身份证') {
      // Basic 18-digit ID validation
      return /^\d{17}[\dXx]$/.test(idNumber.trim())
    }
    
    // For other ID types, basic length validation
    return idNumber.trim().length >= 6
  }

  const validatePhone = (phone) => {
    if (!phone) return false
    return /^1[3-9]\d{9}$/.test(phone.trim())
  }

  const passengerList = passenger?.passengerList || (passenger ? [passenger] : [])
  const passengerCount = passengerList.length || 1
  
  // Validate passenger data
  const validPassengers = passengerList.filter(p => {
    return p.name && validateIdNumber(p.idNumber, p.idType)
  })
  
  const hasValidPassengers = validPassengers.length > 0
  const hasValidContact = passenger?.contactPhone && validatePhone(passenger.contactPhone)
  
  const surcharges = { service: 48, build: 50, fuel: 20 }
  const total = ((pkg?.price || 0) + surcharges.service + surcharges.build + surcharges.fuel) * passengerCount

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
        <div className={styles.sumRow}><span className={styles.link}>成人套餐</span><span className={styles.price}>¥{pkg?.price}</span><span className={styles.count}>x {passengerCount}</span></div>
        <div className={styles.sumRow}><span className={styles.link}>金牌服务包</span><span className={styles.price}>¥{surcharges.service}</span><span className={styles.count}>x {passengerCount}</span></div>
        <div className={styles.sumRow}><span>机建</span><span className={styles.price}>¥{surcharges.build}</span><span className={styles.count}>x {passengerCount}</span></div>
        <div className={styles.sumRow}><span>燃油税</span><span className={styles.price}>¥{surcharges.fuel}</span><span className={styles.count}>x {passengerCount}</span></div>
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

  const handleInsuranceSelect = (insuranceType) => {
    const newSelection = selectedInsurance === insuranceType ? null : insuranceType
    setSelectedInsurance(newSelection)
    try {
      sessionStorage.setItem('selectedInsurance', JSON.stringify(newSelection))
    } catch (_) {}
  }

  const handleSkipInsuranceChange = (e) => {
    const skip = e.target.checked
    setSkipInsurance(skip)
    if (skip) {
      setSelectedInsurance(null)
    }
    try {
      sessionStorage.setItem('skipInsurance', JSON.stringify(skip))
      if (skip) {
        sessionStorage.removeItem('selectedInsurance')
      }
    } catch (_) {}
  }

  const InsuranceCard = ({ title, desc, price, type }) => {
    const isSelected = selectedInsurance === type
    return (
      <div className={`${styles.insCard} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.insHeader}>
          <span className={styles.insTitle}>{title}</span>
          <span className={styles.insPrice}>{price}</span>
        </div>
        <div className={styles.insDesc}>{desc}</div>
        <button 
          className={`${styles.addBtn} ${isSelected ? styles.selectedBtn : ''}`}
          onClick={() => handleInsuranceSelect(type)}
        >
          {isSelected ? '已选择' : '添加保障'}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {!hubMode && (
        <div className={styles.grid}> 
          <div>
            <div className={styles.topBar}>
              <div className={styles.userBadge}>
                {(() => {
                  if (passengerList.length > 0) {
                      const validPassengers = passengerList.filter(p => p.name && validateIdNumber(p.idNumber, p.idType))
                      const invalidPassengers = passengerList.filter(p => !p.name || !validateIdNumber(p.idNumber, p.idType))
                      const names = validPassengers.map(p => p.name).join(', ')
                      
                      if (invalidPassengers.length > 0) {
                        return (
                          <span className={styles.warningBadge}>
                            ⚠️ {validPassengers.length} 成人  {names}
                            {invalidPassengers.length > 0 && ` (${invalidPassengers.length} 人信息不完整)`}
                          </span>
                        )
                      }
                      
                      return `${validPassengers.length} 成人  ${names}`
                  }
                  const name = passenger?.name || '乘机人'
                  const idt = passenger?.idType || '身份证'
                  const idn = String(passenger?.idNumber || '').replace(/\s+/g,'')
                  
                  // Validate single passenger
                  const isValid = name && validateIdNumber(idn, idt)
                  
                  // Format ID number with proper masking for privacy
                  const formatIdNumber = (id) => {
                    if (id.length === 18) {
                      // Show first 6 and last 4 digits, mask middle 8
                      return `${id.slice(0,6)}********${id.slice(14)}`
                    } else if (id.length >= 8) {
                      // For other ID types, show first 3 and last 3, mask middle
                      return `${id.slice(0,3)}***${id.slice(-3)}`
                    }
                    return id
                  }
                  
                  const idfmt = idn ? formatIdNumber(idn) : '未填写证件号'
                  const displayText = `1 成人  ${name}  ${idt} ${idfmt}`
                  
                  return isValid ? displayText : <span className={styles.warningBadge}>⚠️ {displayText}</span>
                })()}
              </div>
              <div className={styles.contact}>
                {(() => {
                  const cc = passenger?.contactCountryCode || '中国 86'
                  const code = (cc.match(/\d+/)?.[0] || '86')
                  const ph = passenger?.contactPhone || ''
                  
                  // Validate phone number
                  const isValid = validatePhone(ph)
                  
                  // Format phone number with proper masking
                  const formatPhone = (phone) => {
                    if (phone.length === 11) {
                      // Show first 3 and last 4 digits, mask middle 4
                      return `${phone.slice(0,3)}****${phone.slice(7)}`
                    } else if (phone.length >= 7) {
                      // For other lengths, show first 3 and last 3, mask middle
                      return `${phone.slice(0,3)}***${phone.slice(-3)}`
                    }
                    return phone
                  }
                  
                  const formattedPhone = ph ? formatPhone(ph) : '未填写手机号'
                  const displayText = `联系人  (+${code})${formattedPhone}`
                  
                  return isValid ? displayText : <span className={styles.warningBadge}>⚠️ {displayText}</span>
                })()}
              </div>
            </div>
            <section className={styles.panel}>
              <div className={styles.panelTitle}>为行程添加保障</div>
              <div className={styles.panelSub}>出行有保险，家人更放心</div>
              <div className={styles.insLayout}>
                <div className={styles.insLeft}><InsuranceIllustration /></div>
                <div className={styles.insRight}>
                  <InsuranceCard 
                    title="航意航延组合险" 
                    desc="意外保障高至350万，延误最高赔300，返航/备降赔100" 
                    price="¥40/人" 
                    type="flight_delay_combo"
                  />
                  <InsuranceCard 
                    title="航空意外险" 
                    desc="航空意外保额高达500万，含意外医疗、行李损失等保障" 
                    price="¥39/人" 
                    type="flight_accident"
                  />
                  <InsuranceCard 
                    title="国内旅行险" 
                    desc="保2天，最高保额180万，含航意险及旅行保障" 
                    price="¥75/人" 
                    type="domestic_travel"
                  />
                </div>
              </div>
              <div className={styles.checkRow}>
                <input 
                  type="checkbox" 
                  checked={skipInsurance}
                  onChange={handleSkipInsuranceChange}
                  disabled={selectedInsurance !== null}
                /> 
                我不需要额外保障
              </div>
            </section>
          </div>
          <div>
            <SummaryCard />
          </div>
        </div>
        )}
        {!hubMode && (
        <div className={styles.actionRow}>
          <div className={styles.actionCard}>
            <button 
              className={styles.nextBtn} 
              onClick={() => { 
                try { 
                  sessionStorage.setItem('bookingStage','3') 
                  // Store insurance selection in booking data
                  const bookingData = {
                    insurance: selectedInsurance,
                    skipInsurance: skipInsurance,
                    timestamp: new Date().toISOString()
                  }
                  sessionStorage.setItem('insuranceSelection', JSON.stringify(bookingData))
                } catch(_) {}
                navigate('/booking/payment') 
              }}
              disabled={(!selectedInsurance && !skipInsurance) || !hasValidPassengers || !hasValidContact}
            >
              下一步
            </button>
          </div>
        </div>
        )}
        {hubMode && (
          <div className={styles.layout}>
            <PromotionBanner />
            <div className={styles.rightPane}>
              <div className={styles.hubNav}>
                <div className={styles.hubTabs}>
                  <span className={styles.hubTab}>国内、国际/中国港澳台</span>
                  <span className={styles.hubTab}>特价机票</span>
                  <span className={styles.hubTab}>航班动态</span>
                  <span className={styles.hubTab}>在线选座</span>
                  <span className={styles.hubTab}>退票改签</span>
                  <span className={`${styles.hubTab} ${styles.hubTabActive}`}>更多服务</span>
                </div>
              </div>
              <div className={styles.hubGridCard}>
                <div className={styles.hubGrid}>
                  {[
                    { label: '报销凭证', color: '#22c55e' },
                    { label: '机场攻略', color: '#f59e0b', to: '/airport-guide' },
                    { label: '国内机场大全', color: '#ef4444' },
                    { label: '国际机场大全', color: '#3b82f6' },
                    { label: '定制包机', color: '#f59e0b' },
                    { label: '团体票', color: '#3b82f6' }
                  ].map((it, idx) => (
                    <div key={idx} className={styles.hubItem} onClick={() => { if (it.to) navigate(it.to) }} role={it.to ? 'button' : undefined}>
                      <div className={styles.hubIcon} style={{ background: `linear-gradient(135deg, ${it.color}, ${it.color}99)` }}>
                        ✈
                      </div>
                      <div className={styles.hubLabel}>{it.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.qrCard}>
                <div className={styles.qrTitle}>更多服务</div>
                <img src={qrPng} alt="扫码下载携程App" className={styles.qrImg} />
                <div className={styles.qrText}>扫码下载携程APP</div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage

import React, { useEffect, useMemo, useState } from 'react';
import styles from './FlightsSearchCard.module.css';

function IconSwap() {
  return (
    <svg className={styles.swapIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10M13 3l4 4-4 4" stroke="#8aa0b4" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M17 17H7M11 21l-4-4 4-4" stroke="#8aa0b4" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="white" strokeWidth="2" fill="none"></circle>
      <line x1="16" y1="16" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"></line>
    </svg>
  );
}

const Tabs = () => (
  <div className={styles.tabs}>
    <span className={`${styles.tab} ${styles.active}`}>国内、国际/中国港澳台</span>
    <span className={styles.tab}>特价机票</span>
    <span className={styles.tab}>航班动态</span>
    <span className={styles.tab}>在线选座</span>
    <span className={styles.tab}>退票改签</span>
    <span className={styles.tab}>更多服务</span>
    <span className={styles.cabin}>不限舱等 ▾</span>
  </div>
);

const FlightsSearchCard = ({ onSearch }) => {
  const capitals = [
    { city: '北京', cityCode: 'BJS', airport: '首都国际机场', airportCode: 'PEK', hot: true },
    { city: '上海', cityCode: 'SHA', airport: '浦东国际机场', airportCode: 'PVG', hot: true },
    { city: '天津', cityCode: 'TSN', airport: '滨海国际机场', airportCode: 'TSN', hot: false },
    { city: '重庆', cityCode: 'CKG', airport: '江北国际机场', airportCode: 'CKG', hot: true },
    { city: '石家庄', cityCode: 'SJW', airport: '正定国际机场', airportCode: 'SJW', hot: false },
    { city: '太原', cityCode: 'TYN', airport: '武宿国际机场', airportCode: 'TYN', hot: false },
    { city: '沈阳', cityCode: 'SHE', airport: '桃仙国际机场', airportCode: 'SHE', hot: false },
    { city: '长春', cityCode: 'CGQ', airport: '龙嘉国际机场', airportCode: 'CGQ', hot: false },
    { city: '哈尔滨', cityCode: 'HRB', airport: '太平国际机场', airportCode: 'HRB', hot: false },
    { city: '南京', cityCode: 'NKG', airport: '禄口国际机场', airportCode: 'NKG', hot: true },
    { city: '杭州', cityCode: 'HGH', airport: '萧山国际机场', airportCode: 'HGH', hot: true },
    { city: '合肥', cityCode: 'HFE', airport: '新桥国际机场', airportCode: 'HFE', hot: false },
    { city: '福州', cityCode: 'FOC', airport: '长乐国际机场', airportCode: 'FOC', hot: false },
    { city: '南昌', cityCode: 'KHN', airport: '昌北国际机场', airportCode: 'KHN', hot: false },
    { city: '济南', cityCode: 'TNA', airport: '遥墙国际机场', airportCode: 'TNA', hot: false },
    { city: '郑州', cityCode: 'CGO', airport: '新郑国际机场', airportCode: 'CGO', hot: true },
    { city: '武汉', cityCode: 'WUH', airport: '天河国际机场', airportCode: 'WUH', hot: true },
    { city: '长沙', cityCode: 'CSX', airport: '黄花国际机场', airportCode: 'CSX', hot: false },
    { city: '广州', cityCode: 'CAN', airport: '白云国际机场', airportCode: 'CAN', hot: true },
    { city: '南宁', cityCode: 'NNG', airport: '吴圩国际机场', airportCode: 'NNG', hot: false },
    { city: '海口', cityCode: 'HAK', airport: '美兰国际机场', airportCode: 'HAK', hot: false },
    { city: '成都', cityCode: 'CTU', airport: '双流国际机场', airportCode: 'CTU', hot: true },
    { city: '贵阳', cityCode: 'KWE', airport: '龙洞堡国际机场', airportCode: 'KWE', hot: false },
    { city: '昆明', cityCode: 'KMG', airport: '长水国际机场', airportCode: 'KMG', hot: true },
    { city: '西安', cityCode: 'XIY', airport: '咸阳国际机场', airportCode: 'XIY', hot: true },
    { city: '兰州', cityCode: 'LHW', airport: '中川国际机场', airportCode: 'LHW', hot: false },
    { city: '西宁', cityCode: 'XNN', airport: '曹家堡国际机场', airportCode: 'XNN', hot: false },
    { city: '银川', cityCode: 'INC', airport: '河东国际机场', airportCode: 'INC', hot: false },
    { city: '乌鲁木齐', cityCode: 'URC', airport: '地窝堡国际机场', airportCode: 'URC', hot: true },
    { city: '拉萨', cityCode: 'LXA', airport: '贡嘎国际机场', airportCode: 'LXA', hot: false },
    { city: '呼和浩特', cityCode: 'HET', airport: '白塔国际机场', airportCode: 'HET', hot: false }
  ]
  const [tripType, setTripType] = useState('oneway')
  const [fromInput, setFromInput] = useState('上海(SHA)')
  const [toInput, setToInput] = useState('北京(BJS)')
  const today = useMemo(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dd}`
  }, [])
  const [departDate, setDepartDate] = useState(today)
  const [returnDate, setReturnDate] = useState('')
  const [fromList, setFromList] = useState([])
  const [toList, setToList] = useState([])
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [selectedTo, setSelectedTo] = useState(null)

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = fromInput.trim()
      if (!q) { setFromList([]); return }
      try {
        const res = await fetch(`/api/airports/suggest?query=${encodeURIComponent(q)}`)
        const data = await res.json()
        setFromList(Array.isArray(data.suggestions) ? data.suggestions : [])
      } catch { setFromList([]) }
    }, 250)
    return () => clearTimeout(t)
  }, [fromInput])

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = toInput.trim()
      if (!q) { setToList([]); return }
      try {
        const res = await fetch(`/api/airports/suggest?query=${encodeURIComponent(q)}`)
        const data = await res.json()
        setToList(Array.isArray(data.suggestions) ? data.suggestions : [])
      } catch { setToList([]) }
    }, 250)
    return () => clearTimeout(t)
  }, [toInput])

  const handleSwap = () => {
    const si = fromInput; const ti = toInput
    const sf = selectedFrom; const st = selectedTo
    setFromInput(ti); setToInput(si)
    setSelectedFrom(st); setSelectedTo(sf)
  }

  const days = useMemo(() => {
    if (tripType !== 'round' || !departDate || !returnDate) return ''
    const d1 = new Date(departDate)
    const d2 = new Date(returnDate)
    const diff = Math.round((d2 - d1) / 86400000)
    return diff > 0 ? `${diff}天` : ''
  }, [tripType, departDate, returnDate])

  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      const payload = {
        tripType,
        fromCity: fromInput,
        toCity: toInput,
        departDate,
        returnDate,
        from: selectedFrom,
        to: selectedTo
      }
      onSearch(payload)
    }
  }
  return (
    <section className={styles.wrapper}>
      <Tabs />
      <div className={styles.card}>
        <div className={styles.radioRow}>
          <span className={`${styles.radio} ${tripType==='oneway'?styles.checked:''}`} onClick={()=>setTripType('oneway')}>单程</span>
          <span className={`${styles.radio} ${tripType==='round'?styles.checked:''}`} onClick={()=>setTripType('round')}>往返</span>
          <span className={styles.radio} onClick={()=>setTripType('multi')}>多程(含缺口程)</span>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <div className={styles.label}>出发地</div>
            <input className={styles.input} value={fromInput} onChange={e=>{setFromInput(e.target.value); setShowFrom(true)}} onFocus={()=>setShowFrom(true)} onBlur={()=>setTimeout(()=>setShowFrom(false),200)} />
            {showFrom && (
              <div className={styles.dropdown}>
                {(fromList.length>0 ? fromList : capitals).map(item=> (
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedFrom(item); setFromInput(`${item.city}(${item.cityCode})`); setShowFrom(false)}}>
                    {item.city}({item.cityCode}) · {item.airport}({item.airportCode})
                  </div>
                ))}
              </div>
            )}
          </div>
          <div onClick={handleSwap}><IconSwap /></div>
          <div className={styles.field}>
            <div className={styles.label}>目的地</div>
            <input className={styles.input} value={toInput} onChange={e=>{setToInput(e.target.value); setShowTo(true)}} onFocus={()=>setShowTo(true)} onBlur={()=>setTimeout(()=>setShowTo(false),200)} />
            {showTo && (
              <div className={styles.dropdown}>
                {(toList.length>0 ? toList : capitals).map(item=> (
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedTo(item); setToInput(`${item.city}(${item.cityCode})`); setShowTo(false)}}>
                    {item.city}({item.cityCode}) · {item.airport}({item.airportCode})
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.fieldWide}>
            <div className={styles.label}>出发日期</div>
            <input className={styles.input} type="date" value={departDate} min={today} onChange={e=>setDepartDate(e.target.value)} />
          </div>
          <div className={styles.days}>{days}</div>
          {tripType==='round' && (
            <div className={styles.fieldWide}>
              <div className={styles.label}>返程日期</div>
              <input className={styles.input} type="date" value={returnDate} min={departDate||today} onChange={e=>setReturnDate(e.target.value)} />
            </div>
          )}
          <div className={styles.passengerType}>
            <div className={styles.label}>乘客类型</div>
            <div className={styles.checkboxRow}>
              <span className={styles.checkbox}>□ 常儿童</span>
              <span className={styles.checkbox}>□ 带婴儿</span>
            </div>
          </div>
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <IconSearch />
          <span>搜索</span>
        </button>
      </div>
    </section>
  );
};

export default FlightsSearchCard;
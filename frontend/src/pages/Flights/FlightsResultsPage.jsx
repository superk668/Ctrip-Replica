import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './FlightsResultsPage.module.css'
import GlobalHeader from '../../components/Header/Header'
import chinaNationalAirlinesLogo from '../../assets/images/airlines_logo/china_national_airlines.png'
import easternAirlinesLogo from '../../assets/images/airlines_logo/eastern_airlines.png'
import hainanAirlinesLogo from '../../assets/images/airlines_logo/hainan_airlines.png'
import southernAirlinesLogo from '../../assets/images/airlines_logo/southern_airlines.png'
import shenzhenAirlinesLogo from '../../assets/images/airlines_logo/shenzhen_airlines.png'
import sichuanAirlinesLogo from '../../assets/images/airlines_logo/sichuan_airlines.png'

const FlightsResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdateAt, setLastUpdateAt] = useState('')
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search])
  const trip = qs.get('trip') || 'oneway'
  const fromCity = qs.get('from') || 'SHA'
  const toCity = qs.get('to') || 'BJS'
  const departDate = qs.get('departDate') || '2025-11-15'
  const returnDate = qs.get('returnDate') || '2025-11-18'

  const capitals = [
    { city: '北京', cityCode: 'BJS', airport: '首都国际机场', airportCode: 'PEK' },
    { city: '上海', cityCode: 'SHA', airport: '浦东国际机场', airportCode: 'PVG' },
    { city: '天津', cityCode: 'TSN', airport: '滨海国际机场', airportCode: 'TSN' },
    { city: '重庆', cityCode: 'CKG', airport: '江北国际机场', airportCode: 'CKG' },
    { city: '石家庄', cityCode: 'SJW', airport: '正定国际机场', airportCode: 'SJW' },
    { city: '太原', cityCode: 'TYN', airport: '武宿国际机场', airportCode: 'TYN' },
    { city: '沈阳', cityCode: 'SHE', airport: '桃仙国际机场', airportCode: 'SHE' },
    { city: '长春', cityCode: 'CGQ', airport: '龙嘉国际机场', airportCode: 'CGQ' },
    { city: '哈尔滨', cityCode: 'HRB', airport: '太平国际机场', airportCode: 'HRB' },
    { city: '南京', cityCode: 'NKG', airport: '禄口国际机场', airportCode: 'NKG' },
    { city: '杭州', cityCode: 'HGH', airport: '萧山国际机场', airportCode: 'HGH' },
    { city: '合肥', cityCode: 'HFE', airport: '新桥国际机场', airportCode: 'HFE' },
    { city: '福州', cityCode: 'FOC', airport: '长乐国际机场', airportCode: 'FOC' },
    { city: '南昌', cityCode: 'KHN', airport: '昌北国际机场', airportCode: 'KHN' },
    { city: '济南', cityCode: 'TNA', airport: '遥墙国际机场', airportCode: 'TNA' },
    { city: '郑州', cityCode: 'CGO', airport: '新郑国际机场', airportCode: 'CGO' },
    { city: '武汉', cityCode: 'WUH', airport: '天河国际机场', airportCode: 'WUH' },
    { city: '长沙', cityCode: 'CSX', airport: '黄花国际机场', airportCode: 'CSX' },
    { city: '广州', cityCode: 'CAN', airport: '白云国际机场', airportCode: 'CAN' },
    { city: '南宁', cityCode: 'NNG', airport: '吴圩国际机场', airportCode: 'NNG' },
    { city: '海口', cityCode: 'HAK', airport: '美兰国际机场', airportCode: 'HAK' },
    { city: '成都', cityCode: 'CTU', airport: '双流国际机场', airportCode: 'CTU' },
    { city: '贵阳', cityCode: 'KWE', airport: '龙洞堡国际机场', airportCode: 'KWE' },
    { city: '昆明', cityCode: 'KMG', airport: '长水国际机场', airportCode: 'KMG' },
    { city: '西安', cityCode: 'XIY', airport: '咸阳国际机场', airportCode: 'XIY' },
    { city: '兰州', cityCode: 'LHW', airport: '中川国际机场', airportCode: 'LHW' },
    { city: '西宁', cityCode: 'XNN', airport: '曹家堡国际机场', airportCode: 'XNN' },
    { city: '银川', cityCode: 'INC', airport: '河东国际机场', airportCode: 'INC' },
    { city: '乌鲁木齐', cityCode: 'URC', airport: '地窝堡国际机场', airportCode: 'URC' },
    { city: '拉萨', cityCode: 'LXA', airport: '贡嘎国际机场', airportCode: 'LXA' },
    { city: '呼和浩特', cityCode: 'HET', airport: '白塔国际机场', airportCode: 'HET' }
  ]
  const todayStr = useMemo(() => {
    const d = new Date()
    const m = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${d.getFullYear()}-${m}-${dd}`
  }, [])
  const [fromInput, setFromInput] = useState(`上海(${fromCity})`)
  const [toInput, setToInput] = useState(`北京(${toCity})`)
  const [depart, setDepart] = useState(departDate)
  const [ret, setRet] = useState(trip === 'round' ? returnDate : '')
  const [fromList, setFromList] = useState([])
  const [toList, setToList] = useState([])
  const fromSuggestAbortRef = useRef(null)
  const toSuggestAbortRef = useRef(null)
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [selectedTo, setSelectedTo] = useState(null)
  const [showAirline, setShowAirline] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [showCabin, setShowCabin] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const airlines = [
    { name: '中国国航', code: 'CA' },
    { name: '东方航空', code: 'MU' },
    { name: '海南航空', code: 'HU' },
    { name: '南方航空', code: 'CZ' }
  ]
  const cabinOptions = [
    { name: '经济舱', code: 'economy' },
    { name: '高端经济舱', code: 'premium' },
    { name: '商务/公务舱', code: 'business' },
    { name: '头等舱', code: 'first' }
  ]
  const modelOptions = ['空客A320','空客A330-300','波音737-800','波音787-9','空客A321','波音777-300ER']
  const timeSlots = Array.from({ length: 48 }).map((_, i) => {
    const h = Math.floor(i / 2)
    const m = i % 2 === 0 ? '00' : '30'
    const h2 = Math.floor((i + 1) / 2)
    const m2 = (i + 1) % 2 === 0 ? '00' : '30'
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(h)}:${m}-${pad(h2)}:${m2}`
  })
  const [filterAirline, setFilterAirline] = useState('')
  const [filterTime, setFilterTime] = useState('')
  const [filterModel, setFilterModel] = useState('')
  const [filterCabin, setFilterCabin] = useState('')

  const findCityByCode = (code) => {
    if (!code) return null
    return capitals.find((c) => c.cityCode === code || c.airportCode === code) || null
  }

  const labelForCode = (code) => {
    const c = findCityByCode(code)
    if (c) return `${c.city}(${c.cityCode})`
    return code ? `(${code})` : ''
  }

  const cityNameForCode = (code) => {
    const c = findCityByCode(code)
    return c ? c.city : (code || '')
  }

  const formatHHMMSS = (d) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const formatCnMD = (iso) => {
    const s = String(iso || '')
    const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(s)
    if (!m) return s
    return `${m[1]}月${m[2]}日`
  }

  useEffect(() => {
    const s = new URLSearchParams(location.search)
    const nextTrip = s.get('trip') || 'oneway'
    const nextFrom = s.get('from') || 'SHA'
    const nextTo = s.get('to') || 'BJS'
    const nextDepart = s.get('departDate') || todayStr
    const nextReturnRaw = s.get('returnDate')
    const nextRet = nextTrip === 'round' ? (nextReturnRaw || '') : ''

    const nextFromLabel = labelForCode(nextFrom)
    const nextToLabel = labelForCode(nextTo)
    if (nextFromLabel && nextFromLabel !== fromInput) setFromInput(nextFromLabel)
    if (nextToLabel && nextToLabel !== toInput) setToInput(nextToLabel)
    if (nextDepart !== depart) setDepart(nextDepart)
    if (nextRet !== ret) setRet(nextRet)

    const nextFromSelected = findCityByCode(nextFrom)
    const nextToSelected = findCityByCode(nextTo)
    if (nextFromSelected) {
      if (nextFromSelected !== selectedFrom) setSelectedFrom(nextFromSelected)
    } else if (selectedFrom) {
      setSelectedFrom(null)
    }
    if (nextToSelected) {
      if (nextToSelected !== selectedTo) setSelectedTo(nextToSelected)
    } else if (selectedTo) {
      setSelectedTo(null)
    }

    const nextAirline = s.get('airline') || ''
    const nextTime = s.get('timeSlot') || ''
    const nextModel = s.get('model') || ''
    const nextCabin = s.get('cabin') || ''
    if (nextAirline !== filterAirline) setFilterAirline(nextAirline)
    if (nextTime !== filterTime) setFilterTime(nextTime)
    if (nextModel !== filterModel) setFilterModel(nextModel)
    if (nextCabin !== filterCabin) setFilterCabin(nextCabin)
  }, [location.search])

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = fromInput.trim()
      if (!q) { setFromList([]); return }
      try {
        if (fromSuggestAbortRef.current) fromSuggestAbortRef.current.abort()
        const controller = new AbortController()
        fromSuggestAbortRef.current = controller
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`/api/airports/suggest?query=${encodeURIComponent(q)}`, { signal: controller.signal, headers })
        const data = await res.json()
        if (!controller.signal.aborted) {
          setFromList(Array.isArray(data.suggestions) ? data.suggestions : [])
        }
      } catch (e) {
        if (e.name !== 'AbortError') setFromList([])
      }
    }, 250)
    return () => { clearTimeout(t); if (fromSuggestAbortRef.current) fromSuggestAbortRef.current.abort() }
  }, [fromInput])

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = toInput.trim()
      if (!q) { setToList([]); return }
      try {
        if (toSuggestAbortRef.current) toSuggestAbortRef.current.abort()
        const controller = new AbortController()
        toSuggestAbortRef.current = controller
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`/api/airports/suggest?query=${encodeURIComponent(q)}`, { signal: controller.signal, headers })
        const data = await res.json()
        if (!controller.signal.aborted) {
          setToList(Array.isArray(data.suggestions) ? data.suggestions : [])
        }
      } catch (e) {
        if (e.name !== 'AbortError') setToList([])
      }
    }, 250)
    return () => { clearTimeout(t); if (toSuggestAbortRef.current) toSuggestAbortRef.current.abort() }
  }, [toInput])

  const parseCode = (txt) => {
    const m = /\(([^)]+)\)/.exec(String(txt))
    return m ? m[1] : ''
  }

  const applyTimerRef = useRef(null)
  const pendingParamsRef = useRef('')
  useEffect(() => {
    return () => {
      if (applyTimerRef.current) {
        clearTimeout(applyTimerRef.current)
        applyTimerRef.current = null
      }
      if (fromSuggestAbortRef.current) try { fromSuggestAbortRef.current.abort() } catch {}
      if (toSuggestAbortRef.current) try { toSuggestAbortRef.current.abort() } catch {}
    }
  }, [])
  const applyParamsDebounced = (delay = 180, overrides = {}) => {
    const s = new URLSearchParams(location.search)
    const fCode = overrides.from !== undefined ? overrides.from : (selectedFrom?.cityCode || selectedFrom?.airportCode || parseCode(fromInput) || fromCity)
    const tCode = overrides.to !== undefined ? overrides.to : (selectedTo?.cityCode || selectedTo?.airportCode || parseCode(toInput) || toCity)
    s.set('from', fCode)
    s.set('to', tCode)
    s.set('departDate', overrides.departDate !== undefined ? overrides.departDate : (depart || todayStr))
    const nextRet = overrides.returnDate !== undefined ? overrides.returnDate : ret
    if (nextRet) s.set('returnDate', nextRet); else s.delete('returnDate')
    const nextAirline = overrides.airline !== undefined ? overrides.airline : filterAirline
    if (nextAirline) s.set('airline', nextAirline); else s.delete('airline')
    const nextTime = overrides.timeSlot !== undefined ? overrides.timeSlot : filterTime
    if (nextTime) s.set('timeSlot', nextTime); else s.delete('timeSlot')
    const nextModel = overrides.model !== undefined ? overrides.model : filterModel
    if (nextModel) s.set('model', nextModel); else s.delete('model')
    const nextCabin = overrides.cabin !== undefined ? overrides.cabin : filterCabin
    if (nextCabin) s.set('cabin', nextCabin); else s.delete('cabin')
    const next = s.toString()
    pendingParamsRef.current = next
    if (applyTimerRef.current) clearTimeout(applyTimerRef.current)
    applyTimerRef.current = setTimeout(() => {
      applyTimerRef.current = null
      const current = new URLSearchParams(location.search).toString()
      if (next !== current) navigate(`/flights/results?${next}`)
    }, delay)
  }

  const handleSwap = () => {
    const fI = fromInput
    const tI = toInput
    setFromInput(tI)
    setToInput(fI)
    const fS = selectedFrom
    const tS = selectedTo
    setSelectedFrom(tS)
    setSelectedTo(fS)
    const fCode = tS?.cityCode || tS?.airportCode || parseCode(tI) || toCity
    const tCode = fS?.cityCode || fS?.airportCode || parseCode(fI) || fromCity
    applyParamsDebounced(100, { from: fCode, to: tCode })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        setError('')
        setLoading(true)
        const url = `/api/flights/search${location.search}`
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(url, { headers, signal: controller.signal })
        let data = {}
        try {
          data = await res.json()
        } catch (e) {
          console.warn('Response not JSON', res.status)
        }
        if (!res.ok) {
          if (res.status === 401 && token) {
            try {
              const prof = await fetch('/api/users/me/profile', { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
              if (prof.ok) {
                const retry = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
                if (retry.ok) {
                  const j = await retry.json().catch(()=>({ flights: [] }))
                  setResults(Array.isArray(j.flights) ? j.flights : [])
                  return
                }
              }
            } catch (_) {}
            navigate('/login')
            return
          }
          const msg = data?.error || data?.message || (res.status === 500 ? '服务器内部错误' : '搜索失败')
          setError(`${msg} (${res.status})`)
          setLastUpdateAt(formatHHMMSS(new Date()))
        } else {
          setResults(Array.isArray(data.flights) ? data.flights : [])
          setLastUpdateAt(formatHHMMSS(new Date()))
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError('网络异常，请稍后重试')
          setLastUpdateAt(formatHHMMSS(new Date()))
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => controller.abort()
  }, [location.search])

  const Header = () => (
    <div className={styles.headerBar}>
      <div className={styles.radioRow}>
        <span className={`${styles.radio} ${styles.checked}`}>单程</span>
        <span className={styles.radio}>往返</span>
        <span className={styles.radio}>多程(含缺口程)</span>
        <span className={styles.cabin}>不限舱等 ▾</span>
      </div>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <div className={styles.label}>出发地</div>
          <input className={styles.input} value={fromInput} onChange={e=>{setFromInput(e.target.value); setShowFrom(true)}} onFocus={()=>setShowFrom(true)} onBlur={()=>setTimeout(()=>setShowFrom(false),200)} />
          {showFrom && (
            <div className={styles.dropdown}>
              {(() => {
                const seen = new Set()
                const merge = [...fromList, ...capitals]
                return merge.filter(x => {
                  const key = `${x.cityCode}-${x.airportCode}`
                  if (seen.has(key)) return false
                  seen.add(key)
                  return true
                }).map(item => (
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedFrom(item); setFromInput(`${item.city}(${item.cityCode})`); setShowFrom(false); applyParamsDebounced(100, { from: item.cityCode || item.airportCode })}}>
                    {item.city}({item.cityCode}) · {item.airport}({item.airportCode})
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
        <div className={styles.swapIcon} onClick={handleSwap}>↔</div>
        <div className={styles.field}>
          <div className={styles.label}>目的地</div>
          <input className={styles.input} value={toInput} onChange={e=>{setToInput(e.target.value); setShowTo(true)}} onFocus={()=>setShowTo(true)} onBlur={()=>setTimeout(()=>setShowTo(false),200)} />
          {showTo && (
            <div className={styles.dropdown}>
              {(() => {
                const seen = new Set()
                const merge = [...toList, ...capitals]
                return merge.filter(x => {
                  const key = `${x.cityCode}-${x.airportCode}`
                  if (seen.has(key)) return false
                  seen.add(key)
                  return true
                }).map(item => (
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedTo(item); setToInput(`${item.city}(${item.cityCode})`); setShowTo(false); applyParamsDebounced(100, { to: item.cityCode || item.airportCode })}}>
                    {item.city}({item.cityCode}) · {item.airport}({item.airportCode})
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
        <div className={styles.fieldWide}>
          <div className={styles.label}>出发日期</div>
          <input className={styles.dateInput} type="date" value={depart} min={todayStr} onChange={e=>{setDepart(e.target.value); applyParamsDebounced(100, { departDate: e.target.value })}} />
        </div>
        {trip !== 'oneway' && (
          <div className={styles.fieldWide}>
            <div className={styles.label}>返回日期</div>
            <input className={styles.dateInput} type="date" value={ret} min={depart||todayStr} onChange={e=>{setRet(e.target.value); applyParamsDebounced(100, { returnDate: e.target.value })}} />
          </div>
        )}
        <div className={styles.fieldSmall}>
          <div className={styles.labelMuted}>乘客类型</div>
          <div className={styles.checkboxRow}><span className={styles.checkbox}>□ 常儿童</span><span className={styles.checkbox}>□ 带婴儿</span></div>
        </div>
        <div className={styles.dateMore}>
          <span className={styles.dateMoreText}>更多日期</span>
          <span className={styles.dateMoreIcon}>▸</span>
        </div>
      </div>
    </div>
  )

  

  const OneWayBar = () => {
    const tripLabel = trip === 'round' ? '往返' : trip === 'multi' ? '多程' : '单程'
    const route = `${cityNameForCode(fromCity)}→${cityNameForCode(toCity)}`
    const dateLabel = `${formatCnMD(depart)} ${weekday(depart)}`
    return (
      <div className={styles.segmentBar}>
        <div className={styles.summaryLeft}>
          <span className={styles.tripPrefix}>{tripLabel}：</span>
          <span className={styles.routeText}>{route}</span>
          <span className={styles.summaryDate}>{dateLabel}</span>
        </div>
        <div className={styles.updateAt}>
          <span>最近更新时间：{lastUpdateAt || '--:--:--'}</span>
          <span className={styles.updateIcon}>ⓘ</span>
        </div>
      </div>
    )
  }

  const FilterBar = () => (
    <div className={styles.filterBar}>
      <div className={styles.leftFilters}>
        <label className={styles.check}><input type="checkbox" disabled /> 直飞/经停</label>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowAirline(!showAirline); setShowTime(false); setShowModel(false); setShowCabin(false); setShowMore(false)}}>航空公司 ▾</span>
          {showAirline && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowAirline(false)}>
              {airlines.map(a => (
                <div key={a.code} className={`${styles.filterItem} ${filterAirline===a.code?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterAirline(a.code); setShowAirline(false); applyParamsDebounced(100, { airline: a.code })}}>
                  {a.name}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterAirline(''); setShowAirline(false); applyParamsDebounced(100, { airline: '' })}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowTime(!showTime); setShowAirline(false); setShowModel(false); setShowCabin(false); setShowMore(false)}}>起降时间 ▾</span>
          {showTime && (
            <div className={styles.filterDropdownWide} onMouseLeave={()=>setShowTime(false)}>
              {timeSlots.map(ts => (
                <div key={ts} className={`${styles.filterItem} ${filterTime===ts?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterTime(ts); setShowTime(false); applyParamsDebounced(100, { timeSlot: ts })}}>
                  {ts}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterTime(''); setShowTime(false); applyParamsDebounced(100, { timeSlot: '' })}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowModel(!showModel); setShowAirline(false); setShowTime(false); setShowCabin(false); setShowMore(false)}}>机型 ▾</span>
          {showModel && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowModel(false)}>
              {modelOptions.map(mo => (
                <div key={mo} className={`${styles.filterItem} ${filterModel===mo?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterModel(mo); setShowModel(false); applyParamsDebounced(100, { model: mo })}}>
                  {mo}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterModel(''); setShowModel(false); applyParamsDebounced(100, { model: '' })}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowCabin(!showCabin); setShowAirline(false); setShowTime(false); setShowModel(false); setShowMore(false)}}>舱位 ▾</span>
          {showCabin && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowCabin(false)}>
              {cabinOptions.map(cb => (
                <div key={cb.code} className={`${styles.filterItem} ${filterCabin===cb.code?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterCabin(cb.code); setShowCabin(false); applyParamsDebounced(100, { cabin: cb.code })}}>
                  {cb.name}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterCabin(''); setShowCabin(false); applyParamsDebounced(100, { cabin: '' })}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowMore(!showMore); setShowAirline(false); setShowTime(false); setShowModel(false); setShowCabin(false)}}>更多 ▾</span>
          {showMore && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowMore(false)}>
              <div className={styles.filterItem}>含经停</div>
              <div className={styles.filterItem}>仅可退改</div>
              <div className={styles.filterItem}>含托运行李</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightSorts}>
        <span className={`${styles.sort} ${styles.active}`}>低价优先</span>
        <span className={styles.sort}>准点率高-低</span>
        <span className={styles.sort}>起飞时间早-晚</span>
        <span className={styles.sort}>更多排序 ▾</span>
      </div>
    </div>
  )

  const toISO = (d) => {
    const m = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${d.getFullYear()}-${m}-${dd}`
  }
  const addDays = (base, n) => {
    const d = new Date(base)
    d.setDate(d.getDate()+n)
    return d
  }
  const weekday = (d) => ['周日','周一','周二','周三','周四','周五','周六'][new Date(d).getDay()]
  const [tabStart, setTabStart] = useState(depart)

  useEffect(() => {
    setTabStart(depart)
  }, [depart])

  const DateTabs = () => {
    const [priceMap, setPriceMap] = useState({})
    const cacheRef = useRef(new Map())
    const abortRef = useRef(null)
    const prefetchedStartRef = useRef('')
    const priceCacheRef = useRef(new Map())
    const lastKnownPricesRef = useRef(new Map())
    const days = 7
    const items = Array.from({ length: days }).map((_, i) => {
      const d = addDays(tabStart, i)
      const s = toISO(d)
      const mm = String(d.getMonth()+1).padStart(2,'0')
      const dd = String(d.getDate()).padStart(2,'0')
      const type = ret ? (new Date(s) >= new Date(ret) ? '返' : '去') : '去'
      const isActive = (type === '去' && s === depart) || (type === '返' && s === ret)
      return { s, md: `${mm}-${dd}`, wk: weekday(s), isActive, type }
    })
    const goPrev = async () => {
      const token = localStorage.getItem('token')
      if (!token) { setTabStart(toISO(addDays(tabStart, -1))); return }
      const s = new URLSearchParams(location.search)
      const fromCode = s.get('from') || fromCity
      const toCode = s.get('to') || toCity
      const airline = s.get('airline') || ''
      const timeSlot = s.get('timeSlot') || ''
      const model = s.get('model') || ''
      const cabin = s.get('cabin') || ''
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      const start = toISO(addDays(tabStart, -1))
      const buildQuery = (a, b) => {
        const sp = new URLSearchParams()
        sp.set('from', a)
        sp.set('to', b)
        sp.set('startDate', start)
        sp.set('days', String(days))
        if (airline) sp.set('airline', airline)
        if (timeSlot) sp.set('timeSlot', timeSlot)
        if (model) sp.set('model', model)
        if (cabin) sp.set('cabin', cabin)
        return sp
      }
      const needBack = !!ret
      const goRes = await fetch(`/api/flights/min-prices?${buildQuery(fromCode, toCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} }))
      const backRes = needBack ? await fetch(`/api/flights/min-prices?${buildQuery(toCode, fromCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} })) : { prices: {} }
      if (controller.signal.aborted) return
      const nextItems = Array.from({ length: days }).map((_, i) => {
        const d = addDays(start, i)
        const s2 = toISO(d)
        const type2 = ret ? (new Date(s2) >= new Date(ret) ? '返' : '去') : '去'
        return { s: s2, type: type2 }
      })
      const map = {}
      nextItems.forEach(it => {
        const src = it.type === '返' ? backRes : goRes
        const val = (src && src.prices && typeof src.prices[it.s] === 'number') ? src.prices[it.s] : 0
        map[it.s] = val
      })
      nextItems.forEach(it => { lastKnownPricesRef.current.set(it.s, map[it.s]) })
      const cacheKeyGo = `${fromCode}|${toCode}|${airline}|${timeSlot}|${model}|${cabin}|${start}|go`
      const cacheKeyBack = `${toCode}|${fromCode}|${airline}|${timeSlot}|${model}|${cabin}|${start}|back`
      priceCacheRef.current.set(cacheKeyGo, goRes.prices || {})
      if (needBack) priceCacheRef.current.set(cacheKeyBack, backRes.prices || {})
      prefetchedStartRef.current = start
      setPriceMap(map)
      setTabStart(start)
    }
    const goNext = async () => {
      const token = localStorage.getItem('token')
      if (!token) { setTabStart(toISO(addDays(tabStart, 1))); return }
      const s = new URLSearchParams(location.search)
      const fromCode = s.get('from') || fromCity
      const toCode = s.get('to') || toCity
      const airline = s.get('airline') || ''
      const timeSlot = s.get('timeSlot') || ''
      const model = s.get('model') || ''
      const cabin = s.get('cabin') || ''
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      const start = toISO(addDays(tabStart, 1))
      const buildQuery = (a, b) => {
        const sp = new URLSearchParams()
        sp.set('from', a)
        sp.set('to', b)
        sp.set('startDate', start)
        sp.set('days', String(days))
        if (airline) sp.set('airline', airline)
        if (timeSlot) sp.set('timeSlot', timeSlot)
        if (model) sp.set('model', model)
        if (cabin) sp.set('cabin', cabin)
        return sp
      }
      const needBack = !!ret
      const goRes = await fetch(`/api/flights/min-prices?${buildQuery(fromCode, toCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} }))
      const backRes = needBack ? await fetch(`/api/flights/min-prices?${buildQuery(toCode, fromCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} })) : { prices: {} }
      if (controller.signal.aborted) return
      const nextItems = Array.from({ length: days }).map((_, i) => {
        const d = addDays(start, i)
        const s2 = toISO(d)
        const type2 = ret ? (new Date(s2) >= new Date(ret) ? '返' : '去') : '去'
        return { s: s2, type: type2 }
      })
      const map = {}
      nextItems.forEach(it => {
        const src = it.type === '返' ? backRes : goRes
        const val = (src && src.prices && typeof src.prices[it.s] === 'number') ? src.prices[it.s] : 0
        map[it.s] = val
      })
      nextItems.forEach(it => { lastKnownPricesRef.current.set(it.s, map[it.s]) })
      const cacheKeyGo = `${fromCode}|${toCode}|${airline}|${timeSlot}|${model}|${cabin}|${start}|go`
      const cacheKeyBack = `${toCode}|${fromCode}|${airline}|${timeSlot}|${model}|${cabin}|${start}|back`
      priceCacheRef.current.set(cacheKeyGo, goRes.prices || {})
      if (needBack) priceCacheRef.current.set(cacheKeyBack, backRes.prices || {})
      prefetchedStartRef.current = start
      setPriceMap(map)
      setTabStart(start)
    }
    const onPick = (it) => {
      if (it.type === '返') {
        setRet(it.s)
        applyParamsDebounced(0, { returnDate: it.s })
      } else {
        setDepart(it.s)
        if (ret && new Date(ret) < new Date(it.s)) {
          setRet('')
          applyParamsDebounced(0, { departDate: it.s, returnDate: '' })
        } else {
          applyParamsDebounced(0, { departDate: it.s })
        }
      }
    }
    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) return
      const s = new URLSearchParams(location.search)
      const fromCode = s.get('from') || fromCity
      const toCode = s.get('to') || toCity
      const airline = s.get('airline') || ''
      const timeSlot = s.get('timeSlot') || ''
      const model = s.get('model') || ''
      const cabin = s.get('cabin') || ''
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      const buildQuery = (a, b) => {
        const sp = new URLSearchParams()
        sp.set('from', a)
        sp.set('to', b)
        sp.set('startDate', tabStart)
        sp.set('days', String(days))
        if (airline) sp.set('airline', airline)
        if (timeSlot) sp.set('timeSlot', timeSlot)
        if (model) sp.set('model', model)
        if (cabin) sp.set('cabin', cabin)
        return sp
      }
      const needBack = !!ret
      const run = async () => {
        try {
          const goRes = await fetch(`/api/flights/min-prices?${buildQuery(fromCode, toCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} }))
          const backRes = needBack ? await fetch(`/api/flights/min-prices?${buildQuery(toCode, fromCode).toString()}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }).then(r=>r.json()).catch(()=>({ prices: {} })) : { prices: {} }
          if (controller.signal.aborted) return
          const nextItems = Array.from({ length: days }).map((_, i) => {
            const d = addDays(tabStart, i)
            const s2 = toISO(d)
            const type2 = ret ? (new Date(s2) >= new Date(ret) ? '返' : '去') : '去'
            return { s: s2, type: type2 }
          })
          const map = {}
          nextItems.forEach(it => {
            const src = it.type === '返' ? backRes : goRes
            const val = (src && src.prices && typeof src.prices[it.s] === 'number') ? src.prices[it.s] : 0
            map[it.s] = val
          })
          nextItems.forEach(it => { lastKnownPricesRef.current.set(it.s, map[it.s]) })
          const cacheKeyGo = `${fromCode}|${toCode}|${airline}|${timeSlot}|${model}|${cabin}|${tabStart}|go`
          const cacheKeyBack = `${toCode}|${fromCode}|${airline}|${timeSlot}|${model}|${cabin}|${tabStart}|back`
          priceCacheRef.current.set(cacheKeyGo, goRes.prices || {})
          if (needBack) priceCacheRef.current.set(cacheKeyBack, backRes.prices || {})
          setPriceMap(map)
        } catch (e) {
          // ignore
        }
      }
      run()
      return () => controller.abort()
    }, [location.search, tabStart])
    return (
      <div className={styles.dateTabs}>
        <span className={styles.arrow} onClick={goPrev}>◀</span>
        {items.map(it => (
          <span key={it.s} className={`${styles.dateCell} ${it.isActive?styles.dateActive:''}`} onClick={()=>onPick(it)}>
            <span className={styles.dateTop}>
              <span className={styles.dateMd}>{it.md}</span>
              <span className={styles.dateWk}>{it.wk}</span>
              <span className={`${styles.tripTag} ${it.type === '返' ? styles.tripTagBack : styles.tripTagGo}`}>{it.type}</span>
            </span>
            <span className={styles.datePrice}>{(() => {
              const v = priceMap[it.s] !== undefined ? priceMap[it.s] : lastKnownPricesRef.current.get(it.s)
              return v !== undefined ? (v > 0 ? `¥${v}` : '—') : '—'
            })()}</span>
          </span>
        ))}
        <span className={styles.arrow} onClick={goNext}>▶</span>
      </div>
    )
  }

  const airlineLogoMap = useMemo(() => ({
    '中国国航': chinaNationalAirlinesLogo,
    CA: chinaNationalAirlinesLogo,
    '东方航空': easternAirlinesLogo,
    MU: easternAirlinesLogo,
    '海南航空': hainanAirlinesLogo,
    HU: hainanAirlinesLogo,
    '南方航空': southernAirlinesLogo,
    CZ: southernAirlinesLogo,
    '深圳航空': shenzhenAirlinesLogo,
    '深航': shenzhenAirlinesLogo,
    ZH: shenzhenAirlinesLogo,
    '四川航空': sichuanAirlinesLogo,
    '川航': sichuanAirlinesLogo,
    '3U': sichuanAirlinesLogo,
    SC: sichuanAirlinesLogo
  }), [])

  const Logo = ({ airline }) => {
    const key = String(airline || '').trim()
    const src = airlineLogoMap[key] || airlineLogoMap[key.toUpperCase()] || ''
    if (src) return <img className={styles.logo} src={src} alt={key || 'airline logo'} />
    return (
      <svg className={styles.logo} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="0" y="0" width="40" height="40" rx="10" fill="#eef5ff"/>
        <text x="20" y="24" textAnchor="middle" fontSize="10" fill="#0071eb">LOGO</text>
      </svg>
    )
  }

  const Row = ({ airline, flightNo, model, share, depTime, depAirport, depTerminal, arrTime, arrAirport, arrTerminal, packages, flight }) => {
    const [open, setOpen] = useState(false)
    const minPrice = Array.isArray(packages) && packages.length > 0 ? Math.min(...packages.map(p => p.price)) : 0
    const econ = (packages||[]).filter(p => p.cabin === 'Y').slice(0,5)
    const first = (packages||[]).filter(p => p.cabin === 'F').slice(0,5)
    const nav = useNavigate()
    return (
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <Logo airline={airline} />
          <div className={styles.airlineInfo}><span className={styles.airline}>{airline}</span><span className={styles.flightNo}>{flightNo}</span><span className={styles.model}>{model}</span>{share && <span className={styles.share}>{share}</span>}</div>
        </div>
        <div className={styles.middleCol}>
          <div className={styles.timeBlock}>
            <div className={styles.time}>{depTime}</div>
            <div className={styles.airport}>{depAirport} {depTerminal}</div>
          </div>
          <div className={styles.arrowMid}>→</div>
          <div className={styles.timeBlock}>
            <div className={styles.time}>{arrTime}</div>
            <div className={styles.airport}>{arrAirport} {arrTerminal}</div>
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.price}>¥{minPrice}</div>
          <button className={styles.chooseBtn} onClick={()=>setOpen(!open)}>
            {trip === 'oneway' ? '订票' : '选为去程'}
            <span className={styles.chevron}>{open ? '▴' : '▾'}</span>
          </button>
        </div>
        {open && (
          <div className={styles.packagePanel}>
            <div className={styles.packageHeaderRow}>
              <div className={styles.panelTitle}>可选套餐</div>
              <div className={styles.collapse} onClick={()=>setOpen(false)}>收起 ▴</div>
            </div>
            {!!econ.length && (
              <div className={styles.group}>
                <div className={styles.groupTitle}>经济舱（共{econ.length}个选项）</div>
                <div className={styles.items}>
                  {econ.map(p => (
                    <div key={p.id} className={styles.itemRow}>
                      <div>
                        <div className={styles.pkgName}>{p.name}</div>
                        <div className={styles.pkgTips}>可退改：{p.refundable?'是':'否'} · 手提{p.baggage?.carry||0}kg · 托运{p.baggage?.checkin||0}kg</div>
                      </div>
                      <div className={styles.pkgPrice}>¥{p.price}</div>
                      <button className={styles.bookBtn} onClick={()=>{
                        try { sessionStorage.setItem('bookingSelection', JSON.stringify({ flight, package: p })) } catch {}
                        nav(`/booking?flight=${encodeURIComponent(flight?.id||'')}&pkg=${encodeURIComponent(p.id)}`)
                      }}>预订</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!!first.length && (
              <div className={styles.group}>
                <div className={styles.groupTitle}>头等舱（共{first.length}个选项）</div>
                <div className={styles.items}>
                  {first.map(p => (
                    <div key={p.id} className={styles.itemRow}>
                      <div>
                        <div className={styles.pkgName}>{p.name}</div>
                        <div className={styles.pkgTips}>可退改：{p.refundable?'是':'否'} · 手提{p.baggage?.carry||0}kg · 托运{p.baggage?.checkin||0}kg</div>
                      </div>
                      <div className={styles.pkgPrice}>¥{p.price}</div>
                      <button className={styles.bookBtn} onClick={()=>{
                        try { sessionStorage.setItem('bookingSelection', JSON.stringify({ flight, package: p })) } catch {}
                        nav(`/booking?flight=${encodeURIComponent(flight?.id||'')}&pkg=${encodeURIComponent(p.id)}`)
                      }}>预订</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const List = () => (
    <div className={styles.list}>
      {results.map(f => {
        const airlineName = f.carrier
        return (
          <Row
            key={f.id}
            airline={airlineName}
            flightNo={f.flightNo}
            model={f.model}
            depTime={f.from.time}
            depAirport={`${f.from.airport}国际机场`}
            depTerminal={f.from.terminal}
            arrTime={f.to.time}
            arrAirport={`${f.to.airport}国际机场`}
            arrTerminal={f.to.terminal}
            packages={f.packages}
            flight={f}
          />
        )
      })}
    </div>
  )

  return (
    <div>
      <GlobalHeader />
      <main className={styles.container}>
        <div className={styles.wrap}>
          {loading && <div className={styles.loading}>加载中…</div>}
          {error && <div className={styles.error}>{error}</div>}
          <Header />
          <DateTabs />
          <OneWayBar />
          <FilterBar />
          <List />
        </div>
      </main>
    </div>
  )
}

export default FlightsResultsPage

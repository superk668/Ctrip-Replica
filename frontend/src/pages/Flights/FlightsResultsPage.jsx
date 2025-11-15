import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './FlightsResultsPage.module.css'

const FlightsResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

  const parseCode = (txt) => {
    const m = /\(([^)]+)\)/.exec(String(txt))
    return m ? m[1] : ''
  }

  const applyParams = () => {
    const s = new URLSearchParams(location.search)
    const fCode = selectedFrom?.cityCode || selectedFrom?.airportCode || parseCode(fromInput) || fromCity
    const tCode = selectedTo?.cityCode || selectedTo?.airportCode || parseCode(toInput) || toCity
    s.set('from', fCode)
    s.set('to', tCode)
    s.set('departDate', depart || todayStr)
    if (ret) s.set('returnDate', ret); else s.delete('returnDate')
    if (filterAirline) s.set('airline', filterAirline); else s.delete('airline')
    if (filterTime) s.set('timeSlot', filterTime); else s.delete('timeSlot')
    if (filterModel) s.set('model', filterModel); else s.delete('model')
    if (filterCabin) s.set('cabin', filterCabin); else s.delete('cabin')
    navigate(`/flights/results?${s.toString()}`)
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
    setTimeout(applyParams, 0)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const fetchData = async () => {
      try {
        setLoading(true)
        const url = `/api/flights/search${location.search}`
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login')
            return
          }
          setError(data.error || '搜索失败')
        } else {
          setResults(Array.isArray(data.flights) ? data.flights : [])
        }
      } catch (e) {
        setError('网络异常，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedFrom(item); setFromInput(`${item.city}(${item.cityCode})`); setShowFrom(false); setTimeout(applyParams,0)}}>
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
                  <div key={`${item.city}-${item.airportCode}`} className={styles.dropdownItem} onMouseDown={()=>{setSelectedTo(item); setToInput(`${item.city}(${item.cityCode})`); setShowTo(false); setTimeout(applyParams,0)}}>
                    {item.city}({item.cityCode}) · {item.airport}({item.airportCode})
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
        <div className={styles.fieldWide}>
          <div className={styles.label}>出发日期</div>
          <input className={styles.dateInput} type="date" value={depart} min={todayStr} onChange={e=>{setDepart(e.target.value); setTimeout(applyParams,0)}} />
        </div>
        {trip !== 'oneway' && (
          <div className={styles.fieldWide}>
            <div className={styles.label}>返回日期</div>
            <input className={styles.dateInput} type="date" value={ret} min={depart||todayStr} onChange={e=>{setRet(e.target.value); setTimeout(applyParams,0)}} />
          </div>
        )}
        <div className={styles.fieldSmall}>
          <div className={styles.labelMuted}>乘客类型</div>
          <div className={styles.checkboxRow}><span className={styles.checkbox}>□ 常儿童</span><span className={styles.checkbox}>□ 带婴儿</span></div>
        </div>
        <div className={styles.dateMore}>更多日期</div>
      </div>
    </div>
  )

  

  const OneWayBar = () => (
    <div className={styles.segmentBar}>
      <div className={styles.stepActive}><span className={styles.stepNum}>1</span><span className={styles.stepText}>单程：上海 → 北京 {depart}</span></div>
      <div className={styles.updateAt}>最近更新时间：20:37:18</div>
    </div>
  )

  const FilterBar = () => (
    <div className={styles.filterBar}>
      <div className={styles.leftFilters}>
        <label className={styles.check}><input type="checkbox" disabled /> 直飞/经停</label>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowAirline(!showAirline); setShowTime(false); setShowModel(false); setShowCabin(false); setShowMore(false)}}>航空公司 ▾</span>
          {showAirline && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowAirline(false)}>
              {airlines.map(a => (
                <div key={a.code} className={`${styles.filterItem} ${filterAirline===a.code?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterAirline(a.code); setShowAirline(false); setTimeout(applyParams,0)}}>
                  {a.name}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterAirline(''); setShowAirline(false); setTimeout(applyParams,0)}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowTime(!showTime); setShowAirline(false); setShowModel(false); setShowCabin(false); setShowMore(false)}}>起降时间 ▾</span>
          {showTime && (
            <div className={styles.filterDropdownWide} onMouseLeave={()=>setShowTime(false)}>
              {timeSlots.map(ts => (
                <div key={ts} className={`${styles.filterItem} ${filterTime===ts?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterTime(ts); setShowTime(false); setTimeout(applyParams,0)}}>
                  {ts}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterTime(''); setShowTime(false); setTimeout(applyParams,0)}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowModel(!showModel); setShowAirline(false); setShowTime(false); setShowCabin(false); setShowMore(false)}}>机型 ▾</span>
          {showModel && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowModel(false)}>
              {modelOptions.map(mo => (
                <div key={mo} className={`${styles.filterItem} ${filterModel===mo?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterModel(mo); setShowModel(false); setTimeout(applyParams,0)}}>
                  {mo}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterModel(''); setShowModel(false); setTimeout(applyParams,0)}}>不限</div>
            </div>
          )}
        </div>
        <div className={styles.filterWrap}>
          <span className={styles.filter} onClick={()=>{setShowCabin(!showCabin); setShowAirline(false); setShowTime(false); setShowModel(false); setShowMore(false)}}>舱位 ▾</span>
          {showCabin && (
            <div className={styles.filterDropdown} onMouseLeave={()=>setShowCabin(false)}>
              {cabinOptions.map(cb => (
                <div key={cb.code} className={`${styles.filterItem} ${filterCabin===cb.code?styles.filterItemActive:''}`} onMouseDown={()=>{setFilterCabin(cb.code); setShowCabin(false); setTimeout(applyParams,0)}}>
                  {cb.name}
                </div>
              ))}
              <div className={styles.filterItem} onMouseDown={()=>{setFilterCabin(''); setShowCabin(false); setTimeout(applyParams,0)}}>不限</div>
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

  const DateTabs = () => {
    const items = Array.from({ length: 10 }).map((_, i) => {
      const d = addDays(tabStart, i)
      const s = toISO(d)
      const mm = String(d.getMonth()+1).padStart(2,'0')
      const dd = String(d.getDate()).padStart(2,'0')
      const type = ret ? (new Date(s) >= new Date(ret) ? '返' : '去') : '去'
      const isActive = (type === '去' && s === depart) || (type === '返' && s === ret)
      return { s, label: `${mm}-${dd} ${weekday(s)} ${type}`, isActive, type }
    })
    const goPrev = () => setTabStart(toISO(addDays(tabStart, -1)))
    const goNext = () => setTabStart(toISO(addDays(tabStart, 1)))
    const onPick = (it) => {
      if (it.type === '返') {
        setRet(it.s)
      } else {
        setDepart(it.s)
        if (ret && new Date(ret) < new Date(it.s)) setRet('')
      }
      setTimeout(applyParams, 0)
    }
    return (
      <div className={styles.dateTabs}>
        <span className={styles.arrow} onClick={goPrev}>◀</span>
        {items.map(it => (
          <span key={it.s} className={`${styles.dateCell} ${it.isActive?styles.dateActive:''}`} onClick={()=>onPick(it)}>{it.label}</span>
        ))}
        <span className={styles.arrow} onClick={goNext}>▶</span>
      </div>
    )
  }

  const Logo = ({ text }) => (
    <svg className={styles.logo} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="0" y="0" width="40" height="40" rx="10" fill="#eef5ff"/>
      <text x="20" y="24" textAnchor="middle" fontSize="10" fill="#0071eb">{text}</text>
    </svg>
  )

  const Row = ({ airline, flightNo, model, share, depTime, depAirport, depTerminal, arrTime, arrAirport, arrTerminal, price }) => (
    <div className={styles.row}>
      <div className={styles.leftCol}>
        <Logo text="LOGO占位" />
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
        <div className={styles.price}>¥{price}</div>
        <button className={styles.chooseBtn}>{trip === 'oneway' ? '订票' : '选为去程'}</button>
      </div>
    </div>
  )

  const List = () => (
    <div className={styles.list}>
      {results.map(f => {
        const price = Array.isArray(f.packages) && f.packages.length>0 ? f.packages[0].price : 0
        const airlineName = f.carrier
        return (
          <Row key={f.id} airline={airlineName} flightNo={f.flightNo} model={f.model} depTime={f.from.time} depAirport={`${f.from.airport}国际机场`} depTerminal={f.from.terminal} arrTime={f.to.time} arrAirport={`${f.to.airport}国际机场`} arrTerminal={f.to.terminal} price={price} />
        )
      })}
    </div>
  )

  return (
    <main className={styles.container}>
      {loading && <div className={styles.loading}>加载中…</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!error && (
        <>
          <Header />
          <DateTabs />
          <OneWayBar />
          <FilterBar />
          <List />
        </>
      )}
    </main>
  )
}

export default FlightsResultsPage
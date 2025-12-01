import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PromotionBanner from '../Home/LocalComponents/PromotionBanner'
import styles from './AirportGuidePage.module.css'

const domesticHot = [
  ['北京 首都机场','广州 白云机场','武汉 天河机场','成都 双流机场'],
  ['太原 武宿机场','大连 周水子机场','南京 禄口机场','西安 咸阳机场'],
  ['天津 滨海机场','重庆 江北机场','沈阳 桃仙机场','哈尔滨 太平机场'],
  ['长春 龙嘉机场','杭州 萧山机场','厦门 高崎机场','济南 遥墙机场'],
]
const intlHot = [
  ['中国澳门 澳门国际','中国香港 香港国际','中国台北 桃园国际','日本 成田/羽田'],
  ['韩国 金浦/仁川','新加坡 樟宜','曼谷 素万那普','吉隆坡 KLIA'],
  ['迪拜 迪拜国际','巴黎 戴高乐','伦敦 希思罗','法兰克福 法兰克福'],
  ['洛杉矶 LAX','纽约 JFK/EWR','温哥华 YVR','悉尼 悉尼机场'],
]

const alphaDomestic = {
  A: ['阿尔山 阿尔山机场','安庆 天柱山机场','鞍山 鞍山机场','安顺 黄果树机场'],
  B: ['包头 二里半机场','毕节 飞雄机场','北海 福成机场','保山 保山机场'],
  C: ['长春 龙嘉机场','长沙 黄花机场','重庆 江北机场','成都 双流机场','常州 奔牛机场'],
}

const AirportGuidePage = () => {
  const [tab, setTab] = useState('domestic')
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <PromotionBanner />
          <div className={styles.content}>
            <div className={styles.breadcrumb}><a href="/home">首页</a> &gt; <a href="/airport-guide">机场攻略</a></div>
            <div className={styles.titleBar}>热门机场</div>
            <div className={styles.subTag}>国内</div>
            <div className={styles.grid}>
              {domesticHot.flat().concat([
                '上海 虹桥机场','深圳 宝安机场','杭州 萧山机场','青岛 流亭机场','厦门 高崎机场',
                '郑州 新郑机场','长沙 黄花机场','南宁 吴圩机场','昆明 长水机场','三亚 凤凰机场'
              ]).map((t, i) => (
                <div key={i} className={styles.gridItem}><strong>{t.split(' ')[0]}</strong><span className={styles.gridDot}>·</span>{t.split(' ')[1]}</div>
              ))}
            </div>
            <div className={styles.subTag}>国际/中国港澳台地区</div>
            <div className={styles.grid}>
              {intlHot.flat().concat([
                '中国台湾 桃园/高雄/台中','泰国 素万那普/廊曼','越南 河内/胡志明','印度 新德里',
                '土耳其 伊斯坦布尔','俄罗斯 莫斯科'
              ]).map((t, i) => (
                <div key={i} className={styles.gridItem}><strong>{t.split(' ')[0]}</strong><span className={styles.gridDot}>·</span>{t.split(' ').slice(1).join(' ')}</div>
              ))}
            </div>

            <div className={styles.tabs}>
              <div className={`${styles.tab} ${tab==='domestic'?styles.tabActive:''}`} onClick={()=>setTab('domestic')}>国内机场</div>
              <div className={`${styles.tab} ${tab==='intl'?styles.tabActive:''}`} onClick={()=>setTab('intl')}>国际/中国港澳台地区机场</div>
            </div>

            {tab==='domestic' && (
              <div className={styles.alphaRow}>
                {Object.keys(alphaDomestic).map(letter => (
                  <div key={letter}>
                    <div className={styles.alphaHeader}><span className={styles.alphaBadge}>{letter}</span>国内机场</div>
                    <div className={styles.alphaGrid}>
                      {(alphaDomestic[letter]||[]).map((t,i)=>(<div key={letter+i}>{t}</div>))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab==='intl' && (
              <div className={styles.alphaRow}>
                <div className={styles.alphaHeader}><span className={styles.alphaBadge}>示</span>国际/港澳台示例</div>
                <div className={styles.alphaGrid}>
                  {intlHot.flat().map((t,i)=>(<div key={'intl'+i}>{t}</div>))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.rightPane}>
            <div className={styles.boardingCard} onClick={()=>navigate('/boarding-process')} role="button" aria-label="乘机流程">
              <div className={styles.boardingTitle}>乘机流程</div>
              <div className={styles.boardingSub}>boarding procedures</div>
              <div className={styles.boardingArrow}>→</div>
            </div>
            <div className={styles.weatherCard}>
              <div className={styles.weatherHeader}>
                <div>今日天气</div>
                <a href="#">查看更多其他城市 ›</a>
              </div>
              <div className={styles.weatherMain}>
                <div className={styles.cityName}>北京</div>
                <div className={styles.dateRow}>
                  <span>2025年12月01日</span>
                  <span>星期一</span>
                </div>
                <div className={styles.temp}>-3℃~5℃</div>
                <div>多云</div>
              </div>
              <div className={styles.forecast}>
                <div className={styles.forecastItem}>
                  <div className={styles.forecastHeader}>明天</div>
                  <div className={styles.forecastBody}>2025年12月02日 · 多云 · -7℃~0℃</div>
                </div>
                <div className={styles.forecastItem}>
                  <div className={styles.forecastHeader}>后天</div>
                  <div className={styles.forecastBody}>2025年12月03日 · 晴 · -8℃~2℃</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AirportGuidePage

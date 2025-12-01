import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PromotionBanner from '../Home/LocalComponents/PromotionBanner'
import styles from './BoardingProcessPage.module.css'

const Img = ({ src, alt }) => (
  <div className={styles.imgWrap}>
    <img className={styles.img} src={src} alt={alt} onError={(e)=>{ e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML = `<div class=\"${styles.placeholder}\">未找到图片：${alt}<br/>请将图片保存为 ${src.replace('/boarding-process/','')} 到 frontend/public/boarding-process/</div>` }} />
  </div>
)

const BoardingProcessPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <PromotionBanner />
          <div className={styles.content}>
            <div className={styles.title}>乘机流程图 <span className={styles.note}>示例以上海浦东为例，仅供参考</span></div>

            <section className={styles.block}>
              <div className={styles.blockHeader}>出发 <span className={styles.blockSub}>Departure</span></div>
              <Img src={'/boarding-process/departure-domestic.png'} alt={'出发-国内流程图（departure-domestic.png）'} />
              <Img src={'/boarding-process/departure-international.png'} alt={'出发-国际流程图（departure-international.png）'} />
            </section>

            <section className={styles.block}>
              <div className={styles.blockHeader}>到达 <span className={styles.blockSub}>Arrival</span></div>
              <Img src={'/boarding-process/arrival-domestic.png'} alt={'到达-国内流程图（arrival-domestic.png）'} />
              <Img src={'/boarding-process/arrival-international.png'} alt={'到达-国际流程图（arrival-international.png）'} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BoardingProcessPage


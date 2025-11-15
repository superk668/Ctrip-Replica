import React from 'react';
import styles from './HotelBookingCard.module.css';

function IconSearch() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="white" strokeWidth="2" fill="none"></circle>
      <line x1="16" y1="16" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"></line>
    </svg>
  );
}

function IconCaret() {
  return (
    <svg className={styles.caret} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const HotelBookingCard = () => {
  return (
    <section className={styles.card}>
      <div className={styles.headerBg}>
        <div className={styles.headerRow}>
          <div className={styles.title}>预订酒店</div>
          <div className={styles.safeWrap}>
            <span className={styles.safeText}>安心订</span>
            <span className={styles.safeIcon}>占位</span>
            <span className={styles.safeText}>放心住</span>
          </div>
        </div>
      </div>

      <div className={styles.formBlock}>
        <div className={styles.row}>
          <div className={styles.field}>
            <div className={styles.label}>目的地/酒店名称</div>
            <div className={styles.value}>上海</div>
          </div>
          <div className={styles.vDivider}></div>
          <div className={styles.fieldDateGroup}>
            <div className={styles.fieldDate}>
              <div className={styles.label}>入住</div>
              <div className={styles.valueBold}>11月15日（今天）</div>
            </div>
            <div className={styles.nights}>1晚</div>
            <div className={styles.fieldDate}>
              <div className={styles.label}>退房</div>
              <div className={styles.valueBold}>11月16日（明天）</div>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldSmall}>
            <div className={styles.labelMuted}>房间及住客</div>
            <div className={styles.value}>1间, 1位</div>
            <IconCaret />
          </div>
          <div className={styles.fieldSmall}>
            <div className={styles.labelMuted}>酒店级别</div>
            <div className={styles.value}>不限</div>
            <IconCaret />
          </div>
          <div className={styles.fieldKeyword}>
            <div className={styles.labelMuted}>关键词（选填）</div>
            <div className={styles.placeholder}>机场火车站/酒店名称...</div>
          </div>
          <button className={styles.searchBtn}>
            <IconSearch />
            <span>搜索</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HotelBookingCard;
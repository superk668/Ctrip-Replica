import React from 'react';
import styles from './PromotionBanner.module.css';

import aboutCtripIcon from '../../../assets/images/sidebar_logo/about_ctrip.png';
import aiAssistanceIcon from '../../../assets/images/sidebar_logo/ai_assistance.png';
import busBoatTicketIcon from '../../../assets/images/sidebar_logo/bus_boat_ticket.png';
import carUseIcon from '../../../assets/images/sidebar_logo/car_use.png';
import ctripFinanceIcon from '../../../assets/images/sidebar_logo/ctrip_finance.png';
import enterpriseTravelIcon from '../../../assets/images/sidebar_logo/enterprise_travel.png';
import giftcardIcon from '../../../assets/images/sidebar_logo/giftcard.png';
import globalShoppingIcon from '../../../assets/images/sidebar_logo/global_shopping.png';
import guideIcon from '../../../assets/images/sidebar_logo/guide.png';
import hotelIcon from '../../../assets/images/sidebar_logo/hotel.png';
import oldFriendsIcon from '../../../assets/images/sidebar_logo/old_friends.png';
import planeTicketIcon from '../../../assets/images/sidebar_logo/plane_ticket.png';
import ticketIcon from '../../../assets/images/sidebar_logo/ticket.png';
import trainTicketIcon from '../../../assets/images/sidebar_logo/train_ticket.png';
import travelMapIcon from '../../../assets/images/sidebar_logo/travel_map.png';
import travellingIcon from '../../../assets/images/sidebar_logo/travelling.png';

const itemsTop = [
  { key: '酒店', label: '酒店' },
  { key: '机票', label: '机票' },
  { key: '火车票', label: '火车票' },
  { key: '旅游', label: '旅游' },
  { key: '门票·活动', label: '门票·活动' },
  { key: '汽车·船票', label: '汽车·船票' },
  { key: '用车', label: '用车' },
];

const itemsMiddle = [
  { key: 'AI行程助手', label: 'AI行程助手', badge: 'NEW' },
  { key: '攻略·景点', label: '攻略·景点' },
  { key: '旅游地图', label: '旅游地图' },
];

const itemsBottom = [
  { key: '全球购', label: '全球购' },
  { key: '礼品卡', label: '礼品卡' },
  { key: '携程金融', label: '携程金融' },
];

const itemsLast = [
  { key: '企业商旅', label: '企业商旅' },
  { key: '老友会', label: '老友会' },
  { key: '关于携程', label: '关于携程' },
];

const iconMap = {
  酒店: hotelIcon,
  机票: planeTicketIcon,
  火车票: trainTicketIcon,
  旅游: travellingIcon,
  '门票·活动': ticketIcon,
  '汽车·船票': busBoatTicketIcon,
  用车: carUseIcon,
  AI行程助手: aiAssistanceIcon,
  '攻略·景点': guideIcon,
  旅游地图: travelMapIcon,
  全球购: globalShoppingIcon,
  礼品卡: giftcardIcon,
  携程金融: ctripFinanceIcon,
  企业商旅: enterpriseTravelIcon,
  老友会: oldFriendsIcon,
  关于携程: aboutCtripIcon,
};

const Section = ({ data }) => (
  <ul className={styles.list}>
    {data.map(item => (
      <li key={item.key} className={styles.item}>
        {iconMap[item.key] ? (
          <img className={styles.icon} src={iconMap[item.key]} alt="" aria-hidden="true" />
        ) : null}
        <span className={styles.label}>{item.label}</span>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </li>
    ))}
  </ul>
);

const PromotionBanner = () => {
  return (
    <aside className={styles.sidebar}>
      <Section data={itemsTop} />
      <div className={styles.divider}></div>
      <Section data={itemsMiddle} />
      <div className={styles.divider}></div>
      <Section data={itemsBottom} />
      <div className={styles.divider}></div>
      <Section data={itemsLast} />
    </aside>
  );
};

export default PromotionBanner;

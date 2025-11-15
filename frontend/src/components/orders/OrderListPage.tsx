import React, { useEffect, useMemo, useState } from 'react';
import styles from './OrderListPage.module.css';
import DownloadButton from './DownloadButton';
import { Link, useInRouterContext } from 'react-router-dom';
import Header from '../../components/Header/Header';

type OrderItem = {
  orderId: string;
  productType: string;
  productTitle: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
};

const tabs = [
  { key: 'all', label: '全部订单' },
  { key: 'pending_travel', label: '未出行' },
  { key: 'pending_payment', label: '待支付' },
  { key: 'pending_review', label: '待点评' }
];

const OrderListPage = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderType, setOrderType] = useState('全部订单');

  const productType = useMemo(() => {
    const map: Record<string, string> = {
      '全部订单': 'all',
      '机票': 'flight',
      '火车票': 'train',
      '酒店': 'hotel'
    };
    return map[orderType] || 'all';
  }, [orderType]);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = { status: currentTab, page: String(page), pageSize: String(pageSize) };
    if (productType !== 'all') params.productType = productType;
    return new URLSearchParams(params).toString();
  }, [currentTab, page, pageSize, productType]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      let phone: string | undefined;
      try {
        const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        phone = u ? JSON.parse(u)?.phone : undefined;
      } catch (_) {}
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (phone) headers['x-user-phone'] = String(phone);
      if (!token && !phone) {
        setOrders([]);
        setError('请登录后查看订单');
        setIsLoading(false);
        return;
      }
      const res = await fetch(`/api/orders?${queryParams}`, { headers });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || '订单加载失败，请检查您的网络并重试');
      }
      const data = await res.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setTotalPages(Number(data?.pagination?.totalPages) || 1);
      setTotalCount(Number(data?.pagination?.totalCount) || 0);
    } catch (e: any) {
      setOrders([]);
      setError(e?.message || '订单加载失败，请检查您的网络并重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [queryParams]);

  const onTabClick = (key: string) => {
    setCurrentTab(key);
    setPage(1);
  };

  const onRetry = () => fetchOrders();

  const inRouter = useInRouterContext();
  const NavLink = ({ to, children, ...props }) => (
    inRouter ? <Link to={to} {...props}>{children}</Link> : <a href={to} {...props}>{children}</a>
  );

  return (
    <>
    <Header />
    <div className={styles.pageContainer}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideTitle}>我的携程首页</div>
          <div className={styles.sideGroup}>订单</div>
          <div className={styles.sideItemActive}>我的订单</div>
          <div className={styles.sideItem}>我的消息</div>
          <div className={styles.sideItem}>钱包</div>
          <div className={styles.sideItem}>礼品卡</div>
          <div className={styles.sideItem}>优惠券</div>
          <div className={styles.sideItem}>积分</div>
          <div className={styles.sideItem}>我的收藏</div>
          <div className={styles.sideItem}>常用信息</div>
          <div className={styles.sideItem}>个人中心</div>
        </aside>
        <div className={styles.main}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>我的订单</h1>
        <div className={styles.hint}>您可以在携程查看近一年订单，或使用携程App下载和管理历史订单</div>
        <div className={styles.actionsRight}>
          <NavLink to="#" className={styles.linkAction}>下载历史所有订单</NavLink>
        </div>
      </div>

      <div className={styles.tabBar}>
        {tabs.map(t => (
          <button key={t.key} className={`${styles.tab} ${currentTab === t.key ? styles.active : ''}`} onClick={() => onTabClick(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className={styles.filterBar}>
        <label className={styles.filterLabel}>订单类型</label>
        <select className={styles.select} value={orderType} onChange={(e) => { setOrderType(e.target.value); setPage(1); }}>
          <option>全部订单</option>
          <option>机票</option>
          <option>火车票</option>
          <option>酒店</option>
        </select>
        <button className={styles.moreFilter}>更多筛选条件</button>
      </div>

      {isLoading && (
        <div className={styles.loading}>正在加载…</div>
      )}

      {!!error && (
        <div className={styles.error}>订单加载失败，请检查您的网络并重试 <button className={styles.retry} onClick={onRetry}>重试</button></div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className={styles.empty}>您还没有相关订单哦</div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className={styles.list}>
          {orders.map(o => (
            <div key={o.orderId} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.orderNo}>订单号：<NavLink to={`/orders/${o.orderId}`}>{o.orderId}</NavLink></span>
                <span className={styles.orderDate}>下单时间：{new Date(o.orderDate).toLocaleDateString()}</span>
                <span className={styles.status}>{o.orderStatus === 'pending_travel' ? '支付成功' : o.orderStatus === 'pending_payment' ? '待支付' : o.orderStatus === 'pending_review' ? '待点评' : '状态'}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.productTitle}>{o.productTitle}</div>
                <div className={styles.meta}>出发/入住：以订单详情为准</div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.leftOps}>
                  <label className={styles.checkbox}><input type="checkbox" /> 全选</label>
                  <DownloadButton orderId={o.orderId} />
                </div>
                <div className={styles.priceArea}>
                  <div className={styles.priceLabel}>{o.orderStatus === 'pending_travel' ? '支付成功' : ''}</div>
                  <div className={styles.price}>¥{o.totalAmount?.toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button className={styles.pgBtn} disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>{'<'}</button>
        <span className={styles.pgInfo}>{page}</span>
        <button className={styles.pgBtn} disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>{'>'}</button>
      </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderListPage;
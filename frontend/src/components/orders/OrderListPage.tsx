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
  productInfo?: any;
  travelerInfo?: any[];
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
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

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
      setSelectedOrderIds([]);
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

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const formatDateTime = (s?: string) => {
    if (!s) return '';
    const d = new Date(s);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const formatRange = (start?: string, end?: string) => {
    if (!start) return '';
    const sd = new Date(start);
    const ed = end ? new Date(end) : null;
    const startStr = `${sd.getFullYear()}-${pad(sd.getMonth() + 1)}-${pad(sd.getDate())} ${pad(sd.getHours())}:${pad(sd.getMinutes())}`;
    if (!ed) return startStr;
    const sameDay = sd.getFullYear() === ed.getFullYear() && sd.getMonth() === ed.getMonth() && sd.getDate() === ed.getDate();
    const endStr = sameDay ? `${pad(ed.getHours())}:${pad(ed.getMinutes())}` : `${ed.getFullYear()}-${pad(ed.getMonth() + 1)}-${pad(ed.getDate())} ${pad(ed.getHours())}:${pad(ed.getMinutes())}`;
    return `${startStr} 至 ${endStr}`;
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedOrderIds((prev) => {
      if (checked) {
        const next = new Set(prev);
        next.add(id);
        return Array.from(next);
      }
      return prev.filter((x) => x !== id);
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedOrderIds(checked ? orders.map((o) => o.orderId) : []);
  };

  const handleBulkDownload = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      let phone: string | undefined;
      try {
        const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        phone = u ? JSON.parse(u)?.phone : undefined;
      } catch (_) {}
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (phone) headers['x-user-phone'] = String(phone);
      headers['Accept'] = 'text/plain';
      if (!token && !phone) {
        alert('请先登录');
        return;
      }
      for (const id of selectedOrderIds) {
        const res = await fetch(`/api/orders/${id}/download`, { headers });
        if (!res.ok) throw new Error('生成失败，请稍后重试');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const disp = res.headers ? res.headers.get('content-disposition') || '' : '';
        const match = disp.match(/filename="?([^";]+)"?/i);
        const filename = match ? filenameSanitize(match[1]) : `${id}.txt`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (e: any) {
      alert(e?.message || '生成失败，请稍后重试');
    }
  };

  const filenameSanitize = (name: string) => name.replace(/[\/:*?"<>|]/g, '-');

  const goToDetail = (id: string) => {
    window.location.href = `/orders/${id}`;
  };

  return (
    <>
    <Header />
    <div className={styles.pageContainer}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideItem}>我的携程首页</div>
          <div className={styles.sideItemActive}>订单</div>
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
      <div className={styles.noticeBar}>
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
            <div key={o.orderId} className={`${styles.card} ${styles.cardClickable}`} onClick={(e) => {
              const target = (e.target as HTMLElement);
              const tag = String(target?.tagName || '').toLowerCase();
              if (['a','button','input','label','select','textarea'].includes(tag)) return;
              if (target && target.closest('[data-role="row-select-area"]')) return;
              goToDetail(o.orderId);
            }} onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const target = (e.target as HTMLElement);
                const tag = String(target?.tagName || '').toLowerCase();
                if (['a','button','input','label','select','textarea'].includes(tag)) return;
                if (target && target.closest('[data-role="row-select-area"]')) return;
                goToDetail(o.orderId);
              }
            }} tabIndex={0}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.rowSelectArea}
                  data-role="row-select-area"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(o.orderId, !selectedOrderIds.includes(o.orderId));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      toggleSelect(o.orderId, !selectedOrderIds.includes(o.orderId));
                    }
                  }}
                  tabIndex={0}
                >
                  <input
                    type="checkbox"
                    className={styles.rowCheck}
                    checked={selectedOrderIds.includes(o.orderId)}
                    onChange={(e) => toggleSelect(o.orderId, e.target.checked)}
                    onClick={(e) => { e.stopPropagation(); }}
                    onKeyDown={(e) => { e.stopPropagation(); }}
                    onMouseDown={(e) => { e.stopPropagation(); }}
                    onTouchStart={(e) => { e.stopPropagation(); }}
                  />
                  <span className={styles.orderNo}>
                    订单号：<NavLink to={`/orders/${o.orderId}`} onClick={(e) => e.stopPropagation()}>{o.orderId}</NavLink>
                  </span>
                </div>
                <span className={styles.orderDate}>下单时间：{new Date(o.orderDate).toLocaleDateString()}</span>
                <span className={styles.status}>{o.orderStatus === 'pending_travel' ? '支付成功' : o.orderStatus === 'pending_payment' ? '待支付' : o.orderStatus === 'pending_review' ? '待点评' : '状态'}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.productTitle}>{o.productTitle}</div>
                <div className={styles.meta}>出发日期：{formatRange(o.productInfo?.departTime, o.productInfo?.arriveTime)} {o.productInfo?.number || ''}</div>
                <div className={styles.meta}>出行人：{(Array.isArray(o.travelerInfo) ? o.travelerInfo : []).map((t: any) => t?.name).filter(Boolean).join('、') || ''}</div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.priceArea}>
                  <div className={styles.priceLabel}>{o.orderStatus === 'pending_travel' ? '支付成功' : ''}</div>
                  <div className={styles.price}>¥{o.totalAmount?.toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.opsBar}>
        <label className={styles.checkbox}><input type="checkbox" checked={selectedOrderIds.length === orders.length && orders.length > 0} onChange={(e) => toggleSelectAll(e.target.checked)} /> 全选</label>
        <button className={styles.bulkBtn} disabled={selectedOrderIds.length === 0} onClick={handleBulkDownload}>下载订单</button>
      </div>

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
  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedOrderIds((prev) => {
      if (checked) {
        const next = new Set(prev);
        next.add(id);
        return Array.from(next);
      }
      return prev.filter((x) => x !== id);
    });
  };
  const toggleSelectAll = (checked: boolean) => {
    setSelectedOrderIds(checked ? orders.map((o) => o.orderId) : []);
  };
  const handleBulkDownload = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      let phone: string | undefined;
      try {
        const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        phone = u ? JSON.parse(u)?.phone : undefined;
      } catch (_) {}
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (phone) headers['x-user-phone'] = String(phone);
      headers['Accept'] = 'text/plain';
      if (!token && !phone) {
        alert('请先登录');
        return;
      }
      for (const id of selectedOrderIds) {
        const res = await fetch(`/api/orders/${id}/download`, { headers });
        if (!res.ok) throw new Error('生成失败，请稍后重试');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const disp = res.headers ? res.headers.get('content-disposition') || '' : '';
        const match = disp.match(/filename="?([^";]+)"?/i);
        const filename = match ? filenameSanitize(match[1]) : `${id}.txt`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (e: any) {
      alert(e?.message || '生成失败，请稍后重试');
    }
  };

  const filenameSanitize = (name: string) => name.replace(/[\\/:*?"<>|]/g, '-');
  const goToDetail = (id: string) => {
    window.location.href = `/orders/${id}`;
  };
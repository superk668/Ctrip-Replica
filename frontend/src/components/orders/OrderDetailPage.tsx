import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './OrderListPage.module.css';
import ReorderButton from './ReorderButton';

type Props = { orderId: string };
const OrderDetailPage = ({ orderId }: Props) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cityName = (v: any) => {
    const s = String(v || '');
    const map: Record<string, string> = {
      SJW: '石家庄'
    };
    return map[s] || s;
  };

  useEffect(() => {
    const run = async () => {
      setError('');
      setIsLoading(true);
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
        if (!token && !phone) {
          setError('请登录后查看订单详情');
          setIsLoading(false);
          return;
        }
        const res = await fetch(`/api/orders/${orderId}`, { headers });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error || '订单详情加载失败，请稍后重试');
        }
        const j = await res.json();
        setData(j);
      } catch (e: any) {
        setError(e?.message || '订单详情加载失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('确认取消该订单吗？')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('订单取消成功');
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || '取消失败');
      }
    } catch (err) {
      console.error(err);
      alert('取消失败');
    }
  };

  const handlePayNow = () => {
    try {
      sessionStorage.setItem('createdOrderId', String((data && data.orderId) || orderId));
      sessionStorage.setItem('bookingStage', '3');
      const list = Array.isArray(data?.travelerInfo) ? data.travelerInfo : [];
      if (list.length > 0) {
        sessionStorage.setItem('passengerInfo', JSON.stringify({ passengerList: list }));
      }
    } catch (_) {}
    window.location.href = '/booking/payment';
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.headerBar}>
          <h1 className={styles.title}>订单详情</h1>
          <div className={styles.hint}>订单ID: {orderId}</div>
        </div>

        {isLoading && (
          <div className={styles.loading}>正在加载…</div>
        )}

        {!!error && (
          <div className={styles.error}>{error}</div>
        )}

        {!isLoading && !error && data && (
          <div className={styles.list}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.orderNo}>订单号：{data.orderId}</span>
                <span className={styles.orderDate}>状态：{data.orderStatus === 'pending_travel' ? '支付成功' : data.orderStatus === 'pending_payment' ? '待支付' : data.orderStatus === 'pending_review' ? '待点评' : data.orderStatus || '未知'}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.productTitle}>{(data.productInfo?.departCity && data.productInfo?.arriveCity) ? `${cityName(data.productInfo.departCity)} → ${cityName(data.productInfo.arriveCity)}` : (data.productInfo?.title || data.productTitle || '产品')}</div>
                <div className={styles.meta}>
                  {data.productInfo?.number ? `车次/航班：${data.productInfo.number}` : ''}
                  {data.productInfo?.seatType ? `（${data.productInfo.seatType}）` : ''}
                </div>
                <div className={styles.meta}>下单时间：{data.orderDate ? new Date(data.orderDate).toLocaleString() : ''}</div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.leftOps}>
                  <ReorderButton orderInfo={{ orderId: data.orderId, productTitle: data.productTitle, productInfo: data.productInfo }} />
                  {data.orderStatus === 'pending_payment' && (
                    <button
                      type="button"
                      style={{ padding: '6px 12px', border: 'none', background: '#ff9500', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={handlePayNow}
                    >
                      立即支付
                    </button>
                  )}
                  {(data.orderStatus === 'pending_payment' || data.orderStatus === 'pending_travel') && (
                    <button className={styles.cancelBtn} style={{ marginLeft: '12px', padding: '6px 12px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer' }} onClick={handleCancel}>取消</button>
                  )}
                </div>
                <div className={styles.priceArea}>
                  <div className={styles.priceLabel}>总金额</div>
                  <div className={styles.price}>¥{typeof data.priceDetails?.total === 'number' ? data.priceDetails.total.toFixed(1) : (data.totalAmount || 0).toFixed(1)}</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><span>旅客信息</span></div>
              <div className={styles.cardBody}>
                {(Array.isArray(data.travelerInfo) ? data.travelerInfo : []).map((t: any, idx: number) => (
                  <div key={idx} className={styles.meta}>{t?.name || ''} {t?.idMasked ? `（${t.idMasked}）` : ''}</div>
                ))}
                {(!data.travelerInfo || data.travelerInfo.length === 0) && <div className={styles.meta}>暂无旅客信息</div>}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><span>联系信息</span></div>
              <div className={styles.cardBody}>
                <div className={styles.meta}>手机号：{data.contactInfo?.phone || ''}</div>
                <div className={styles.meta}>邮箱：{data.contactInfo?.email || ''}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><span>价格明细</span></div>
              <div className={styles.cardBody}>
                {(Array.isArray(data.priceDetails?.items) ? data.priceDetails.items : []).map((it: any, idx: number) => (
                  <div key={idx} className={styles.meta}>{it?.label || '项目'}：{typeof it?.price === 'number' ? `¥${it.price.toFixed(1)}` : it?.price} × {it?.count || 1}</div>
                ))}
                <div className={styles.priceArea}>
                  <div className={styles.priceLabel}>合计</div>
                  <div className={styles.price}>¥{typeof data.priceDetails?.total === 'number' ? data.priceDetails.total.toFixed(1) : (data.totalAmount || 0).toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetailPage;

import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="addresses" />);

const AddressAdd = () => {
  const [receiver, setReceiver] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detail, setDetail] = useState('');
  const [phone, setPhone] = useState('');
  const [tried, setTried] = useState(false);
  const [message, setMessage] = useState('');

  const isPhoneValid = (p) => /^1[3-9]\d{9}$/.test(String(p).trim());

  const handleSave = async (e) => {
    e.preventDefault();
    setTried(true);
    setMessage('');
    if (!receiver.trim()) { setMessage('请输入收件人姓名'); return; }
    if (!province || !city || !district) { setMessage('请选择完整的地区信息'); return; }
    if (!detail.trim()) { setMessage('请输入详细地址'); return; }
    if (!isPhoneValid(phone)) { setMessage('请输入正确的手机号码'); return; }
    try {
      const token = localStorage.getItem('token');
      if (!token) { setMessage('登录已过期，请重新登录'); window.location.href = '/login'; return; }
      const res = await fetch('/api/users/me/addresses', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver: receiver.trim(), province, city, district, detail: detail.trim(), phone: String(phone).trim() })
      });
      const data = await res.json();
      if (res.status === 201 && data.success) {
        setMessage('新常用地址成功!');
        alert('新常用地址成功!');
      } else {
        const err = data?.message || '保存失败';
        setMessage(err);
      }
    } catch (e2) {
      setMessage('保存失败');
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.mainArea}>
            <div className={styles.headerBar}>
              <div className={styles.title}>新增常用地址</div>
              <a href="/user-center/common-info/addresses" className={styles.actionLink}>返回地址列表</a>
            </div>
            {!!message && (<div className={styles.errorText} style={{marginBottom:'8px'}}>{message}</div>)}
            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>地址信息</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>收件人姓名</div><input className={styles.input} value={receiver} onChange={(e)=>setReceiver(e.target.value)} />{tried && !receiver.trim() && (<div className={styles.errorText}>请输入收件人姓名</div>)}</div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>省份</div><select className={styles.input} value={province} onChange={(e)=>{setProvince(e.target.value); setCity(''); setDistrict('');}}>
                  <option value="">请选择</option>
                  <option value="上海">上海</option>
                </select></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>城市</div><select className={styles.input} value={city} onChange={(e)=>{setCity(e.target.value); setDistrict('');}}>
                  <option value="">请选择</option>
                  {province==='上海' && (<option value="上海">上海</option>)}
                </select></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>区/县</div><select className={styles.input} value={district} onChange={(e)=>setDistrict(e.target.value)}>
                  <option value="">请选择</option>
                  {city==='上海' && (<>
                    <option value="闵行区">闵行区</option>
                    <option value="静安区">静安区</option>
                  </>)}
                </select></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>详细地址</div><input className={styles.input} placeholder="如道路、门牌号、单元等" value={detail} onChange={(e)=>setDetail(e.target.value)} /></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>手机号码</div><input className={styles.input} value={phone} onChange={(e)=>setPhone(e.target.value)} />{tried && !isPhoneValid(phone) && (<div className={styles.errorText}>请输入正确的手机号码</div>)}</div>
              </div>
            </div>
            <div className={styles.saveRow}>
              <button className={styles.primaryOrange} onClick={handleSave}>保存</button>
              <button className={styles.btn} onClick={() => window.history.back()}>取消</button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddressAdd;


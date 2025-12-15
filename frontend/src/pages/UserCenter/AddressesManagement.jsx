import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="addresses" />);

const AddressesManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) { setList([]); setError('请先登录'); setLoading(false); return; }
      const res = await fetch('/api/users/me/addresses', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setList(Array.isArray(data.data?.items) ? data.data.items : []);
      } else {
        setList([]);
      }
    } catch (e) {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm('确认删除该地址？');
    if (!ok) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('登录已过期，请重新登录'); window.location.href = '/login'; return; }
      const res = await fetch(`/api/users/me/addresses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data.success) {
        setList(prev => prev.filter(x => x.id !== id));
      } else {
        alert(data?.message || '删除失败');
      }
    } catch (e) {
      alert('删除失败');
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
              <div className={styles.title}>常用地址</div>
              <a href="/user-center/common-info/addresses/add" className={styles.actionLink}>新增</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><div>地址列表</div></div>
              <div className={styles.cardBody}>
                {loading && (<div>加载中…</div>)}
                {!loading && (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>收件人</th>
                        <th>地区</th>
                        <th>详细地址</th>
                        <th>手机号码</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length === 0 ? (
                        <tr><td colSpan={5} style={{textAlign:'center'}}>暂无数据</td></tr>
                      ) : (
                        list.map(item => (
                          <tr key={item.id}>
                            <td>{item.receiver}</td>
                            <td>{item.province} {item.city} {item.district}</td>
                            <td>{item.detail}</td>
                            <td>{item.phone}</td>
                            <td>
                              <a href="#" className={styles.deleteLink} onClick={(e)=>{e.preventDefault(); handleDelete(item.id);}}>删除</a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddressesManagement;


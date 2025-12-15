import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="addresses" />);

const AddressesManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  
  // 新增 state
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

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

  // 搜索处理 (前端过滤)
  const filteredList = list.filter(item => {
    if (!keyword.trim()) return true;
    const kw = keyword.trim().toLowerCase();
    // 假设匹配收件人或地址详情
    return (item.receiver && item.receiver.toLowerCase().includes(kw)) ||
           (item.detail && item.detail.toLowerCase().includes(kw)) ||
           (item.province && item.province.includes(kw)) ||
           (item.city && item.city.includes(kw));
  });

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
        setSelectedIds(prev => prev.filter(sid => sid !== id));
      } else {
        alert(data?.message || '删除失败');
      }
    } catch (e) {
      alert('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert('请先选择要删除的地址');
      return;
    }
    const ok = window.confirm(`确认删除选中的 ${selectedIds.length} 条地址？`);
    if (!ok) return;

    // 简单实现：逐个删除
    for (const id of selectedIds) {
       try {
          const token = localStorage.getItem('token');
          await fetch(`/api/users/me/addresses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
       } catch(e) { console.error(e); }
    }
    // 重新刷新列表或从本地移除
    setList(prev => prev.filter(x => !selectedIds.includes(x.id)));
    setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredList.length && filteredList.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map(x => x.id));
    }
  };

  const isAllSelected = filteredList.length > 0 && selectedIds.length === filteredList.length;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.mainArea}>
            {/* 顶部工具栏 */}
            <div style={{
              backgroundColor: '#fff', 
              border: '1px solid #ddd', 
              padding: '10px 15px', 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{fontSize: '14px', color: '#666', marginRight: '8px'}}>关键字</span>
              <input 
                type="text" 
                placeholder="地址/收件人"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  border: '1px solid #ccc',
                  padding: '4px 8px',
                  width: '200px',
                  marginRight: '10px',
                  fontSize: '14px'
                }}
              />
              <button 
                className={styles.btn} 
                onClick={() => {}} 
                style={{marginRight: '10px', padding: '4px 15px'}}
              >
                查询
              </button>
              <button 
                className={styles.btn} 
                onClick={() => window.location.href='/user-center/common-info/addresses/add'}
                style={{padding: '4px 15px'}}
              >
                新增
              </button>
            </div>

            <div className={styles.card} style={{border: '1px solid #ddd'}}>
              <div className={styles.cardBody} style={{padding: 0}}>
                {loading && (<div style={{padding: '20px'}}>加载中…</div>)}
                {!loading && (
                  <>
                    <table className={styles.table} style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead style={{backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd'}}>
                        <tr>
                          <th style={{width: '60px', textAlign: 'center', padding: '10px 0'}}>
                             <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <span style={{marginRight:'4px'}}>
                                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                                </span>
                                <span style={{fontSize:'12px', color:'#666'}}>全选</span>
                             </div>
                          </th>
                          <th style={{textAlign: 'left', padding: '10px'}}>收件人</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>省份</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>城市</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>区县</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>详细地址</th>
                          <th style={{textAlign: 'center', padding: '10px'}}>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredList.length === 0 ? (
                          <tr><td colSpan={7} style={{textAlign:'center', padding: '20px'}}>暂无数据</td></tr>
                        ) : (
                          filteredList.map(item => (
                            <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                              <td style={{textAlign: 'center', padding: '10px'}}>
                                <input 
                                  type="checkbox" 
                                  checked={selectedIds.includes(item.id)}
                                  onChange={() => handleSelectOne(item.id)}
                                />
                              </td>
                              <td style={{padding: '10px'}}>{item.receiver}</td>
                              <td style={{padding: '10px'}}>{item.province}</td>
                              <td style={{padding: '10px'}}>{item.city}</td>
                              <td style={{padding: '10px'}}>{item.district}</td>
                              <td style={{padding: '10px'}}>{item.detail}</td>
                              <td style={{textAlign: 'center', padding: '10px'}}>
                                <a href="#" className={styles.deleteLink} onClick={(e)=>{e.preventDefault(); handleDelete(item.id);}}>删除</a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    
                    {/* 底部批量操作栏 */}
                    <div style={{
                      padding: '10px 15px', 
                      backgroundColor: '#f4f4f4', 
                      borderTop: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                       <label style={{display: 'flex', alignItems: 'center', marginRight: '20px', cursor: 'pointer'}}>
                          <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} style={{marginRight: '5px'}} />
                          <span style={{fontSize: '12px'}}>全选</span>
                       </label>
                       
                       <div 
                         onClick={handleBatchDelete} 
                         style={{
                           cursor: 'pointer', 
                           display: 'flex', 
                           alignItems: 'center', 
                           color: '#0066cc',
                           fontSize: '12px'
                         }}
                       >
                         <span style={{fontWeight: 'bold', fontSize: '16px', marginRight: '2px'}}>×</span> 删除
                       </div>
                    </div>
                  </>
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


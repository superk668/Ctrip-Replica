import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="travelers" />);

const TravelersManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) return;
      // 保持原有后端搜索逻辑
      const res = await fetch(`/api/users/me/travelers?keyword=${encodeURIComponent(keyword)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setList(Array.isArray(data.data?.items) ? data.data.items : []);
      } else {
        setList([]);
      }
    } catch (e) {
      console.error(e);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初始化加载

  // 查询按钮点击
  const handleSearch = () => {
    fetchList();
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === list.length && list.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(list.map(x => x.id));
    }
  };

  const isAllSelected = list.length > 0 && selectedIds.length === list.length;

  const handleDelete = async (ids) => {
    if (!ids.length) return;
    const ok = window.confirm(`确认删除选中的 ${ids.length} 条旅客信息？`);
    if (!ok) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me/travelers', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      const data = await res.json();
      if (data.success) {
        fetchList();
        setSelectedIds([]);
      } else {
        alert(data.msg || '删除失败');
      }
    } catch (e) {
      console.error(e);
      alert('删除失败');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert('请先选择要删除的旅客');
      return;
    }
    handleDelete(selectedIds);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.mainArea}>
            {/* 顶部工具栏 - 保持与 AddressManagement 一致的样式 */}
            <div style={{
              backgroundColor: '#fff', 
              border: '1px solid #ddd', 
              padding: '10px 15px', 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{fontSize: '14px', color: '#666', marginRight: '8px'}}>旅客姓名</span>
              <input 
                type="text" 
                placeholder="中文名/英文名"
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
                onClick={handleSearch} 
                style={{marginRight: '10px', padding: '4px 15px'}}
              >
                查询
              </button>
              <button 
                className={styles.btn} 
                onClick={() => window.location.href='/user-center/common-info/travelers/add'}
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
                    <table className={styles.table} style={{width: '100%', borderCollapse: 'collapse', fontSize: '12px'}}>
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
                          <th style={{textAlign: 'left', padding: '10px'}}>姓名</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>手机/电话</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>证件类型</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>证件号码</th>
                          <th style={{textAlign: 'left', padding: '10px'}}>国籍(国家/地区)</th>
                          <th style={{textAlign: 'center', padding: '10px'}}>性别</th>
                          <th style={{textAlign: 'center', padding: '10px'}}>常旅客卡</th>
                          <th style={{textAlign: 'center', padding: '10px'}}>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.length === 0 ? (
                          <tr><td colSpan={9} style={{textAlign:'center', padding: '20px'}}>暂无数据</td></tr>
                        ) : (
                          list.map((row) => (
                            <tr key={row.id} style={{borderBottom: '1px solid #eee'}}>
                              <td style={{textAlign: 'center', padding: '10px'}}>
                                <input 
                                  type="checkbox" 
                                  checked={selectedIds.includes(row.id)}
                                  onChange={() => handleSelectOne(row.id)}
                                />
                              </td>
                              <td style={{padding: '10px'}}>
                                {row.isSelf && <span className={styles.badgeSelf} style={{marginRight:'4px'}}>本人</span>}
                                {row.name}
                              </td>
                              <td style={{padding: '10px'}}>{row.phone}</td>
                              <td style={{padding: '10px'}}>{row.document?.type || ''}</td>
                              <td style={{padding: '10px'}}>{row.document?.no || ''}</td>
                              <td style={{padding: '10px'}}>{row.nationality || ''}</td>
                              <td style={{textAlign: 'center', padding: '10px'}}>
                                {['M','m','男'].includes(row.gender) ? '男' : (['F','f','女'].includes(row.gender) ? '女' : row.gender)}
                              </td>
                              <td style={{textAlign: 'center', padding: '10px'}}>{row.ffCard || '无'}</td>
                              <td style={{textAlign: 'center', padding: '10px'}}>
                                <a href={`/user-center/common-info/travelers/view?id=${row.id}`} style={{marginRight:'8px', color: '#0066cc'}}>查看</a>
                                <a href={`/user-center/common-info/travelers/edit?id=${row.id}`} style={{marginRight:'8px', color: '#0066cc'}}>编辑</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleDelete([row.id]); }} style={{color: '#0066cc'}}>删除</a>
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

export default TravelersManagement;

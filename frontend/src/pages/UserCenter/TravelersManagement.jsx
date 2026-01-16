import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="travelers" />);

const TravelersManagement = () => {
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const travelerById = useMemo(() => {
    const map = new Map();
    (list || []).forEach((t) => {
      if (t && t.id !== undefined && t.id !== null) map.set(t.id, t);
    });
    return map;
  }, [list]);

  const unmarkSelfBeforeDelete = async (token, ids) => {
    const selfIds = ids.filter((id) => travelerById.get(id)?.isSelf);
    for (const id of selfIds) {
      const res = await fetch(`/api/users/me/travelers/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSelf: false })
      });
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        const message = data.message || data.msg || '清除本人标识失败';
        throw new Error(message);
      }
    }
  };

  const fetchList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/users/me/travelers?keyword=${encodeURIComponent(keyword)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setList(data.data.items);
      } else {
        setList([]);
      }
    } catch (e) {
      console.error(e);
      setList([]);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = () => {
    fetchList();
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(list.map(x => x.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = async (ids) => {
    if (!ids.length) return;
    const containsSelf = ids.some((id) => travelerById.get(id)?.isSelf);
    const confirmText = containsSelf
      ? '选中旅客包含“本人”。系统会先清除本人标识再删除，确认继续吗？'
      : '确认删除选中的旅客信息吗？';
    if (!window.confirm(confirmText)) return;
    try {
      const token = localStorage.getItem('token');

      if (containsSelf) {
        await unmarkSelfBeforeDelete(token, ids);
      }

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
        const message = data.message || data.msg || '删除失败';
        if (res.status === 409 && message.includes('Contains non-deletable travelers')) {
          alert('选中旅客包含“本人”，请先取消本人标识后再删除。');
          return;
        }
        alert(message);
      }
    } catch (e) {
      console.error(e);
      alert(e?.message ? `删除失败：${e.message}` : '删除失败');
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
              <div className={styles.title}>常用旅客信息</div>
              <div className={styles.hint}>维护本人及常用同行人信息</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.toolbar}>
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{display: 'inline-flex', alignItems: 'center'}}>
                    <input 
                      className={styles.searchInput} 
                      placeholder="中文名/英文名" 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className={styles.btn}>查询</button>
                  </form>
                  <a className={styles.btn} href="/user-center/common-info/travelers/add" style={{marginLeft: '12px'}}>新增</a>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>选择</th>
                      <th>标识</th>
                      <th>姓名</th>
                      <th>手机/电话</th>
                      <th>证件类型</th>
                      <th>证件号码</th>
                      <th>国籍(国家/地区)</th>
                      <th>性别</th>
                      <th>常旅客卡</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr><td colSpan={10} style={{textAlign:'center', color:'#666'}}>{keyword ? '未找到旅客' : '暂无记录'}</td></tr>
                    ) : (
                      list.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(row.id)}
                              onChange={() => handleSelect(row.id)}
                            />
                          </td>
                          <td>{row.isSelf ? <span className={styles.badgeSelf}>本人</span> : null}</td>
                          <td>{row.name || ''}</td>
                          <td>{row.phone || ''}</td>
                          <td>{row.document?.type || ''}</td>
                          <td>{row.document?.no || ''}</td>
                          <td>{row.nationality || ''}</td>
                          <td>{['M','m','男'].includes(row.gender) ? '男' : (['F','f','女'].includes(row.gender) ? '女' : row.gender)}</td>
                          <td>{row.ffCard || '无'}</td>
                          <td className={styles.ops}>
                            <a href={`/user-center/common-info/travelers/view?id=${row.id}`}>查看</a>
                            <a href={`/user-center/common-info/travelers/edit?id=${row.id}`}>编辑</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleDelete([row.id]); }}>删除</a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className={styles.bottomOps}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={list.length > 0 && selectedIds.length === list.length}
                      onChange={handleSelectAll}
                    /> 全选
                  </label>
                  <a href="#" className={styles.deleteLink} onClick={(e) => { e.preventDefault(); handleDelete(selectedIds); }}>删除</a>
                </div>
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

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import avatarSvg from '../../assets/placeholders/user-avatar.svg';

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.sectionTitle}>我的携程首页</div>
    <div className={styles.sideGroup}>快捷入口</div>
    <a className={styles.menuItem} href="/orders">订单</a>
    <a className={styles.menuItem} href="#">我的消息</a>
    <div className={styles.sectionTitle}>常用信息</div>
    <a className={styles.menuItem} href="/user-center/common-info">常用信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/travelers">常用旅客信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/contacts">常用联系人</a>
    <a className={styles.menuItem} href="/user-center/common-info/invoices">常用报销凭证</a>
    <a className={styles.menuItem} href="/user-center/common-info/addresses">常用地址</a>
    <div className={styles.sectionTitle}>个人中心</div>
    <a className={`${styles.menuItem} ${styles.menuItemActive}`} href="/user-center/my-info">我的信息</a>
    <a className={styles.menuItem} href="/user-center/bind-link">绑定和关联</a>
    <a className={styles.menuItem} href="/user-center/security">账户安全</a>
    <a className={styles.menuItem} href="/user-center/community">我的社区主页</a>
  </aside>
);

const InfoRow = ({ label, value, action }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value}</div>
    {action && <a className={styles.actionLink} href="#">{action}</a>}
  </div>
);

const MyInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ nickname: '', name: '', gender: '', birthday: '' });
  const [phoneMasked, setPhoneMasked] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [errors, setErrors] = useState({ nickname: '', name: '', gender: '', birthday: '' });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Add timestamp to prevent caching
      const res = await fetch(`/api/users/me/profile?_t=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        setProfile({
          nickname: data.data.nickname || '',
          name: data.data.name || '',
          gender: data.data.gender || '',
          birthday: data.data.birthday || ''
        });
        setPhoneMasked(data.data.phoneMasked || '');
        setEmailStatus(data.data.emailStatus || '未绑定');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, [location.key]);

  const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const notFuture = (s) => {
    try { const d = new Date(s); const today = new Date(); today.setHours(0,0,0,0); return d <= today; } catch (_) { return false; }
  };

  const handleSave = async () => {
    const next = { nickname: '', name: '', gender: '', birthday: '' };
    if (!profile.nickname || profile.nickname.length > 20) next.nickname = '请输入昵称（不超过20字符）';
    if (!profile.name || profile.name.length > 30 || /[0-9~!@#$%^&*()_+\-={}\[\]|;:"'<>,.?/]/.test(profile.name)) next.name = '请输入合法姓名';
    if (!profile.gender) next.gender = '请选择性别';
    if (profile.birthday) {
      if (!isValidDate(profile.birthday) || !notFuture(profile.birthday)) next.birthday = '日期格式应为 yyyy-MM-dd';
    }
    setErrors(next);
    const hasErr = Object.values(next).some(Boolean);
    if (hasErr) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setProfile({
          nickname: data.data.nickname,
          name: data.data.name,
          gender: data.data.gender,
          birthday: data.data.birthday
        });
        setIsEditing(false);
      } else {
        alert(data.msg || '保存失败');
      }
    } catch (e) {
      console.error(e);
      alert('保存失败');
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
              <div className={styles.title}>个人信息设置</div>
              <div className={styles.hint}>完善信息以提升账户安全与体验</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><div>基本信息</div>{!isEditing ? (<a className={styles.actionLink} href="#" onClick={(e)=>{e.preventDefault(); setIsEditing(true);}}>编辑</a>) : (<a className={styles.actionLink} href="#" onClick={(e)=>{e.preventDefault(); setIsEditing(false);}}>收起</a>)}</div>
              <div className={styles.cardBody}>
                <InfoRow label="手机" value={phoneMasked || '未填写'} action="修改" />
                <InfoRow label="邮箱" value={emailStatus || '未绑定'} action="验证" />
                {!isEditing && (
                  <>
                    <InfoRow label="昵称" value={profile.nickname || '未设置'} />
                    <InfoRow label="姓名" value={profile.name || '未设置'} />
                    <InfoRow label="性别" value={profile.gender || '未设置'} />
                    <InfoRow label="生日" value={profile.birthday || '未设置'} />
                  </>
                )}
                {isEditing && (
                  <>
                    <div className={styles.formRow}>
                      <div className={`${styles.infoLabel} ${styles.labelReq}`}>昵称</div>
                      <input className={styles.input} value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} />
                      {!!errors.nickname && <div className={styles.errorText}>{errors.nickname}</div>}
                    </div>
                    <div className={styles.formRow}>
                      <div className={`${styles.infoLabel} ${styles.labelReq}`}>姓名</div>
                      <input className={styles.input} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                      {!!errors.name && <div className={styles.errorText}>{errors.name}</div>}
                    </div>
                    <div className={styles.formRow}>
                      <div className={`${styles.infoLabel} ${styles.labelReq}`}>性别</div>
                      <div className={styles.radioGroup}>
                        <label><input type="radio" name="gender" checked={profile.gender === '男'} onChange={() => setProfile({ ...profile, gender: '男' })} /> 男</label>
                        <label><input type="radio" name="gender" checked={profile.gender === '女'} onChange={() => setProfile({ ...profile, gender: '女' })} /> 女</label>
                      </div>
                      {!!errors.gender && <div className={styles.errorText}>{errors.gender}</div>}
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.infoLabel}>生日</div>
                      <input className={styles.input} placeholder="yyyy-mm-dd" value={profile.birthday} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} />
                      {!!errors.birthday && <div className={styles.errorText}>{errors.birthday}</div>}
                    </div>
                    <div className={styles.saveRow}>
                      <button className={styles.saveBtn} onClick={handleSave}>保存</button>
                      <div className={styles.note}><span className={styles.noteIcon}>i</span> 新昵称将在审核后生效</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><div>头像设置</div></div>
              <div className={styles.cardBody}>
                <div className={styles.avatarRow}>
                  <img src={avatarSvg} alt="占位 用户头像" className={styles.avatar} />
                  <button className={styles.editBtn}>编辑头像</button>
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

export default MyInfo;


import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.sectionTitle}>我的携程首页</div>
    <div className={styles.sideGroup}>快捷入口</div>
    <a className={styles.menuItem} href="/orders">订单</a>
    <a className={styles.menuItem} href="#">我的消息</a>
    <div className={styles.sectionTitle}>常用信息</div>
    <a className={styles.menuItem} href="/user-center/common-info">常用信息</a>
    <a className={`${styles.menuItem} ${styles.menuItemActive}`} href="/user-center/common-info/travelers">常用旅客信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/contacts">常用联系人</a>
    <a className={styles.menuItem} href="/user-center/common-info/invoices">常用报销凭证</a>
    <a className={styles.menuItem} href="/user-center/common-info/addresses">常用地址</a>
    <div className={styles.sectionTitle}>个人中心</div>
    <a className={styles.menuItem} href="/user-center/my-info">我的信息</a>
    <a className={styles.menuItem} href="/user-center/bind-link">绑定和关联</a>
    <a className={styles.menuItem} href="/user-center/security">账户安全</a>
    <a className={styles.menuItem} href="/user-center/community">我的社区主页</a>
  </aside>
);

const TravelerEdit = () => {
  const [id, setId] = useState(null);
  const [cnName, setCnName] = useState('');
  const [enLast, setEnLast] = useState('');
  const [enFirst, setEnFirst] = useState('');
  const [isSelf, setIsSelf] = useState(false);
  const [idType, setIdType] = useState('身份证');
  const [idNumber, setIdNumber] = useState('');
  const [triedSave, setTriedSave] = useState(false);

  // Additional fields
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const [validTill, setValidTill] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setId(id);
      fetchTraveler(id);
    }
  }, []);

  const fetchTraveler = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/users/me/travelers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const t = data.data.traveler;
        setCnName(t.cnName || '');
        setEnLast(t.enLast || '');
        setEnFirst(t.enFirst || '');
        setIsSelf(t.isSelf);
        setNationality(t.nationality || '');
        setGender(t.gender || '');
        setBirthday(t.birthday || '');
        setBirthplace(t.birthplace || '');
        setPhone(t.phone || '');
        setFax(t.fax || '');
        setEmail(t.email || '');
        setIdType(t.document?.type || '身份证');
        setIdNumber(t.document?.no || '');
        setValidTill(t.document?.validTill || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const nameValid = (cnName.trim().length > 0) || (enLast.trim().length > 0 && enFirst.trim().length > 0);
  const idTypeValid = idType !== '';
  const idNumberValid = idNumber.trim().length > 0;
  const formValid = nameValid && idTypeValid && idNumberValid;

  const handleSave = async (e) => {
    e.preventDefault();
    setTriedSave(true);
    if (!formValid) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const payload = {
        cnName: cnName.trim(),
        enLast: enLast.trim(),
        enFirst: enFirst.trim(),
        isSelf,
        nationality,
        gender,
        birthday,
        birthplace,
        phone,
        fax,
        email,
        document: {
          type: idType,
          no: idNumber,
          validTill
        }
      };

      const res = await fetch(`/api/users/me/travelers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = '/user-center/common-info/travelers';
      } else {
        alert(data.msg || '保存失败');
      }
    } catch (err) {
      console.error(err);
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
              <div className={styles.title}>编辑常用旅客信息</div>
              <div className={styles.hint}>中文名与英文名两者至少填写一项</div>
              <a href="/user-center/common-info/travelers" className={styles.actionLink}>查看所有旅客信息</a>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>旅客信息</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>中文名</div><input className={styles.input} value={cnName} onChange={(e)=>setCnName(e.target.value)} /></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>英文名</div><div style={{display:'flex',gap:'8px'}}><input className={styles.input} placeholder="LastName(姓)" value={enLast} onChange={(e)=>setEnLast(e.target.value)} /><input className={styles.input} placeholder="FirstName(名)" value={enFirst} onChange={(e)=>setEnFirst(e.target.value)} /></div>{triedSave && !nameValid && (<div className={styles.errorText}>中文名或英文名至少填写一个（英文需姓与名）</div>)}</div>
                <div className={styles.formRow}><div className={styles.infoLabel}></div><label style={{display:'inline-flex',alignItems:'center',gap:'6px'}}><input type="checkbox" checked={isSelf} onChange={(e)=>setIsSelf(e.target.checked)} /> 设置为本人</label></div>

                <div className={styles.formRow}><div className={styles.infoLabel}>国籍(国家/地区)</div><input className={styles.input} placeholder="中国大陆" value={nationality} onChange={(e)=>setNationality(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>性别</div><div className={styles.radioGroup}>
                  <label><input type="radio" name="gender" checked={gender === 'M'} onChange={()=>setGender('M')} /> 男</label>
                  <label><input type="radio" name="gender" checked={gender === 'F'} onChange={()=>setGender('F')} /> 女</label>
                </div></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>生日</div><input className={styles.input} placeholder="yyyy-MM-dd" value={birthday} onChange={(e)=>setBirthday(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>出生地</div><input className={styles.input} placeholder="省市/国家" value={birthplace} onChange={(e)=>setBirthplace(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>手机号</div><input className={styles.input} placeholder="用于接收通知" value={phone} onChange={(e)=>setPhone(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>传真号码</div><input className={styles.input} value={fax} onChange={(e)=>setFax(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>Email</div><input className={styles.input} placeholder="用于接收通知" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>证件信息</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>证件类型</div><select className={styles.input} value={idType} onChange={(e)=>setIdType(e.target.value)}><option value="身份证">身份证</option><option value="护照">护照</option></select>{triedSave && !idTypeValid && (<div className={styles.errorText}>请选择证件类型</div>)}</div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>证件号码</div><input className={styles.input} value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} />{triedSave && !idNumberValid && (<div className={styles.errorText}>请输入证件号码</div>)}</div>
                <div className={styles.formRow}><div className={styles.infoLabel}>有效期</div><input className={styles.input} placeholder="yyyy-MM-dd" value={validTill} onChange={(e)=>setValidTill(e.target.value)} /><a className={styles.actionLink} href="#" style={{marginLeft:'12px'}}>设为长期有效</a></div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>常旅客卡</div></div>
              <div className={styles.cardBody}><a className={styles.actionLink} href="#">添加常旅客卡</a></div>
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

export default TravelerEdit;

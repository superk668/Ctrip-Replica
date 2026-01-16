import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="travelers" />);

const TravelerAdd = () => {
  const [cnName, setCnName] = useState('');
  const [enLast, setEnLast] = useState('');
  const [enFirst, setEnFirst] = useState('');
  const [isSelf, setIsSelf] = useState(false);
  const [idType, setIdType] = useState('');
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

  const isPhoneValid = (p) => !p || /^1[3-9]\d{9}$/.test(p.trim());
  const isEmailValid = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const isChineseID = (s) => !!s && (/^\d{15}$/.test(s.trim()) || /^\d{17}[\dXx]$/.test(s.trim()));
  const isPassport = (s) => !!s && /^[A-Za-z0-9]{5,17}$/.test(s.trim());
  const isDateYMD = (s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s.trim());

  const nameValid = (cnName.trim().length > 0) || (enLast.trim().length > 0 && enFirst.trim().length > 0);
  const idTypeValid = idType !== '';
  const idNumberValid = idType === '身份证' ? isChineseID(idNumber) : idType === '护照' ? isPassport(idNumber) : false;
  const phoneValid = isPhoneValid(phone);
  const emailValid = isEmailValid(email);
  const birthdayValid = isDateYMD(birthday);
  const validTillValid = isDateYMD(validTill);
  const formValid = nameValid && idTypeValid && idNumberValid && phoneValid && emailValid && birthdayValid && validTillValid;

  const formatTravelerLabel = (t) => {
    if (!t) return '';
    const name = (t.name || t.cnName || '').trim();
    const docType = t.document?.type || '';
    const docNo = t.document?.no || '';
    const doc = `${docType}${docNo ? ` ${docNo}` : ''}`.trim();
    return `${name}${name && doc ? '，' : ''}${doc}`.trim();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setTriedSave(true);
    
    if (!nameValid || !idTypeValid || !idNumberValid) {
      alert('请填写所有必填项（姓名、证件类型、证件号码）且格式正确');
      return;
    }
    if (!phoneValid) { alert('手机号格式不正确'); return; }
    if (!emailValid) { alert('Email格式不正确'); return; }
    if (!birthdayValid) { alert('生日格式应为 yyyy-MM-dd'); return; }
    if (!validTillValid) { alert('有效期格式应为 yyyy-MM-dd'); return; }

    try {
      let token = localStorage.getItem('token');
      // Double check mechanism: log debug info
      if (!token) {
        console.warn('Token not found in localStorage');
        // Try to recover from user object if possible (unlikely but safe fallback)
        try {
           const userStr = localStorage.getItem('user');
           if (userStr) {
             const u = JSON.parse(userStr);
             if (u.token) token = u.token;
           }
        } catch (_) {}
      }

      if (!token) {
        alert('登录状态失效 (Token missing)，请重新登录');
        window.location.href = '/login';
        return;
      }

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
      
      const res = await fetch('/api/users/me/travelers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        alert('登录已过期，请重新登录');
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      if (data.success) {
        window.location.href = '/user-center/common-info/travelers';
      } else {
        const message = data.message || data.msg || '';
        if (res.status === 409 && message.includes('Self traveler already exists')) {
          const existingLabel = formatTravelerLabel(data.data?.existing);
          const suffix = existingLabel ? `\n当前已设置为本人的旅客：${existingLabel}` : '';
          alert(`本人信息只能存在一个。${suffix}\n如需更换本人，请先到旅客列表编辑该旅客，取消“设置为本人”，再保存。`);
          return;
        }
        alert(message || '保存失败');
      }
    } catch (err) {
      console.error(err);
      alert('保存失败: ' + err.message);
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
              <div className={styles.title}>新增常用旅客信息</div>
              <div className={styles.hint}>中文名与英文名二选一，证件类型与证件号码为必填</div>
              <a href="/user-center/common-info/travelers" className={styles.actionLink}>查看所有旅客信息</a>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>旅客信息</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>中文名</div><input className={styles.input} placeholder="请输入中文姓名" value={cnName} onChange={(e)=>setCnName(e.target.value)} /></div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>英文名</div><div style={{display:'flex',gap:'8px'}}><input className={styles.input} placeholder="LastName(姓)" value={enLast} onChange={(e)=>setEnLast(e.target.value)} /><input className={styles.input} placeholder="FirstName(名)" value={enFirst} onChange={(e)=>setEnFirst(e.target.value)} /></div>{triedSave && !nameValid && (<div className={styles.errorText}>中文名或英文名至少填写一个（英文需姓与名）</div>)}</div>
                <div className={styles.formRow}><div className={styles.infoLabel}></div><label style={{display:'inline-flex',alignItems:'center',gap:'6px'}}><input type="checkbox" checked={isSelf} onChange={(e)=>setIsSelf(e.target.checked)} /> 设置为本人</label></div>

                <div className={styles.formRow}><div className={styles.infoLabel}>国籍(国家/地区)</div><input className={styles.input} placeholder="中国大陆" value={nationality} onChange={(e)=>setNationality(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>性别</div><div className={styles.radioGroup}>
                  <label><input type="radio" name="gender" checked={gender === 'M'} onChange={()=>setGender('M')} /> 男</label>
                  <label><input type="radio" name="gender" checked={gender === 'F'} onChange={()=>setGender('F')} /> 女</label>
                </div></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>生日</div><input className={styles.input} placeholder="yyyy-MM-dd" value={birthday} onChange={(e)=>setBirthday(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>出生地</div><input className={styles.input} placeholder="省市/国家" value={birthplace} onChange={(e)=>setBirthplace(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>手机号</div><input className={styles.input} placeholder="用于接收通知" value={phone} onChange={(e)=>setPhone(e.target.value)} />{triedSave && !phoneValid && (<div className={styles.errorText}>手机号格式不正确</div>)}</div>
                <div className={styles.formRow}><div className={styles.infoLabel}>传真号码</div><input className={styles.input} value={fax} onChange={(e)=>setFax(e.target.value)} /></div>
                <div className={styles.formRow}><div className={styles.infoLabel}>Email</div><input className={styles.input} placeholder="用于接收通知" value={email} onChange={(e)=>setEmail(e.target.value)} />{triedSave && !emailValid && (<div className={styles.errorText}>Email格式不正确</div>)}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.sectionLine}>证件信息</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>证件类型</div><select className={styles.input} value={idType} onChange={(e)=>setIdType(e.target.value)}><option value="">请选择</option><option value="身份证">身份证</option><option value="护照">护照</option></select>{triedSave && !idTypeValid && (<div className={styles.errorText}>请选择证件类型</div>)}</div>
                <div className={styles.formRow}><div className={`${styles.infoLabel} ${styles.labelReq}`}>证件号码</div><input className={styles.input} value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} />{triedSave && !idNumberValid && (<div className={styles.errorText}>证件号码格式不正确</div>)}</div>
                <div className={styles.formRow}><div className={styles.infoLabel}>有效期</div><input className={styles.input} placeholder="yyyy-MM-dd" value={validTill} onChange={(e)=>setValidTill(e.target.value)} />{triedSave && !validTillValid && (<div className={styles.errorText}>有效期格式应为 yyyy-MM-dd</div>)}<a className={styles.actionLink} href="#" style={{marginLeft:'12px'}}>设为长期有效</a></div>
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

export default TravelerAdd;

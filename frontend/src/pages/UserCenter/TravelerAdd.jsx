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
  const [gender, setGender] = useState('U'); // M, F, U(Unknown)
  const [birthday, setBirthday] = useState('');
  const [birthplace, setBirthplace] = useState('');
  
  // Phone contact
  const [phoneMainland, setPhoneMainland] = useState('');
  const [phoneOverseasArea, setPhoneOverseasArea] = useState('852');
  const [phoneOverseasNo, setPhoneOverseasNo] = useState('');

  // Fax
  const [faxArea, setFaxArea] = useState('');
  const [faxTel, setFaxTel] = useState('');
  const [faxExt, setFaxExt] = useState('');

  const [email, setEmail] = useState('');
  const [validTill, setValidTill] = useState('');

  // Frequent Flyer Cards
  const [ffCards, setFfCards] = useState([]); // [{ airline: '', cardNo: '' }]

  const isPhoneValid = (p) => !p || /^1[3-9]\d{9}$/.test(p.trim());
  const isEmailValid = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const isChineseID = (s) => !!s && (/^\d{15}$/.test(s.trim()) || /^\d{17}[\dXx]$/.test(s.trim()));
  const isPassport = (s) => !!s && /^[A-Za-z0-9]{5,17}$/.test(s.trim());
  const isDateYMD = (s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s.trim());

  const nameValid = (cnName.trim().length > 0) || (enLast.trim().length > 0 && enFirst.trim().length > 0);
  const idTypeValid = idType !== '';
  const idNumberValid = idType === '身份证' ? isChineseID(idNumber) : idType === '护照' ? isPassport(idNumber) : false;
  
  // Phone validation: mainland OR overseas
  const phoneValid = (!phoneMainland && !phoneOverseasNo) || 
                     (phoneMainland && isPhoneValid(phoneMainland)) ||
                     (phoneOverseasNo && phoneOverseasNo.length > 5); // Simple check for overseas

  const emailValid = isEmailValid(email);
  const birthdayValid = isDateYMD(birthday);
  const validTillValid = isDateYMD(validTill);
  const formValid = nameValid && idTypeValid && idNumberValid && phoneValid && emailValid && birthdayValid && validTillValid;

  const addFFCard = (e) => {
    e.preventDefault();
    setFfCards([...ffCards, { airline: '', cardNo: '' }]);
  };

  const removeFFCard = (idx, e) => {
    e.preventDefault();
    const next = [...ffCards];
    next.splice(idx, 1);
    setFfCards(next);
  };

  const updateFFCard = (idx, field, val) => {
    const next = [...ffCards];
    next[idx][field] = val;
    setFfCards(next);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setTriedSave(true);
    
    if (!nameValid || !idTypeValid || !idNumberValid) {
      alert('请填写所有必填项（姓名、证件类型、证件号码）且格式正确');
      return;
    }
    if (phoneMainland && !isPhoneValid(phoneMainland)) { alert('大陆手机号格式不正确'); return; }
    if (!emailValid) { alert('Email格式不正确'); return; }
    if (!birthdayValid) { alert('生日格式应为 yyyy-MM-dd'); return; }
    if (!validTillValid) { alert('有效期格式应为 yyyy-MM-dd'); return; }

    try {
      let token = localStorage.getItem('token');
      // Double check mechanism: log debug info
      if (!token) {
        console.warn('Token not found in localStorage');
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

      // Construct phone and fax strings
      const finalPhone = phoneMainland ? phoneMainland : (phoneOverseasNo ? `+${phoneOverseasArea}-${phoneOverseasNo}` : '');
      const finalFax = (faxArea || faxTel || faxExt) ? `${faxArea}-${faxTel}-${faxExt}` : '';

      const payload = {
        cnName: cnName.trim(),
        enLast: enLast.trim(),
        enFirst: enFirst.trim(),
        isSelf,
        nationality,
        gender,
        birthday,
        birthplace,
        phone: finalPhone,
        fax: finalFax,
        email,
        document: {
          type: idType,
          no: idNumber,
          validTill
        },
        ffCards // Add this to backend payload if supported, otherwise backend might ignore it
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
        alert(data.msg || '保存失败');
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
            <div className={styles.headerBar} style={{borderBottom: 'none', paddingBottom: '0'}}>
              <div className={styles.title} style={{fontSize: '18px', fontWeight: 'bold'}}>新增常用旅客信息</div>
              <div className={styles.hint} style={{color: '#999', fontSize: '12px', marginLeft: '10px'}}>请填写如下常用旅客信息，<span style={{color:'red'}}>*</span>为必选项。</div>
              <a href="/user-center/common-info/travelers" className={styles.actionLink} style={{float: 'right'}}>查看所有旅客信息</a>
            </div>

            {/* 旅客信息 Section */}
            <div style={{marginTop: '20px'}}>
              <div style={{
                borderLeft: '4px solid #0066cc', 
                paddingLeft: '10px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#333',
                marginBottom: '15px'
              }}>
                旅客信息
              </div>
              
              {/* 灰色背景的姓名区域 */}
              <div style={{backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px'}}>
                <div style={{marginBottom: '10px', color: '#666', fontSize: '12px', paddingLeft: '80px'}}>
                   <span style={{color:'red'}}>*</span>中文名与英文名两者必填一项
                </div>
                <div className={styles.formRow} style={{border: 'none', padding: '5px 0'}}>
                   <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>中文名</div>
                   <input className={styles.input} style={{width: '240px'}} placeholder="请输入中文姓名" value={cnName} onChange={(e)=>setCnName(e.target.value)} />
                </div>
                <div className={styles.formRow} style={{border: 'none', padding: '5px 0'}}>
                   <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>英文名</div>
                   <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                     <input className={styles.input} style={{width: '115px'}} placeholder="LastName(姓)" value={enLast} onChange={(e)=>setEnLast(e.target.value)} />
                     <input className={styles.input} style={{width: '115px'}} placeholder="FirstName(名)" value={enFirst} onChange={(e)=>setEnFirst(e.target.value)} />
                     <span style={{color: '#0066cc', cursor: 'pointer', fontSize: '14px'}}>?</span>
                   </div>
                </div>
                 <div className={styles.formRow} style={{border: 'none', padding: '5px 0'}}>
                   <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}></div>
                   <label style={{display:'inline-flex',alignItems:'center',gap:'6px', fontSize: '12px'}}>
                     <input type="checkbox" checked={isSelf} onChange={(e)=>setIsSelf(e.target.checked)} /> 设置为本人
                   </label>
                </div>
              </div>

              {/* 其他基本信息 */}
              <div style={{paddingLeft: '0'}}>
                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px', color: '#666'}}>
                    <div>国籍</div>
                    <div style={{fontSize: '12px', transform: 'scale(0.8)', transformOrigin: 'right top'}}>(国家/地区)</div>
                  </div>
                  <input className={styles.input} style={{width: '240px'}} placeholder="中文/英文" value={nationality} onChange={(e)=>setNationality(e.target.value)} />
                </div>
                
                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>性别</div>
                  <div className={styles.radioGroup}>
                    <label style={{marginRight: '15px'}}><input type="radio" name="gender" checked={gender === 'M'} onChange={()=>setGender('M')} /> 男</label>
                    <label style={{marginRight: '15px'}}><input type="radio" name="gender" checked={gender === 'F'} onChange={()=>setGender('F')} /> 女</label>
                    <label><input type="radio" name="gender" checked={gender === 'U'} onChange={()=>setGender('U')} /> 未知</label>
                  </div>
                </div>

                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>生日</div>
                  <input className={styles.input} style={{width: '240px'}} placeholder="yyyy-MM-dd" value={birthday} onChange={(e)=>setBirthday(e.target.value)} />
                </div>

                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>出生地</div>
                  <input className={styles.input} style={{width: '240px'}} value={birthplace} onChange={(e)=>setBirthplace(e.target.value)} />
                </div>

                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>手机号码</div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <input className={styles.input} style={{width: '180px'}} placeholder="大陆手机" value={phoneMainland} onChange={(e)=>setPhoneMainland(e.target.value)} />
                    <span style={{margin: '0 10px'}}>或</span>
                    <select className={styles.input} style={{width: '120px', marginRight: '10px'}} value={phoneOverseasArea} onChange={(e)=>setPhoneOverseasArea(e.target.value)}>
                      <option value="852">中国香港 852</option>
                      <option value="853">中国澳门 853</option>
                      <option value="886">中国台湾 886</option>
                      <option value="1">美国 1</option>
                      {/* 更多区号可在此添加 */}
                    </select>
                    <input className={styles.input} style={{width: '150px'}} placeholder="非大陆手机" value={phoneOverseasNo} onChange={(e)=>setPhoneOverseasNo(e.target.value)} />
                  </div>
                  {triedSave && !phoneValid && (<div className={styles.errorText} style={{marginLeft: '10px'}}>请输入有效的手机号码</div>)}
                </div>

                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>传真号码</div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                     <input className={styles.input} style={{width: '60px', marginRight: '10px'}} placeholder="区号" value={faxArea} onChange={(e)=>setFaxArea(e.target.value)} />
                     <input className={styles.input} style={{width: '120px', marginRight: '10px'}} placeholder="电话" value={faxTel} onChange={(e)=>setFaxTel(e.target.value)} />
                     <input className={styles.input} style={{width: '60px'}} placeholder="分机" value={faxExt} onChange={(e)=>setFaxExt(e.target.value)} />
                  </div>
                </div>

                <div className={styles.formRow} style={{border: 'none', padding: '8px 0'}}>
                  <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>Email</div>
                  <input className={styles.input} style={{width: '240px'}} value={email} onChange={(e)=>setEmail(e.target.value)} />
                  {triedSave && !emailValid && (<div className={styles.errorText} style={{marginLeft: '10px'}}>Email格式不正确</div>)}
                </div>
              </div>
            </div>

            {/* 证件信息 Section */}
            <div style={{marginTop: '30px'}}>
              <div style={{
                borderLeft: '4px solid #0066cc', 
                paddingLeft: '10px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#333',
                marginBottom: '15px'
              }}>
                证件信息
              </div>
              
              <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#fff', padding: '10px 0'}}>
                 <div style={{display: 'flex', alignItems: 'center', marginRight: '30px', marginBottom: '10px'}}>
                    <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>证件类型 <span style={{color:'red'}}>*</span></div>
                    <select className={styles.input} style={{width: '150px'}} value={idType} onChange={(e)=>setIdType(e.target.value)}>
                      <option value="">请选择</option>
                      <option value="身份证">身份证</option>
                      <option value="护照">护照</option>
                    </select>
                 </div>
                 
                 <div style={{display: 'flex', alignItems: 'center', marginRight: '30px', marginBottom: '10px'}}>
                    <div className={styles.infoLabel} style={{width: '70px', textAlign: 'right', marginRight: '15px'}}>证件号码 <span style={{color:'red'}}>*</span></div>
                    <input className={styles.input} style={{width: '200px'}} value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} />
                 </div>
                 
                 <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <div className={styles.infoLabel} style={{width: '60px', textAlign: 'right', marginRight: '15px'}}>有效期</div>
                    <input className={styles.input} style={{width: '120px'}} placeholder="yyyy-MM-dd" value={validTill} onChange={(e)=>setValidTill(e.target.value)} />
                    <a href="#" style={{marginLeft: '10px', color: '#0066cc', fontSize: '12px'}}>设为长期有效</a>
                 </div>
              </div>
              {triedSave && (!idTypeValid || !idNumberValid || !validTillValid) && (
                <div className={styles.errorText} style={{paddingLeft: '95px'}}>请完善证件信息</div>
              )}
            </div>

            {/* 常旅客卡 Section */}
            <div style={{marginTop: '30px', marginBottom: '40px'}}>
              <div style={{
                borderLeft: '4px solid #0066cc', 
                paddingLeft: '10px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#333',
                marginBottom: '15px'
              }}>
                常旅客卡
              </div>
              
              {ffCards.map((card, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                   <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                      <div className={styles.infoLabel} style={{width: '80px', textAlign: 'right', marginRight: '15px'}}>航空公司</div>
                      <input 
                        className={styles.input} 
                        style={{width: '150px'}} 
                        value={card.airline} 
                        onChange={(e) => updateFFCard(idx, 'airline', e.target.value)} 
                      />
                   </div>
                   <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                      <div className={styles.infoLabel} style={{width: '40px', textAlign: 'right', marginRight: '15px'}}>卡号</div>
                      <input 
                        className={styles.input} 
                        style={{width: '150px'}} 
                        value={card.cardNo} 
                        onChange={(e) => updateFFCard(idx, 'cardNo', e.target.value)} 
                      />
                   </div>
                   <a href="#" style={{color: '#0066cc', fontSize: '12px'}} onClick={(e) => removeFFCard(idx, e)}>删除</a>
                </div>
              ))}

              <div style={{paddingLeft: '95px', marginTop: '10px'}}>
                 <a href="#" onClick={addFFCard} style={{color: '#0066cc', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none'}}>
                   <span style={{marginRight: '4px'}}>+</span>添加常旅客卡
                 </a>
              </div>
            </div>

            <div className={styles.saveRow} style={{borderTop: '1px solid #eee', paddingTop: '20px'}}>
              <button className={styles.primaryOrange} onClick={handleSave} style={{width: '120px', height: '40px', fontSize: '16px'}}>保存</button>
              <button className={styles.btn} onClick={() => window.history.back()} style={{width: '120px', height: '40px', fontSize: '16px', marginLeft: '20px'}}>取消</button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelerAdd;

import React from 'react';
import styles from './Footer.module.css';
import qrCode from './assets/login_qr_code.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <div className={styles.column}>
          <h4>旅游资讯</h4>
          <div className={styles.subColumns}>
            <div className={styles.subColumn}>
              <a href="#">宾馆索引</a>
              <a href="#">机票索引</a>
              <a href="#">邮轮索引</a>
              <a href="#">企业差旅</a>
            </div>
            <div className={styles.subColumn}>
              <a href="#">攻略索引</a>
              <a href="#">网站导航</a>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <h4>加盟合作</h4>
          <div className={styles.subColumns}>
            <div className={styles.subColumn}>
              <a href="#">分销联盟</a>
              <a href="#">企业礼品卡采购</a>
              <a href="#">代理合作</a>
              <a href="#">H5的特约合作</a>
            </div>
            <div className={styles.subColumn}>
              <a href="#">友情链接</a>
              <a href="#">保险代理</a>
              <a href="#">酒店加盟</a>
              <a href="#">更多加盟合作</a>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <h4>关于携程</h4>
          <div className={styles.subColumns}>
            <div className={styles.subColumn}>
              <a href="#">关于携程</a>
              <a href="#">联系我们</a>
              <a href="#">用户协议</a>
              <a href="#">营业执照</a>
              <a href="#">内容中心</a>
              <a href="#">Trip.com Group</a>
            </div>
            <div className={styles.subColumn}>
              <a href="#">携程热点</a>
              <a href="#">诚聘英才</a>
              <a href="#">隐私政策</a>
              <a href="#">安全中心</a>
              <a href="#">知识产权</a>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <h4>联系方式</h4>
          <span>国内: 95010</span>
          <span>或 400-830-6666</span>
          <span>中国香港: +852-3008-3295</span>
          <span>中国澳门: +86-21 3406-4888</span>
          <span>中国台湾: +86-21 3406-4888</span>
          <span>其他国家和地区: +86-21 3406-4888</span>
        </div>
        <div className={styles.qrCode}>
          <img src={qrCode} alt="QR Code" />
          <span>扫码下载携程App</span>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>Copyright©1999-2025, ctrip.com. All rights reserved. | ICP证：沪B2-20050130 | 沪ICP备08023580号-3 | 网信算备310105117481804230015号</p>
      </div>
    </footer>
  );
};

export default Footer;
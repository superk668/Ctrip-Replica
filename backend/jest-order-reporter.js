const path = require('path');

class OrderReporter {
  onRunComplete(_, results) {
    try {
      const target = path.join('test', 'routes', 'orders.test.js').toLowerCase();
      const files = results.testResults.filter(r => r.testFilePath.toLowerCase().includes(target) || /orders\.test\.js$/i.test(r.testFilePath));
      if (!files.length) {
        console.log('订单管理测试小结: 未发现 orders.test.js');
        return;
      }
      let total = 0;
      let passed = 0;
      let failed = 0;
      const lines = [];
      for (const f of files) {
        for (const t of (f.testResults || [])) {
          total += 1;
          if (t.status === 'passed') passed += 1; else failed += 1;
          const fullTitle = [...(t.ancestorTitles || []), t.title].join(' > ');
          lines.push(`[${t.status === 'passed' ? '通过' : '失败'}] ${fullTitle}`);
        }
      }
      console.log('——— 订单管理测试小结 ———');
      console.log(`用例总数: ${total}，通过: ${passed}，失败: ${failed}`);
      if (lines.length) console.log(lines.join('\n'));
    } catch (e) {
      console.log('订单管理测试小结生成失败:', e && e.message ? e.message : String(e));
    }
  }
  getLastError() { return null; }
}

module.exports = OrderReporter;
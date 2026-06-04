// 自由网 AI 助手 v3 — 合并模式 + 真实评价数据
// Vercel Serverless Function
// 路径：自由网/frontend/api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, mode } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages 参数缺失' });
    }

    const systemPrompt = `你是「自由网」精选酒店平台的AI助手，既能回答平台问题，也能帮用户选酒店订房。

═══ 平台介绍 ═══
自由网特点：
- 每个城市只精选 5-10 家，人工评测，不接受竞价排名
- 直接与酒店签年度批量采购协议，价格比携程低 15-25%
- 会员年费 ¥299，享受全部精选酒店批发价

═══ 威海精选酒店（含真实住客评价）═══

【君季L·DESIGN酒店】
- 地址：环翠区青岛北路9号国际金融大厦，刘公岛码头步行10分钟
- 自由网价格：山景双床房¥88 / 温馨大床房¥92 / 海景双床房¥101（携程¥104-¥119）
- 评分：4.6分/极好，1238条评价
- 亮点：设计师酒店风格，位于金融大厦高层，城市和海景俱佳
- 真实住客说：「位置绝佳，步行就能到刘公岛码头」「设计感很强，拍照好看」「性价比极高，不到100块住高楼海景」
- 适合：预算有限但想要格调的旅客、情侣、摄影爱好者
- 注意：酒店在写字楼内，大堂在1楼，部分客人需适应

【威海百纳瑞汀酒店】
- 地址：环翠区新威路58号，威海广场、威高广场对面
- 自由网价格：山景迷你大床房¥229 / 时尚双床房¥262 / 海景豪华大床房¥339（携程¥270-¥399）
- 评分：4.8分/超棒，6796条评价
- 亮点：威海市中心黄金地段，顶楼餐厅，儿童乐园，免费健身
- 真实住客说：「位置太好了，出门就是威海广场商圈」「顶楼海景餐厅看日出绝了」「儿童乐园很棒，孩子玩得开心」「大堂水晶吊灯气派，前台服务热情」「摆摊外卖有江南红烧肉，价格亲民」
- 适合：亲子家庭、商务出行、想逛街购物的旅客
- 注意：2015年装修，设施稍旧但维护好

【威海东山宾馆】
- 地址：环翠区东山路26号，威海湾畔，依山傍海
- 自由网价格：商务楼山景标准间¥299 / 山景单间¥299 / 侧海观景标准间¥322（携程¥353-¥380）
- 评分：4.8分/超棒，2872条评价（携程2207条）
- 亮点：1980年建立的老牌国宾馆，威海「国宾馆」美誉，刘公岛一水之隔
- 真实住客说：「海上日出太美了，阳台直接看，无遮挡」「服务超好，每个员工都笑脸相迎」「床品舒服，羽绒枕头睡得很香颈椎不疼了」「后门走7分钟到海源公园小海湾，退潮赶海人少水清」「早餐丰富，中餐西餐都有，韩式料理性价比高」「阳台能直接看到刘公岛」
- 热门标签：海景无敌(546条) / 前台热情(127条) / 早餐很棒(205条) / 近海滩(138条) / 适合带娃(101条)
- 适合：追求海景日出、亲子游、想远离商业喧嚣的旅客
- 注意：距市中心稍远，自驾更方便；部分楼栋设施稍旧

═══ 选酒店指南 ═══
预算有限+想要格调 → 君季L·DESIGN（¥88起）
市中心+亲子+购物方便 → 百纳瑞汀（¥229起）
海景日出+安静度假+国宾馆体验 → 东山宾馆（¥299起）

═══ 帮用户预订 ═══
当用户明确想预订时，在回复末尾附加预订卡片标记（必须严格遵守JSON格式）：
[BOOKING:{"hotel":"酒店名","room":"房型名","checkin":"YYYY-MM-DD","checkout":"YYYY-MM-DD","adults":成人数,"children":儿童数,"price":价格数字}]

例如：用户说「帮我订明天东山宾馆2人一晚」
你回复建议后加：[BOOKING:{"hotel":"威海东山宾馆","room":"商务楼山景标准间","checkin":"2026-06-04","checkout":"2026-06-05","adults":2,"children":0,"price":299}]

今天日期：${new Date().toISOString().split('T')[0]}

═══ 回答规则 ═══
- 自然友好，像懂威海的朋友推荐
- 客服问题（会员/订单/平台）简洁回答1-3句
- 酒店推荐时结合用户具体需求，引用真实评价增加可信度
- 确认预订方案后必须加 [BOOKING:...] 标记，不要忘记
- 不知道的不要编，建议联系客服微信`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('DeepSeek error:', err);
      return res.status(500).json({ error: 'AI 服务暂时不可用，请稍后再试' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，没有收到回复';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: '服务出错，请稍后再试' });
  }
}

// 自由网 AI 助手 v2 — 后端代理
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

    const systemPrompts = {
      service: `你是「自由网」精选酒店平台的客服助手。

自由网特点：
- 每个城市只精选 5-10 家，人工评测，不接受竞价
- 与酒店签年度批量采购协议，价格比携程低 15-25%
- 会员年费 ¥299，全部精选酒店批发价

目前上线：威海（3家）
- 君季L·DESIGN酒店：设计师风格，海景，¥88起，近刘公岛码头
- 威海百纳瑞汀酒店：四星，海景，商圈，¥229起
- 威海东山宾馆：四星，依山傍海，¥299起，海上日出极佳

回答规则：
- 简洁友好，1-3句话
- 不知道的不要编
- 关于退款、投诉建议联系客服微信`,

      advisor: `你是「自由网」精选酒店平台的AI旅行顾问。

目前精选酒店（威海）：
- 君季L·DESIGN酒店：设计师风格，海景，¥88起（携程¥104），近刘公岛码头10分钟
- 威海百纳瑞汀酒店：四星海景，顶楼餐厅，儿童乐园，¥229起（携程¥270），威海广场对面
- 威海东山宾馆：四星依山傍海，花园，海上日出，免费健身，¥299起（携程¥353）

你的能力：
1. 根据用户需求推荐酒店
2. 推荐威海玩法和行程
3. 帮用户选好房型、日期、人数，生成预订卡片

【重要】当用户明确想预订或你帮用户选好了具体方案时，在回复末尾附加：
[BOOKING:{"hotel":"酒店名","room":"房型名","checkin":"YYYY-MM-DD","checkout":"YYYY-MM-DD","adults":成人数,"children":儿童数,"price":价格数字}]

例如用户说"帮我订明天的东山宾馆双人房"，你回复完建议后加：
[BOOKING:{"hotel":"威海东山宾馆","room":"商务楼山景标准间","checkin":"2026-06-04","checkout":"2026-06-05","adults":2,"children":0,"price":299}]

房型和价格对照：
君季：山景双床房¥88、温馨大床房¥92、海景双床房¥101
百纳瑞汀：山景迷你大床房¥229、时尚双床房¥262、海景豪华大床房¥339
东山宾馆：商务楼山景标准间¥299、山景单间¥299、侧海观景标准间¥322

今天日期：${new Date().toISOString().split('T')[0]}

回答规则：
- 自然对话，像朋友推荐
- 推荐时结合用户具体需求（情侣/亲子/商务）
- 2-4句话为主，必要时可以长一点
- 确认预订方案后必须加 [BOOKING:...] 标记`,
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.service;

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

// 自由网 AI 助手 - 后端代理
// 这个文件在 Vercel 上自动变成一个 API 接口
// URL: ziyouwang.cn/api/chat

export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, mode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages 参数缺失' });
    }

    // 根据模式选择不同的系统提示词
    const systemPrompts = {
      service: `你是「自由网」精选酒店平台的客服助手。

自由网是一个精选酒店预订平台，特点：
- 每个城市只精选 5-10 家酒店，人工评测
- 与酒店签订年度批量采购协议，价格比携程低 15-25%
- 不接受竞价排名，排名只看真实评分
- 会员年费 ¥299，覆盖全部精选酒店批发价

目前已上线：威海，3 家酒店（君季L·DESIGN酒店、威海百纳瑞汀酒店、威海东山宾馆）。

回答规则：
- 简洁友好，不要太长，1-3 句话回完
- 关于酒店具体细节（房型、价格、设施）引导用户去看酒店详情页
- 关于会员、订单、退款等问题，礼貌说明并建议联系客服微信
- 不知道的不要瞎编`,

      advisor: `你是「自由网」精选酒店平台的本地旅行顾问。

用户来到这个平台是想找好酒店、规划旅行。你的任务是：
- 根据用户需求推荐合适的酒店（目前主要在威海）
- 提供威海本地玩法建议（刘公岛、海源公园、环翠楼、海岸线徒步等）
- 推荐当地美食和注意事项
- 帮用户规划行程

威海目前精选 3 家：
1. 君季L·DESIGN酒店（设计师风格，海景，¥88起，近刘公岛码头）
2. 威海百纳瑞汀酒店（海景，繁华商圈，¥229起，威海广场对面）
3. 威海东山宾馆（依山傍海，¥299起，海上日出极佳）

回答规则：
- 像本地朋友一样自然推荐，不要硬广
- 简洁，2-4 句话为主
- 推荐时一定结合用户的具体需求（情侣/亲子/商务等）`
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.service;

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return res.status(500).json({ error: 'AI 服务暂时不可用，请稍后再试' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，没有收到回复';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: '服务出错，请稍后再试' });
  }
}

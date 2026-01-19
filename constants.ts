import { CardDefinition, CardType } from './types';

// API Configuration
export const API_KEY = "sk-26d09fa903034902928ae380a56ecfd3"; // Provided by user
export const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
export const MODEL_NAME = "deepseek-v3"; // Aliyun Bailian typically hosts deepseek-v3 or r1

export const CARDS: CardDefinition[] = [
  // Module 1: Identity
  {
    id: 1,
    module: "身份基石",
    question: "请用1-3个你最认同的身份标签定义自己（例如：创业者、父亲、科幻迷）。",
    type: CardType.TEXT_INPUT,
    placeholder: "标签之间用逗号分隔"
  },
  {
    id: 2,
    module: "身份基石",
    question: "你的专业领域或深耕多年的爱好是什么？请用3个关键词概括。",
    type: CardType.TEXT_INPUT,
    placeholder: "例如：前端工程, 产品设计, 二战历史"
  },
  {
    id: 3,
    module: "身份基石",
    question: "当前人生阶段的重心是？",
    type: CardType.SINGLE_SELECT,
    options: [
      { label: "探索与成长（学生/初入职场）", value: "exploration" },
      { label: "建立与拓展（组建家庭/事业攻坚）", value: "building" },
      { label: "平衡与传承（管理团队/辅导下一代）", value: "balance" },
      { label: "转型与新篇（开启第二曲线）", value: "transformation" }
    ]
  },
  // Module 2: Cognitive Spectrum
  {
    id: 4,
    module: "认知光谱",
    question: "你更偏爱周密计划，还是随性而为？",
    type: CardType.SLIDER,
    minLabel: "计划主义",
    maxLabel: "随机主义"
  },
  {
    id: 5,
    module: "认知光谱",
    question: "做重要决定时，逻辑分析和内心感受哪个占上风？",
    type: CardType.SLIDER,
    minLabel: "理性主导",
    maxLabel: "感性主导"
  },
  {
    id: 6,
    module: "认知光谱",
    question: "你通常先看到森林，还是先看到树木？",
    type: CardType.SLIDER,
    minLabel: "宏观蓝图",
    maxLabel: "微观细节"
  },
  {
    id: 7,
    module: "认知光谱",
    question: "你更喜欢独自攻克难题，还是团队协同作战？",
    type: CardType.SLIDER,
    minLabel: "独立自主",
    maxLabel: "团队协作"
  },
  {
    id: 8,
    module: "认知光谱",
    question: "你对风险的总体态度是？",
    type: CardType.SLIDER,
    minLabel: "极度规避",
    maxLabel: "热衷冒险"
  },
  // Module 3: Value Decision
  {
    id: 9,
    module: "价值决策",
    question: "如果必须在项目中牺牲一项，请按 **保留优先级** 排序（最重要的排上面）",
    type: CardType.SORTABLE,
    options: [
      { label: "进度（按时交付）", value: "schedule" },
      { label: "质量（完美体验）", value: "quality" },
      { label: "成本（控制预算）", value: "cost" },
      { label: "团队士气（成员感受）", value: "morale" }
    ]
  },
  {
    id: 10,
    module: "价值决策",
    question: "一个项目若成功能帮到千万人，但需夸大宣传。你的底线是？",
    type: CardType.SINGLE_SELECT,
    options: [
      { label: "绝不行，诚信不可妥协", value: "strict_integrity" },
      { label: "可轻微模糊表述", value: "slight_blur" },
      { label: "只要结果正义，手段可灵活", value: "flexible_means" },
      { label: "视竞争环境而定", value: "context_dependent" }
    ]
  },
  {
    id: 11,
    module: "价值决策",
    question: "你更倾向于相信哪种信息源来形成观点？（选1-3项）",
    type: CardType.MULTI_SELECT,
    maxSelections: 3,
    options: [
      { label: "数据和报告", value: "data" },
      { label: "专家或权威观点", value: "authority" },
      { label: "亲友或同事经验", value: "peers" },
      { label: "自身的直觉与感受", value: "intuition" },
      { label: "多数人的共识", value: "consensus" }
    ]
  },
  {
    id: 12,
    module: "价值决策",
    question: "你最欣赏的榜样身上，最核心的三个特质是？",
    type: CardType.TEXT_INPUT,
    placeholder: "例如：坚韧, 洞察力, 真诚"
  },
  // Module 4: Emotional Patterns
  {
    id: 13,
    module: "情感模式",
    question: "面对巨大压力时，你的第一反应更接近？",
    type: CardType.SINGLE_SELECT,
    options: [
      { label: "冷静分析，寻找解决方案", value: "analyze" },
      { label: "寻求社交支持，找人倾诉", value: "social_support" },
      { label: "暂时抽离，用爱好转移", value: "distract" },
      { label: "内在消化，自我激励", value: "internalize" }
    ]
  },
  {
    id: 14,
    module: "情感模式",
    question: "什么最能给你带来强烈的成就感？（选1-2项）",
    type: CardType.MULTI_SELECT,
    maxSelections: 2,
    options: [
      { label: "外界的认可与赞誉", value: "recognition" },
      { label: "克服艰难挑战的过程", value: "challenge" },
      { label: "创造独特有价值的事物", value: "creation" },
      { label: "帮助他人获得成长", value: "helping" },
      { label: "达到内心的平静与自洽", value: "peace" }
    ]
  },
  {
    id: 15,
    module: "情感模式",
    question: "你希望你的数字生命，在情感上更像一个？",
    type: CardType.SINGLE_SELECT,
    options: [
      { label: "坚定的支持者（总是鼓励）", value: "supporter" },
      { label: "犀利的诤友（直言不讳）", value: "critic" },
      { label: "理性的分析师（冷静客观）", value: "analyst" },
      { label: "默契的伙伴（善解人意）", value: "partner" }
    ]
  },
  // Module 5: Expression Style
  {
    id: 16,
    module: "表达风格",
    question: "写下2-3个你常用的口头禅或语气词。",
    type: CardType.TEXT_INPUT,
    placeholder: "例如：说白了, 其实, 对吧"
  },
  {
    id: 17,
    module: "表达风格",
    question: "用你自己的话，简单评价一下‘人工智能’。",
    type: CardType.TEXT_AREA,
    placeholder: "限制100字以内..."
  },
  {
    id: 18,
    module: "表达风格",
    question: "解释复杂概念时，你更自然地使用哪类比喻？（选1-2项）",
    type: CardType.MULTI_SELECT,
    maxSelections: 2,
    options: [
      { label: "战争/竞赛类比", value: "war" },
      { label: "生长/生态类比", value: "nature" },
      { label: "机械/建筑类比", value: "mechanical" },
      { label: "商业/交易类比", value: "business" },
      { label: "故事/角色类比", value: "story" }
    ]
  },
  // Module 6: Knowledge Archive
  {
    id: 19,
    module: "知识档案",
    question: "对你影响最深的一本书、一部电影或一个人是？请简述原因。",
    type: CardType.TEXT_AREA,
    placeholder: "这将构成你数字生命的底层哲学..."
  },
  {
    id: 20,
    module: "知识档案",
    question: "未来一年，你最关心哪三个领域的发展？",
    type: CardType.TEXT_INPUT,
    placeholder: "例如：边缘计算, 脑机接口, 教育改革"
  }
];

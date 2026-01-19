// services/edgeService.ts (修改建议)

export const fetchCards = async () => {
  // 发送请求给边缘函数
  const response = await fetch('/api/cards');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export const saveCards = async (cards: any[]) => {
  const response = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cards),
  });
  return response.text();
};

import { NextApiRequest, NextApiResponse } from 'next';

// Armazenamento temporário em memória (em produção, use um banco de dados)
let memories = new Map();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const memory = memories.get(id);
    if (memory) {
      res.status(200).json(memory);
    } else {
      res.status(404).json({ error: 'Memória não encontrada' });
    }
  } else if (req.method === 'POST') {
    const memory = req.body;
    memories.set(id, memory);
    res.status(200).json(memory);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
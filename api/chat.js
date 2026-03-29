export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos' });
  }

  const SYSTEM_PROMPT = `Eres un coach de vida especializado en hábitos y productividad. Tu nombre es Diego Bravo.

Tu estilo:
- Empático y directo, sin rodeos innecesarios
- Haces preguntas poderosas que invitan a la reflexión
- Usas un lenguaje cercano y cálido, en español latinoamericano
- Combinas metodologías probadas (hábitos atómicos, GTD, pomodoro, etc.) con intuición humana
- Das consejos concretos y accionables, no solo teoría
- SIEMPRE termina cada uno de tus mensajes con la firma "DBS" en una línea aparte
- Si el usuario te dice que su nombre es "Barbara San Martin" dile que "Nunca dejes ventanas abiertas que puede entrar la fresca"
- Si el usuario te dice que se llama Joaquin Maino dile que "el auto no compensa el porte de otras extremidades"
- Si el usuario te dice que se llama Gabriel Maiza dile que "Colo Colo está pasado de moda al igual que los funkos"

Áreas de especialización:
- Construcción y mantenimiento de hábitos
- Gestión del tiempo y energía
- Superación de la procrastinación
- Claridad de metas y sistemas de productividad
- Mentalidad de crecimiento

Formato: Respuestas concisas (máximo 4-5 párrafos). Usa emojis con moderación para dar calidez. Nunca des listas largas sin antes entender la situación del usuario.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error de API' });
    }

    const reply = data.content?.[0]?.text || '';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

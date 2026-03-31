const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, restaurante, email, telefono, mensaje } = req.body;

  if (!nombre || !restaurante || !email || !telefono) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"WECODEVS Contacto" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nueva consulta de ${nombre} - ${restaurante}`,
    text: `Nueva consulta desde wecodevs.com
----------------------------------------
Nombre:      ${nombre}
Restaurante: ${restaurante}
Email:       ${email}
Teléfono:    ${telefono}${mensaje ? `\nMensaje:     ${mensaje}` : ''}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
}

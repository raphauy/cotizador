import nodemailer from "nodemailer";

export async function sendNodeMailerEmail(to: string, subject: string, html: string ) {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendCodeEmail(email: string, code: string) {
  
    await sendNodeMailerEmail(email, "Código de acceso", `<p>Código de acceso para Cotizador Aníbal Abbate App: <span>${code}</span></p>`);
}


import {NextResponse} from "next/server";
import {Resend} from "resend";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {error: "Todos los campos son obligatorios."},
        {status: 400},
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        {error: "Correo electrónico inválido."},
        {status: 400},
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM || "APP Contacto <onboarding@resend.dev>";
    const contactTo = process.env.CONTACT_TO || "alemanfausto@gmail.com";

    if (!resendApiKey || !resendFrom) {
      return NextResponse.json(
        {
          error:
            "Falta configuración de Resend (RESEND_API_KEY, RESEND_FROM).",
        },
        {status: 500},
      );
    }

    const resend = new Resend(resendApiKey);

    const {error} = await resend.emails.send({
      from: resendFrom,
      to: contactTo,
      replyTo: email,
      subject: `Contacto web APP - ${subject}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nAsunto: ${subject}\n\nMensaje:\n${message}`,
      html: `<p><strong>Nombre:</strong> ${name}</p><p><strong>Correo:</strong> ${email}</p><p><strong>Mensaje:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    if (error) {
      console.error("[contact-api] Resend error", error);
      return NextResponse.json(
        {error: "No se pudo enviar el mensaje en este momento."},
        {status: 502},
      );
    }

    return NextResponse.json({ok: true});
  } catch (error) {
    console.error("[contact-api] Error enviando correo", error);
    return NextResponse.json(
      {error: "No se pudo enviar el mensaje en este momento."},
      {status: 500},
    );
  }
}

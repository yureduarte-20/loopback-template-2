// src/services/nodemailer.service.ts
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {createTransport, Transporter} from 'nodemailer';
import {
  EmailOptions,
  IEmailService, // Importa a interface
  NodemailerBindings,
  NodemailerConfig,
} from '../config/mail.config';

@bind({scope: BindingScope.TRANSIENT})
// --- ALTERAÇÃO AQUI ---
// A classe agora implementa explicitamente a interface IEmailService
export class NodemailerService implements IEmailService {
  private transporter: Transporter;

  constructor(
    @inject(NodemailerBindings.CONFIG)
    private config: NodemailerConfig,
  ) {
    this.transporter = createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });
  }

  // O método `sendMail` já corresponde à assinatura da interface.
  async sendMail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        to: options.to,
        from: this.config.defaultFrom,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      console.log('Enviando e-mail (via Nodemailer) para:', options.to);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Mensagem enviada: %s', info.messageId);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new HttpErrors.InternalServerError(
        'Ocorreu um erro ao tentar enviar o e-mail.',
      );
    }
  }
}

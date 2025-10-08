// src/config/nodemailer.config.ts
import {BindingKey} from '@loopback/core';
// ... (outros imports)

// ... (NodemailerConfig e nodemailerConfig permanecem os mesmos)

// --- ALTERAÇÃO AQUI ---
// Esta é a nossa interface agnóstica.
// Qualquer serviço de e-mail que criarmos DEVE implementar esta interface.
export interface IEmailService {
  sendMail(options: EmailOptions): Promise<void>;
}
export interface NodemailerConfig {
  host: string;
  port: number;
  secure: boolean; // true para 465, false para outras portas
  auth: {
    user: string; // seu usuário de e-mail (ex: do Gmail, Mailtrap)
    pass: string; // sua senha de e-mail ou senha de app
  };
  // O e-mail que aparecerá como remetente padrão
  defaultFrom: string;
}

// Opções simplificadas para o e-mail
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: object[];
}

/**
 * Binding keys para o serviço de e-mail
 */
export namespace NodemailerBindings {
  export const CONFIG = BindingKey.create<NodemailerConfig>('config.nodemailer');
  // Esta chave agora representa a INTERFACE, não uma classe específica.
  export const EMAIL_SERVICE = BindingKey.create<IEmailService>('services.email');
}
export const nodemailerConfig: NodemailerConfig = {
  host: process.env.SMTP_HOST ?? 'smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT ?? 2525),
  secure: process.env.SMTP_PORT == '465' ? true : false,
  auth: {
    user: process.env.SMTP_USER ?? 'seu-usuario-mailtrap',
    pass: process.env.SMTP_PASS ?? 'sua-senha-mailtrap',
  },
  defaultFrom: 'Equipe LBIN <noreply@lbin.com.br>',
};
console.log(nodemailerConfig)

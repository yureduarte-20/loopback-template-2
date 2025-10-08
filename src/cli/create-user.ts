// src/cli/create-user.ts
import * as bcrypt from 'bcryptjs';
import prompts from 'prompts';
import {TemplateApplication} from '../application'; // <-- IMPORTANTE: Troque pelo nome da sua classe de aplicação
import {User} from '../models';
import {UserRepository} from '../repositories';
import {ROLES} from '../types';
async function genHashPassword(content: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(content, salt);
  return hash;
}
/**
 * Este script cria um novo usuário a partir da linha de comando.
 */
async function createUser(): Promise<void> {
  // Cria uma instância da aplicação para ter acesso aos repositórios
  const app = new TemplateApplication(); // <-- IMPORTANTE: E aqui também
  await app.boot(); // Inicia os serviços e bindings
  await app.init(); // Carrega a aplicação

  try {
    console.log('--- Criar Novo Usuário ---');

    // Resolve o repositório de usuários a partir da aplicação
    const userRepository = await app.getRepository(UserRepository);

    // Pergunta os dados ao usuário de forma interativa
    const userData = await prompts([
      {
        type: 'text',
        name: 'email',
        message: 'Digite o e-mail do usuário:',
        validate: (email: string) => /^\S+@\S+\.\S+$/.test(email) ? true : 'Formato de e-mail inválido.',
      },
      {
        type: 'text',
        name: 'username',
        message: 'Digite o nome do usuário: ',
        validate: (name: string) => name.length >= 3 ? true : 'Formato de e-mail inválido.',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Digite a senha:',
        validate: (pass: string) => pass.length < 8 ? 'A senha deve ter no mínimo 8 caracteres.' : true,
      },
      {
        type: 'password',
        name: 'passwordConfirm',
        message: 'Confirme a senha:',
      },
    ]);

    // Sai se o usuário cancelar (Ctrl+C)
    if (!userData.email || !userData.password) {
      console.log('Criação de usuário cancelada.');
      return;
    }

    // Valida se as senhas coincidem
    if (userData.password !== userData.passwordConfirm) {
      console.error('❌ As senhas não coincidem. Tente novamente.');
      return;
    }

    // Verifica se o usuário já existe
    const existingUser = await userRepository.findOne({where: {email: userData.email}});
    if (existingUser) {
      console.error(`❌ Erro: O e-mail "${userData.email}" já está em uso.`);
      return;
    }

    // Faz o hash da senha (NUNCA armazene senhas em texto plano)

    const hashedPassword = await genHashPassword(userData.password);

    // Cria a nova instância do usuário
    const newUser = new User({
      email: userData.email,
      password: hashedPassword,
      username: userData.username,
      role: ROLES.ADMIN
    });

    // Salva o usuário no banco de dados
    const savedUser = await userRepository.create(newUser);

    console.log(`✅ Usuário criado com sucesso!`);
    console.log(`   ID: ${savedUser.id}`);
    console.log(`   E-mail: ${savedUser.email}`);

  } catch (error) {
    console.error('❌ Ocorreu um erro ao criar o usuário:', error);
  } finally {
    // Garante que a aplicação pare e feche as conexões
    await app.stop();
    process.exit(0);
  }
}

// Executa a função principal
createUser().catch(err => {
  console.error('Erro fatal ao executar o script:', err);
  process.exit(1);
});

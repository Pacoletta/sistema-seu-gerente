/**
 * 🔐 Serviço de Autenticação com Bcrypt
 * 
 * Este serviço fornece funções seguras para:
 * - Hash de senhas com bcrypt (salt automático)
 * - Comparação segura de senhas
 * - Validação de força de senha
 */

import bcrypt from 'bcryptjs';

/**
 * Número de rounds para gerar o salt do bcrypt
 * Quanto maior, mais seguro, mas mais lento
 * Recomendado: 10-12 para produção
 */
const SALT_ROUNDS = 10;

/**
 * Gera um hash seguro da senha usando bcrypt
 * 
 * @param password - Senha em texto plano
 * @returns Promise com hash bcrypt da senha
 * 
 * @example
 * const hash = await hashPassword("123456");
 * // Retorna: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Remove espaços em branco das pontas
    const cleanPassword = password.trim();
    
    // Validação básica
    if (!cleanPassword) {
      throw new Error('Senha não pode ser vazia');
    }
    
    if (cleanPassword.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (cleanPassword.length > 100) {
      throw new Error('Senha muito longa (máximo 100 caracteres)');
    }
    
    // Gera o hash com salt automático
    const hash = await bcrypt.hash(cleanPassword, SALT_ROUNDS);
    
    console.log('✅ Hash gerado com sucesso');
    return hash;
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
    throw error;
  }
}

/**
 * Compara uma senha em texto plano com um hash bcrypt
 * 
 * @param password - Senha em texto plano para comparar
 * @param hash - Hash bcrypt armazenado no banco de dados
 * @returns Promise<boolean> - true se a senha corresponder ao hash
 * 
 * @example
 * const isValid = await verifyPassword("123456", hashDoBanco);
 * if (isValid) {
 *   console.log("Senha correta!");
 * }
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Remove espaços em branco
    const cleanPassword = password.trim();
    
    // Validação básica
    if (!cleanPassword || !hash) {
      return false;
    }
    
    // Compara a senha com o hash de forma segura
    const isMatch = await bcrypt.compare(cleanPassword, hash);
    
    if (isMatch) {
      console.log('✅ Senha verificada com sucesso');
    } else {
      console.log('❌ Senha incorreta');
    }
    
    return isMatch;
  } catch (error) {
    console.error('❌ Erro ao verificar senha:', error);
    return false;
  }
}

/**
 * Valida a força de uma senha
 * 
 * @param password - Senha para validar
 * @returns Objeto com status de validação e mensagens de erro
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'fraca' | 'média' | 'forte' | 'muito forte';
} {
  const errors: string[] = [];
  let strength: 'fraca' | 'média' | 'forte' | 'muito forte' = 'fraca';
  
  const cleanPassword = password.trim();
  
  // Validações obrigatórias
  if (!cleanPassword) {
    errors.push('Senha não pode ser vazia');
    return { isValid: false, errors, strength };
  }
  
  if (cleanPassword.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }
  
  if (cleanPassword.length > 100) {
    errors.push('Senha muito longa (máximo 100 caracteres)');
  }
  
  // Análise de força (opcional)
  let strengthScore = 0;
  
  if (cleanPassword.length >= 8) strengthScore++;
  if (cleanPassword.length >= 12) strengthScore++;
  if (/[a-z]/.test(cleanPassword)) strengthScore++;
  if (/[A-Z]/.test(cleanPassword)) strengthScore++;
  if (/[0-9]/.test(cleanPassword)) strengthScore++;
  if (/[^a-zA-Z0-9]/.test(cleanPassword)) strengthScore++;
  
  if (strengthScore <= 2) strength = 'fraca';
  else if (strengthScore <= 4) strength = 'média';
  else if (strengthScore <= 5) strength = 'forte';
  else strength = 'muito forte';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Exemplo de uso completo
 */
export const passwordServiceExample = {
  // Exemplo de cadastro
  async exampleRegister(password: string) {
    console.log('📝 EXEMPLO: Cadastro de usuário');
    
    // 1. Validar senha
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      console.error('Senha inválida:', validation.errors);
      return;
    }
    
    // 2. Gerar hash
    const hash = await hashPassword(password);
    console.log('Hash gerado:', hash);
    
    // 3. Salvar no banco (exemplo)
    // await supabase.from('usuarios').insert({ senha: hash });
    
    return hash;
  },
  
  // Exemplo de login
  async exampleLogin(password: string, hashFromDatabase: string) {
    console.log('🔑 EXEMPLO: Login de usuário');
    
    // 1. Comparar senha com hash do banco
    const isValid = await verifyPassword(password, hashFromDatabase);
    
    if (isValid) {
      console.log('✅ Login autorizado!');
      return true;
    } else {
      console.log('❌ Login negado - senha incorreta');
      return false;
    }
  }
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log para debugging (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl ? 'Configurado' : 'Não configurado');
  console.log('Supabase Key:', supabaseAnonKey ? 'Configurado' : 'Não configurado');
}

// Verifica se as credenciais estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Credenciais do Supabase não configuradas. Verifique o arquivo .env.local');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Verificar se a conexão está funcionando
try {
  supabase.from('estoque').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('Erro ao conectar com o Supabase:', error);
      } else {
        console.log('Conexão com o Supabase estabelecida com sucesso!');
      }
    });
} catch (error: unknown) {
  console.error('Erro ao testar conexão com o Supabase:', error);
}

export default supabase; 
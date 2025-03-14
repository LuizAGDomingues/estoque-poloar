import supabase from '@/lib/supabase';
import { Maquina, MaquinaFormData } from '@/types';

export const estoqueService = {
  // Buscar todas as máquinas
  async getAll(): Promise<Maquina[]> {
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar máquinas:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Buscar máquinas com filtros
  async getWithFilters({ 
    search, 
    status, 
    consultor,
    sortBy = 'data_entrega',
    page = 1,
    limit = 10
  }: {
    search?: string;
    status?: string;
    consultor?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Maquina[], count: number }> {
    let query = supabase
      .from('estoque')
      .select('*', { count: 'exact' });
      
    // Aplicar filtros
    if (search) {
      query = query.or(`modelo.ilike.%${search}%,cliente.ilike.%${search}%,codigo.ilike.%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (consultor) {
      query = query.eq('consultor', consultor);
    }
    
    // Ordenação
    const sortOrder = sortBy === 'modelo' || sortBy === 'cliente' ? 'asc' : 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Paginação
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Erro ao buscar máquinas com filtros:', error);
      return { data: [], count: 0 };
    }
    
    return { data: data || [], count: count || 0 };
  },
  
  // Buscar uma máquina por ID
  async getById(id: number): Promise<Maquina | null> {
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Erro ao buscar máquina com ID ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Criar uma nova máquina
  async create(maquina: MaquinaFormData): Promise<{ success: boolean; id?: number; error?: string }> {
    const { data, error } = await supabase
      .from('estoque')
      .insert([maquina])
      .select();
      
    if (error) {
      console.error('Erro ao criar máquina:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, id: data?.[0]?.id };
  },
  
  // Atualizar uma máquina existente
  async update(id: number, maquina: MaquinaFormData): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('estoque')
      .update(maquina)
      .eq('id', id);
      
    if (error) {
      console.error(`Erro ao atualizar máquina com ID ${id}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  },
  
  // Excluir uma máquina
  async delete(id: number): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('estoque')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Erro ao excluir máquina com ID ${id}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  },
  
  // Obter consultores únicos para o filtro
  async getConsultores(): Promise<string[]> {
    const { data, error } = await supabase
      .from('estoque')
      .select('consultor')
      .not('consultor', 'is', null);
      
    if (error) {
      console.error('Erro ao buscar consultores:', error);
      return [];
    }
    
    // Extrair consultores únicos
    const consultores = [...new Set(data.map(item => item.consultor))];
    return consultores;
  },
  
  // Obter estatísticas para o dashboard
  async getEstatisticas(): Promise<{
    totalEmEstoque: number;
    totalEntregasPendentes: number;
    totalMaquinas: number;
  }> {
    const { data, error } = await supabase
      .from('estoque')
      .select('status, quantidade');
      
    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalEmEstoque: 0,
        totalEntregasPendentes: 0,
        totalMaquinas: 0
      };
    }
    
    // Somando as quantidades para cada categoria
    const totalMaquinas = data.reduce((total, item) => total + (item.quantidade || 1), 0);
    const totalEmEstoque = data
      .filter(item => item.status === 'Em estoque')
      .reduce((total, item) => total + (item.quantidade || 1), 0);
    const totalEntregasPendentes = data
      .filter(item => item.status === 'Pendente')
      .reduce((total, item) => total + (item.quantidade || 1), 0);
    
    return {
      totalEmEstoque,
      totalEntregasPendentes,
      totalMaquinas
    };
  },
  
  // Buscar próximas entregas/retiradas
  async getProximosEventos(limit = 5): Promise<Maquina[]> {
    const hoje = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .or(`previsao_retirada.gte.${hoje},data_entrega.gte.${hoje}`)
      .order('previsao_retirada', { ascending: true, nullsFirst: false })
      .order('data_entrega', { ascending: true, nullsFirst: false })
      .limit(limit);
      
    if (error) {
      console.error('Erro ao buscar próximos eventos:', error);
      return [];
    }
    
    return data || [];
  }
}; 
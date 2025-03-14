export interface Maquina {
  id: number;
  modelo: string;
  quantidade: number;
  codigo: string;
  consultor: string;
  cliente: string;
  contato: string;
  data_entrega: string | null;
  quem_recebeu: string;
  previsao_retirada: string | null;
  data_saida: string | null;
  quem_entregou: string;
  status: 'Em estoque' | 'Entregue' | 'Retirado' | 'Pendente';
  obs: string;
  created_at?: string;
}

export interface MaquinaFormData extends Omit<Maquina, 'id' | 'created_at'> {
  id?: number;
} 
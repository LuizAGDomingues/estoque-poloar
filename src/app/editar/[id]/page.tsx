'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { estoqueService } from '@/services/estoqueService';
import { Maquina, MaquinaFormData } from '@/types';

export default function EditarMaquina({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = parseInt(params.id, 10);
  
  const [formData, setFormData] = useState<MaquinaFormData>({
    modelo: '',
    quantidade: 1,
    codigo: '',
    consultor: '',
    cliente: '',
    contato: '',
    data_entrega: null,
    quem_recebeu: '',
    previsao_retirada: null,
    data_saida: null,
    quem_entregou: '',
    status: 'Em estoque',
    obs: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchMaquina = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Buscando máquina com ID ${id} no Supabase`);
        const maquina = await estoqueService.getById(id);
        
        if (!maquina) {
          setError(`Máquina com ID ${id} não encontrada`);
          return;
        }
        
        console.log('Dados recebidos:', maquina);
        setFormData({
          modelo: maquina.modelo,
          quantidade: maquina.quantidade,
          codigo: maquina.codigo,
          consultor: maquina.consultor,
          cliente: maquina.cliente,
          contato: maquina.contato,
          data_entrega: maquina.data_entrega,
          quem_recebeu: maquina.quem_recebeu,
          previsao_retirada: maquina.previsao_retirada,
          data_saida: maquina.data_saida,
          quem_entregou: maquina.quem_entregou,
          status: maquina.status,
          obs: maquina.obs
        });
      } catch (err) {
        console.error('Erro ao buscar máquina:', err);
        setError('Erro ao conectar com o servidor. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMaquina();
    }
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Enviando dados para o Supabase:', formData);
      const result = await estoqueService.update(id, formData);
      
      if (result.success) {
        setSuccess(true);
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/estoque');
        }, 2000);
      } else {
        setError(result.error || 'Erro ao atualizar máquina');
      }
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      setError('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-poloar-azul">Editando Máquina...</h1>
          <Link href="/estoque" className="text-poloar-azul hover:underline">
            Voltar para Estoque
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-64">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-poloar-azul">Editar Máquina</h1>
        <Link href="/estoque" className="text-poloar-azul hover:underline">
          Voltar para Estoque
        </Link>
      </div>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Sucesso! </strong>
          <span className="block sm:inline">Máquina atualizada com sucesso. Redirecionando...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                id="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              />
            </div>
            
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                id="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              />
            </div>
            
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                id="quantidade"
                min="1"
                value={formData.quantidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              />
            </div>
            
            <div>
              <label htmlFor="consultor" className="block text-sm font-medium text-gray-700 mb-1">
                Consultor *
              </label>
              <input
                type="text"
                id="consultor"
                value={formData.consultor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <input
                type="text"
                id="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              />
            </div>
            
            <div>
              <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
                Contato
              </label>
              <input
                type="text"
                id="contato"
                value={formData.contato}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="data_entrega" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                id="data_entrega"
                value={formData.data_entrega || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="quem_recebeu" className="block text-sm font-medium text-gray-700 mb-1">
                Quem Recebeu
              </label>
              <input
                type="text"
                id="quem_recebeu"
                value={formData.quem_recebeu}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="previsao_retirada" className="block text-sm font-medium text-gray-700 mb-1">
                Previsão de Retirada
              </label>
              <input
                type="date"
                id="previsao_retirada"
                value={formData.previsao_retirada || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="data_saida" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Saída
              </label>
              <input
                type="date"
                id="data_saida"
                value={formData.data_saida || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="quem_entregou" className="block text-sm font-medium text-gray-700 mb-1">
                Quem Entregou
              </label>
              <input
                type="text"
                id="quem_entregou"
                value={formData.quem_entregou}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                required
              >
                <option value="Em estoque">Em estoque</option>
                <option value="Entregue">Entregue</option>
                <option value="Retirado">Retirado</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="obs" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="obs"
              rows={4}
              value={formData.obs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/estoque"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { estoqueService } from '@/services/estoqueService';
import { Maquina } from '@/types';

export default function Home() {
  const [estatisticas, setEstatisticas] = useState({
    totalEmEstoque: 0,
    totalEntregasPendentes: 0,
    totalMaquinas: 0
  });
  
  const [proximosEventos, setProximosEventos] = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar estatísticas
        console.log('Buscando estatísticas do Supabase');
        const stats = await estoqueService.getEstatisticas();
        setEstatisticas(stats);
        
        // Buscar próximos eventos
        console.log('Buscando próximos eventos do Supabase');
        const eventos = await estoqueService.getProximosEventos();
        setProximosEventos(eventos);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Erro ao conectar com o servidor. Por favor, verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const getTipoEvento = (maquina: Maquina) => {
    if (maquina.previsao_retirada && (!maquina.data_entrega || new Date(maquina.previsao_retirada) < new Date(maquina.data_entrega))) {
      return 'Retirada';
    }
    return 'Entrega';
  };
  
  const getDataEvento = (maquina: Maquina) => {
    const tipo = getTipoEvento(maquina);
    return tipo === 'Retirada' ? maquina.previsao_retirada : maquina.data_entrega;
  };
  
  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-poloar-azul">Dashboard de Estoque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Máquinas em Estoque</h3>
            <p className="text-3xl font-bold text-poloar-azul">
              {loading ? '--' : estatisticas.totalEmEstoque}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Entregas Pendentes</h3>
            <p className="text-3xl font-bold text-poloar-vermelho">
              {loading ? '--' : estatisticas.totalEntregasPendentes}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total de Máquinas</h3>
            <p className="text-3xl font-bold text-gray-700">
              {loading ? '--' : estatisticas.totalMaquinas}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">Gráfico de Status</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            {loading ? (
              <p className="text-gray-500">Carregando gráfico...</p>
            ) : estatisticas.totalMaquinas === 0 ? (
              <p className="text-gray-500">Nenhuma máquina cadastrada</p>
            ) : (
              <div className="flex w-full h-full items-end justify-around px-8 py-4">
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-poloar-azul w-16" 
                    style={{ 
                      height: estatisticas.totalEmEstoque > 0 ? '100px' : '0',
                      minHeight: estatisticas.totalEmEstoque > 0 ? '100px' : '0'
                    }}
                  ></div>
                  <p className="mt-2 text-sm">Em Estoque</p>
                  <p className="font-bold">{estatisticas.totalEmEstoque}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-green-500 w-16" 
                    style={{ 
                      height: (estatisticas.totalMaquinas - estatisticas.totalEmEstoque - estatisticas.totalEntregasPendentes) > 0 ? '100px' : '0',
                      minHeight: (estatisticas.totalMaquinas - estatisticas.totalEmEstoque - estatisticas.totalEntregasPendentes) > 0 ? '100px' : '0'
                    }}
                  ></div>
                  <p className="mt-2 text-sm">Entregues/Retirados</p>
                  <p className="font-bold">{estatisticas.totalMaquinas - estatisticas.totalEmEstoque - estatisticas.totalEntregasPendentes}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-poloar-vermelho w-16" 
                    style={{ 
                      height: estatisticas.totalEntregasPendentes > 0 ? '100px' : '0',
                      minHeight: estatisticas.totalEntregasPendentes > 0 ? '100px' : '0'
                    }}
                  ></div>
                  <p className="mt-2 text-sm">Pendentes</p>
                  <p className="font-bold">{estatisticas.totalEntregasPendentes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-poloar-azul">Ações Rápidas</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/estoque" 
                className="block p-4 bg-blue-600 text-white rounded-lg text-center font-medium border-2 border-blue-700 shadow hover:bg-blue-700 transition duration-200">
            Ver Estoque Completo
          </Link>
          
          <Link href="/cadastrar" 
                className="block p-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition font-medium border border-green-700 shadow-sm">
            Cadastrar Nova Máquina
          </Link>
          
          <Link href="/exportar" 
                className="block p-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition font-medium border border-purple-700 shadow-sm">
            Exportar Relatórios
          </Link>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-poloar-azul">Próximas Entregas/Retiradas</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="table-header">
                <th className="py-2 px-4 text-left">Cliente</th>
                <th className="py-2 px-4 text-left">Modelo</th>
                <th className="py-2 px-4 text-left">Data</th>
                <th className="py-2 px-4 text-left">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4" colSpan={4}>
                    Carregando dados...
                  </td>
                </tr>
              ) : proximosEventos.length === 0 ? (
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4" colSpan={4}>
                    Nenhum evento programado.
                  </td>
                </tr>
              ) : (
                proximosEventos.map((evento, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{evento.cliente}</td>
                    <td className="py-3 px-4">{evento.modelo}</td>
                    <td className="py-3 px-4">{formatDate(getDataEvento(evento))}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${getTipoEvento(evento) === 'Entrega' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
                      >
                        {getTipoEvento(evento)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

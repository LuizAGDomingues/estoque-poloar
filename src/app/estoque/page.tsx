'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { estoqueService } from '@/services/estoqueService';
import { exportService } from '@/services/exportService';
import { Maquina } from '@/types';

export default function Estoque() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [consultor, setConsultor] = useState('');
  const [consultores, setConsultores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('data_entrega');
  
  // Paginação
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Buscando dados do Supabase com filtros:', { search, status, consultor, sortBy, page, limit });
      const result = await estoqueService.getWithFilters({ 
        search, 
        status, 
        consultor, 
        sortBy,
        page,
        limit
      });
      
      console.log('Dados recebidos:', result);
      setMaquinas(result.data);
      setTotalItems(result.count);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchConsultores = async () => {
    try {
      const result = await estoqueService.getConsultores();
      setConsultores(result);
    } catch (err) {
      console.error('Erro ao buscar consultores:', err);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchConsultores();
  }, [page, sortBy]);
  
  const handleSearch = () => {
    setPage(1);
    fetchData();
  };
  
  const handleExportXLSM = async () => {
    try {
      // Para exportação, buscar todos os dados sem paginação
      const allData = await estoqueService.getAll();
      
      if (allData && allData.length > 0) {
        exportService.exportToExcel(allData);
      } else {
        setError('Não há dados para exportar');
      }
    } catch (err) {
      console.error('Erro ao exportar para XLSM:', err);
      setError('Erro ao exportar dados. Verifique sua conexão.');
    }
  };
  
  const handleExportCSV = async () => {
    try {
      // Para exportação, buscar todos os dados sem paginação
      const allData = await estoqueService.getAll();
      
      if (allData && allData.length > 0) {
        exportService.exportToCSV(allData);
      } else {
        setError('Não há dados para exportar');
      }
    } catch (err) {
      console.error('Erro ao exportar para CSV:', err);
      setError('Erro ao exportar dados. Verifique sua conexão.');
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page * limit < totalItems) {
      setPage(prev => prev + 1);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-poloar-azul">Estoque de Máquinas</h1>
        <div className="flex space-x-2">
          <Link href="/cadastrar" className="btn-primary flex items-center">
            <span className="mr-1">+</span> Cadastrar Máquina
          </Link>
          <button 
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
            onClick={handleExportXLSM}
          >
            Exportar XLSM
          </button>
          <button 
            className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition"
            onClick={handleExportCSV}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input 
                type="text"
                placeholder="Buscar por modelo, cliente, código..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              />
            </div>
            
            <div className="w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              >
                <option value="">Todos</option>
                <option value="Em estoque">Em estoque</option>
                <option value="Entregue">Entregue</option>
                <option value="Retirado">Retirado</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            
            <div className="w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultor</label>
              <select 
                value={consultor}
                onChange={e => setConsultor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              >
                <option value="">Todos</option>
                {consultores.map((c, index) => (
                  <option key={index} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div className="w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
              >
                <option value="data_entrega">Data de Entrega</option>
                <option value="modelo">Modelo</option>
                <option value="cliente">Cliente</option>
                <option value="previsao_retirada">Previsão de Retirada</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="px-4 py-2 bg-poloar-azul text-white rounded-md hover:bg-blue-700 transition" 
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="table-header">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Modelo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Código</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Data Entrega</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Previsão Retirada</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-center" colSpan={7}>
                    Carregando dados...
                  </td>
                </tr>
              ) : maquinas.length === 0 ? (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-center" colSpan={7}>
                    Nenhuma máquina encontrada.
                  </td>
                </tr>
              ) : (
                maquinas.map(maquina => (
                  <tr key={maquina.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">{maquina.modelo}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{maquina.codigo}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{maquina.cliente}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatDate(maquina.data_entrega)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatDate(maquina.previsao_retirada)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${maquina.status === 'Em estoque' ? 'bg-blue-100 text-blue-800' : 
                          maquina.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                          maquina.status === 'Retirado' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {maquina.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/editar/${maquina.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
                              estoqueService.delete(maquina.id)
                                .then(res => {
                                  if (res.success) {
                                    fetchData();
                                  } else {
                                    setError(res.error || 'Erro ao excluir');
                                  }
                                })
                                .catch(err => {
                                  console.error('Erro ao excluir:', err);
                                  setError('Erro ao excluir. Verifique sua conexão.');
                                });
                            }
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{loading ? '0' : maquinas.length}</span> de <span className="font-medium">{totalItems}</span> itens
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 border border-gray-300 bg-white text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={page === 1 || loading}
                onClick={handlePreviousPage}
              >
                Anterior
              </button>
              <button 
                className="px-3 py-1 border border-gray-300 bg-white text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={page * limit >= totalItems || loading}
                onClick={handleNextPage}
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
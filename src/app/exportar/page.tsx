import Link from 'next/link';

export default function ExportarRelatorios() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-poloar-azul">Exportar Relatórios</h1>
        <Link href="/" className="text-poloar-azul hover:underline">
          Voltar para o Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-poloar-azul">Exportar para Excel (XLSM)</h2>
          <p className="text-gray-600 mb-6">
            Exporte os dados do estoque para um arquivo Excel com formatação completa, 
            incluindo cores, filtros e fórmulas.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo de Datas
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">De</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Até</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul">
                <option value="">Todos os Status</option>
                <option value="Em estoque">Em estoque</option>
                <option value="Entregue">Entregue</option>
                <option value="Retirado">Retirado</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incluir Colunas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="col_modelo" className="mr-2" checked readOnly />
                  <label htmlFor="col_modelo">Modelo</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="col_codigo" className="mr-2" checked readOnly />
                  <label htmlFor="col_codigo">Código</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="col_cliente" className="mr-2" checked readOnly />
                  <label htmlFor="col_cliente">Cliente</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="col_consultor" className="mr-2" checked readOnly />
                  <label htmlFor="col_consultor">Consultor</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="col_datas" className="mr-2" checked readOnly />
                  <label htmlFor="col_datas">Datas</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="col_obs" className="mr-2" />
                  <label htmlFor="col_obs">Observações</label>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
              Exportar XLSM
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-poloar-azul">Exportar para CSV</h2>
          <p className="text-gray-600 mb-6">
            Exporte os dados do estoque para um arquivo CSV simples, 
            compatível com a maioria dos programas de planilhas.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo de Datas
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">De</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Até</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-poloar-azul">
                <option value="">Todos os Status</option>
                <option value="Em estoque">Em estoque</option>
                <option value="Entregue">Entregue</option>
                <option value="Retirado">Retirado</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opções de Formatação
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="opt_header" className="mr-2" checked readOnly />
                  <label htmlFor="opt_header">Incluir cabeçalhos</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="opt_delimiter" className="mr-2" />
                  <label htmlFor="opt_delimiter">Usar ponto-e-vírgula como delimitador</label>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-poloar-azul">Histórico de Exportações</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Filtros Aplicados</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuário</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>
                  Nenhuma exportação realizada recentemente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
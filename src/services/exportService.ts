import { Maquina } from '@/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportService = {
  // Exportar para Excel (XLSM)
  exportToExcel(maquinas: Maquina[], fileName = 'estoque-poloar.xlsx') {
    // Preparar os dados para o Excel
    const worksheet = XLSX.utils.json_to_sheet(maquinas.map(m => ({
      Modelo: m.modelo,
      Código: m.codigo,
      Quantidade: m.quantidade,
      Consultor: m.consultor,
      Cliente: m.cliente,
      Contato: m.contato,
      'Data de Entrega': m.data_entrega ? new Date(m.data_entrega).toLocaleDateString('pt-BR') : '',
      'Quem Recebeu': m.quem_recebeu,
      'Previsão de Retirada': m.previsao_retirada ? new Date(m.previsao_retirada).toLocaleDateString('pt-BR') : '',
      'Data de Saída': m.data_saida ? new Date(m.data_saida).toLocaleDateString('pt-BR') : '',
      'Quem Entregou': m.quem_entregou,
      Status: m.status,
      Observações: m.obs
    })));
    
    // Configurar larguras das colunas
    const widths = [
      { wch: 15 }, // Modelo
      { wch: 15 }, // Código
      { wch: 10 }, // Quantidade
      { wch: 15 }, // Consultor
      { wch: 20 }, // Cliente
      { wch: 15 }, // Contato
      { wch: 15 }, // Data de Entrega
      { wch: 15 }, // Quem Recebeu
      { wch: 15 }, // Previsão de Retirada
      { wch: 15 }, // Data de Saída
      { wch: 15 }, // Quem Entregou
      { wch: 15 }, // Status
      { wch: 30 }, // Observações
    ];
    
    worksheet['!cols'] = widths;
    
    // Aplicar formatação condicional para o status
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const statusIndex = rows[0] && Array.isArray(rows[0]) 
      ? rows[0].findIndex((header) => header === 'Status')
      : -1;
    
    // Criar o workbook e adicionar a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque');
    
    // Aplicar formatação para a planilha
    worksheet['!autofilter'] = { ref: `A1:M${rows.length}` };
    
    // Exportar para XLSX
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  },
  
  // Exportar para CSV
  exportToCSV(maquinas: Maquina[], fileName = 'estoque-poloar.csv', useSemicolon = false) {
    // Preparar os dados para o CSV
    const data = maquinas.map(m => ({
      Modelo: m.modelo,
      Código: m.codigo,
      Quantidade: m.quantidade,
      Consultor: m.consultor,
      Cliente: m.cliente,
      Contato: m.contato,
      'Data de Entrega': m.data_entrega ? new Date(m.data_entrega).toLocaleDateString('pt-BR') : '',
      'Quem Recebeu': m.quem_recebeu,
      'Previsão de Retirada': m.previsao_retirada ? new Date(m.previsao_retirada).toLocaleDateString('pt-BR') : '',
      'Data de Saída': m.data_saida ? new Date(m.data_saida).toLocaleDateString('pt-BR') : '',
      'Quem Entregou': m.quem_entregou,
      Status: m.status,
      Observações: m.obs
    }));
    
    // Criar a planilha
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOptions = {
      FS: useSemicolon ? ';' : ',', // Delimitador de campos
      RS: '\n', // Quebra de linha
      BOM: true, // Adicionar BOM para suporte a caracteres especiais
    };
    
    // Converter para CSV
    const csvContent = XLSX.utils.sheet_to_csv(worksheet, csvOptions);
    
    // Criar o blob e iniciar o download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName);
  },
  
  // Filtrar dados para exportação
  async prepareDataForExport(
    maquinas: Maquina[],
    { 
      status, 
      dataInicio, 
      dataFim,
      incluirObservacoes = true
    }: {
      status?: string;
      dataInicio?: string;
      dataFim?: string;
      incluirObservacoes?: boolean;
    }
  ): Promise<Maquina[]> {
    let filteredData = [...maquinas];
    
    // Filtrar por status
    if (status) {
      filteredData = filteredData.filter(m => m.status === status);
    }
    
    // Filtrar por data de entrega
    if (dataInicio) {
      filteredData = filteredData.filter(m => 
        m.data_entrega && new Date(m.data_entrega) >= new Date(dataInicio)
      );
    }
    
    if (dataFim) {
      filteredData = filteredData.filter(m => 
        m.data_entrega && new Date(m.data_entrega) <= new Date(dataFim)
      );
    }
    
    // Remover observações se não forem solicitadas
    if (!incluirObservacoes) {
      filteredData = filteredData.map(m => ({
        ...m,
        obs: ''
      }));
    }
    
    return filteredData;
  }
}; 
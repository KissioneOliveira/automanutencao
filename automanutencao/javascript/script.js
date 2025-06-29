// Sistema de Manutenção Preventiva de Veículos
class VehicleMaintenanceSystem {
    constructor() {
        this.vehicles = this.loadVehicles();
        this.editingId = null;
        this.deleteId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderVehicles();
        this.updateSummary();
        this.setDefaultDate();
    }

    // Configurar data padrão para hoje
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ultima-manutencao').value = today;
    }

    // Vincular eventos
    bindEvents() {
        // Formulário
        document.getElementById('vehicle-form').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelEdit());

        // Filtros
        document.getElementById('filter-status').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-search').addEventListener('input', () => this.applyFilters());
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // Modal de confirmação
        document.getElementById('confirm-delete').addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancel-delete').addEventListener('click', () => this.closeModal('confirm-modal'));

        // Modal de histórico
        document.getElementById('close-history').addEventListener('click', () => this.closeModal('history-modal'));

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Validação em tempo real
        document.getElementById('placa').addEventListener('input', (e) => this.formatPlaca(e));
        document.getElementById('quilometragem').addEventListener('input', (e) => this.validateKm(e));
        document.getElementById('km-ultima-manutencao').addEventListener('input', (e) => this.validateKm(e));
    }

    // Formatar placa
    formatPlaca(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length > 3) {
            value = value.substring(0, 3) + '-' + value.substring(3, 7);
        }
        e.target.value = value;
    }

    // Validar quilometragem
    validateKm(e) {
        const kmAtual = parseInt(document.getElementById('quilometragem').value) || 0;
        const kmUltima = parseInt(document.getElementById('km-ultima-manutencao').value) || 0;
        
        if (e.target.id === 'km-ultima-manutencao' && kmUltima > kmAtual) {
            e.target.setCustomValidity('A quilometragem da última manutenção não pode ser maior que a atual');
        } else {
            e.target.setCustomValidity('');
        }
    }

    // Manipular envio do formulário
    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const vehicleData = Object.fromEntries(formData.entries());

        // Validações
        if (!this.validateVehicleData(vehicleData)) {
            return;
        }

        if (this.editingId) {
            this.updateVehicle(this.editingId, vehicleData);
        } else {
            this.addVehicle(vehicleData);
        }

        this.resetForm();
        this.renderVehicles();
        this.updateSummary();
        this.saveVehicles();
    }

    // Validar dados do veículo
    validateVehicleData(data) {
        const kmAtual = parseInt(data.quilometragem);
        const kmUltima = parseInt(data['km-ultima-manutencao']);

        if (kmUltima > kmAtual) {
            alert('A quilometragem da última manutenção não pode ser maior que a atual');
            return false;
        }

        // Verificar se a placa já existe (exceto na edição)
        const existingVehicle = this.vehicles.find(v => 
            v.placa === data.placa && v.id !== this.editingId
        );

        if (existingVehicle) {
            alert('Já existe um veículo cadastrado com esta placa');
            return false;
        }

        return true;
    }

    // Adicionar veículo
    addVehicle(data) {
        const vehicle = {
            id: Date.now().toString(),
            ...data,
            quilometragem: parseInt(data.quilometragem),
            'km-ultima-manutencao': parseInt(data['km-ultima-manutencao']),
            'intervalo-km': parseInt(data['intervalo-km']),
            'intervalo-meses': parseInt(data['intervalo-meses']),
            ano: parseInt(data.ano),
            historico: [{
                data: data['ultima-manutencao'],
                km: parseInt(data['km-ultima-manutencao']),
                tipo: data['tipo-manutencao'],
                observacoes: data.observacoes || 'Manutenção inicial cadastrada no sistema'
            }]
        };

        this.vehicles.push(vehicle);
    }

    // Atualizar veículo
    updateVehicle(id, data) {
        const vehicleIndex = this.vehicles.findIndex(v => v.id === id);
        if (vehicleIndex === -1) return;

        const vehicle = this.vehicles[vehicleIndex];
        const oldKm = vehicle['km-ultima-manutencao'];
        const newKm = parseInt(data['km-ultima-manutencao']);

        // Se a quilometragem da última manutenção mudou, adicionar ao histórico
        if (oldKm !== newKm || vehicle['ultima-manutencao'] !== data['ultima-manutencao']) {
            vehicle.historico.push({
                data: data['ultima-manutencao'],
                km: newKm,
                tipo: data['tipo-manutencao'],
                observacoes: data.observacoes || 'Manutenção atualizada'
            });
        }

        // Atualizar dados do veículo
        Object.assign(vehicle, {
            ...data,
            quilometragem: parseInt(data.quilometragem),
            'km-ultima-manutencao': newKm,
            'intervalo-km': parseInt(data['intervalo-km']),
            'intervalo-meses': parseInt(data['intervalo-meses']),
            ano: parseInt(data.ano)
        });

        this.vehicles[vehicleIndex] = vehicle;
    }

    // Editar veículo
    editVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        this.editingId = id;
        
        // Preencher formulário
        document.getElementById('placa').value = vehicle.placa;
        document.getElementById('modelo').value = vehicle.modelo;
        document.getElementById('ano').value = vehicle.ano;
        document.getElementById('quilometragem').value = vehicle.quilometragem;
        document.getElementById('ultima-manutencao').value = vehicle['ultima-manutencao'];
        document.getElementById('km-ultima-manutencao').value = vehicle['km-ultima-manutencao'];
        document.getElementById('intervalo-km').value = vehicle['intervalo-km'];
        document.getElementById('intervalo-meses').value = vehicle['intervalo-meses'];
        document.getElementById('tipo-manutencao').value = vehicle['tipo-manutencao'];
        document.getElementById('observacoes').value = vehicle.observacoes || '';

        // Atualizar interface
        document.getElementById('form-title').textContent = 'Editar Veículo';
        document.getElementById('submit-btn').textContent = 'Atualizar Veículo';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll para o formulário
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Cancelar edição
    cancelEdit() {
        this.editingId = null;
        this.resetForm();
    }

    // Resetar formulário
    resetForm() {
        document.getElementById('vehicle-form').reset();
        document.getElementById('form-title').textContent = 'Cadastrar Novo Veículo';
        document.getElementById('submit-btn').textContent = 'Cadastrar Veículo';
        document.getElementById('cancel-btn').style.display = 'none';
        this.editingId = null;
        this.setDefaultDate();
    }

    // Excluir veículo
    deleteVehicle(id) {
        this.deleteId = id;
        this.openModal('confirm-modal');
    }

    // Confirmar exclusão
    confirmDelete() {
        if (this.deleteId) {
            this.vehicles = this.vehicles.filter(v => v.id !== this.deleteId);
            this.renderVehicles();
            this.updateSummary();
            this.saveVehicles();
            this.deleteId = null;
        }
        this.closeModal('confirm-modal');
    }

    // Mostrar histórico
    showHistory(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = `
            <div class="vehicle-info" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4>${vehicle.modelo} - ${vehicle.placa}</h4>
                <p>Ano: ${vehicle.ano} | KM Atual: ${vehicle.quilometragem.toLocaleString()}</p>
            </div>
            <div class="history-list">
                ${vehicle.historico.sort((a, b) => new Date(b.data) - new Date(a.data))
                    .map(item => `
                        <div class="history-item">
                            <div class="history-date">
                                ${this.formatDate(item.data)} - KM: ${item.km.toLocaleString()}
                            </div>
                            <div class="history-details">
                                <div><strong>Tipo:</strong> ${item.tipo}</div>
                            </div>
                            ${item.observacoes ? `<div class="history-obs">${item.observacoes}</div>` : ''}
                        </div>
                    `).join('')}
            </div>
        `;

        this.openModal('history-modal');
    }

    // Calcular próxima manutenção
    calculateNextMaintenance(vehicle) {
        const lastDate = new Date(vehicle['ultima-manutencao']);
        const lastKm = vehicle['km-ultima-manutencao'];
        const currentKm = vehicle.quilometragem;
        const intervalKm = vehicle['intervalo-km'];
        const intervalMonths = vehicle['intervalo-meses'];

        // Próxima manutenção por quilometragem
        const nextKm = lastKm + intervalKm;
        const kmRemaining = nextKm - currentKm;

        // Próxima manutenção por data
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + intervalMonths);

        // Dias restantes
        const today = new Date();
        const daysRemaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

        return {
            nextKm,
            kmRemaining,
            nextDate,
            daysRemaining,
            status: this.getMaintenanceStatus(kmRemaining, daysRemaining)
        };
    }

    // Obter status da manutenção
    getMaintenanceStatus(kmRemaining, daysRemaining) {
        if (kmRemaining <= 0 || daysRemaining <= 0) {
            return 'atrasado';
        } else if (kmRemaining <= 1000 || daysRemaining <= 30) {
            return 'atencao';
        } else {
            return 'em-dia';
        }
    }

    // Renderizar veículos
    renderVehicles() {
        const container = document.getElementById('vehicles-list');
        
        if (this.vehicles.length === 0) {
            container.innerHTML = `
                <div class="no-vehicles">
                    <p>Nenhum veículo cadastrado ainda.</p>
                    <p>Use o formulário acima para cadastrar o primeiro veículo.</p>
                </div>
            `;
            return;
        }

        const filteredVehicles = this.getFilteredVehicles();

        if (filteredVehicles.length === 0) {
            container.innerHTML = `
                <div class="no-vehicles">
                    <p>Nenhum veículo encontrado com os filtros aplicados.</p>
                    <p>Tente ajustar os filtros ou limpar a busca.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredVehicles.map(vehicle => {
            const maintenance = this.calculateNextMaintenance(vehicle);
            return this.createVehicleCard(vehicle, maintenance);
        }).join('');
    }

    // Criar card do veículo
    createVehicleCard(vehicle, maintenance) {
        const statusText = {
            'em-dia': 'Em dia',
            'atencao': 'Atenção',
            'atrasado': 'Atrasado'
        };

        return `
            <div class="vehicle-card ${maintenance.status}">
                <div class="vehicle-header">
                    <div class="vehicle-info">
                        <h3>${vehicle.modelo}</h3>
                        <span class="placa">${vehicle.placa}</span>
                    </div>
                    <span class="status-badge ${maintenance.status}">
                        ${statusText[maintenance.status]}
                    </span>
                </div>
                
                <div class="vehicle-details">
                    <div class="detail-row">
                        <span class="detail-label">Ano:</span>
                        <span class="detail-value">${vehicle.ano}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">KM Atual:</span>
                        <span class="detail-value">${vehicle.quilometragem.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Última Manutenção:</span>
                        <span class="detail-value">${this.formatDate(vehicle['ultima-manutencao'])}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">KM da Última:</span>
                        <span class="detail-value">${vehicle['km-ultima-manutencao'].toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Próxima por KM:</span>
                        <span class="detail-value">${maintenance.nextKm.toLocaleString()} 
                            (${maintenance.kmRemaining > 0 ? `faltam ${maintenance.kmRemaining.toLocaleString()}` : `atrasado ${Math.abs(maintenance.kmRemaining).toLocaleString()}`})
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Próxima por Data:</span>
                        <span class="detail-value">${this.formatDate(maintenance.nextDate)} 
                            (${maintenance.daysRemaining > 0 ? `${maintenance.daysRemaining} dias` : `${Math.abs(maintenance.daysRemaining)} dias atrasado`})
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tipo:</span>
                        <span class="detail-value">${vehicle['tipo-manutencao']}</span>
                    </div>
                </div>

                <div class="vehicle-actions">
                    <button class="btn-edit" onclick="vehicleSystem.editVehicle('${vehicle.id}')">
                        Editar
                    </button>
                    <button class="btn-history" onclick="vehicleSystem.showHistory('${vehicle.id}')">
                        Histórico
                    </button>
                    <button class="btn-delete" onclick="vehicleSystem.deleteVehicle('${vehicle.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }

    // Obter veículos filtrados
    getFilteredVehicles() {
        const statusFilter = document.getElementById('filter-status').value;
        const searchFilter = document.getElementById('filter-search').value.toLowerCase();

        return this.vehicles.filter(vehicle => {
            const maintenance = this.calculateNextMaintenance(vehicle);
            
            // Filtro por status
            if (statusFilter !== 'todos' && maintenance.status !== statusFilter) {
                return false;
            }

            // Filtro por busca
            if (searchFilter && 
                !vehicle.placa.toLowerCase().includes(searchFilter) &&
                !vehicle.modelo.toLowerCase().includes(searchFilter)) {
                return false;
            }

            return true;
        });
    }

    // Aplicar filtros
    applyFilters() {
        this.renderVehicles();
        this.updateSummary();
    }

    // Limpar filtros
    clearFilters() {
        document.getElementById('filter-status').value = 'todos';
        document.getElementById('filter-search').value = '';
        this.applyFilters();
    }

    // Atualizar resumo
    updateSummary() {
        const filteredVehicles = this.getFilteredVehicles();
        const total = filteredVehicles.length;
        let attention = 0;
        let overdue = 0;

        filteredVehicles.forEach(vehicle => {
            const maintenance = this.calculateNextMaintenance(vehicle);
            if (maintenance.status === 'atencao') attention++;
            if (maintenance.status === 'atrasado') overdue++;
        });

        document.getElementById('total-vehicles').textContent = `Total: ${total}`;
        document.getElementById('attention-count').textContent = `Atenção: ${attention}`;
        document.getElementById('overdue-count').textContent = `Atrasados: ${overdue}`;
    }

    // Abrir modal
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fechar modal
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Formatar data
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Carregar veículos do localStorage
    loadVehicles() {
        try {
            const stored = localStorage.getItem('vehicleMaintenanceData');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return [];
        }
    }

    // Salvar veículos no localStorage
    saveVehicles() {
        try {
            localStorage.setItem('vehicleMaintenanceData', JSON.stringify(this.vehicles));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Verifique o espaço disponível no navegador.');
        }
    }

    // Exportar dados
    exportData() {
        const dataStr = JSON.stringify(this.vehicles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `manutencao-veiculos-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Importar dados
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.vehicles = importedData;
                    this.saveVehicles();
                    this.renderVehicles();
                    this.updateSummary();
                    alert('Dados importados com sucesso!');
                } else {
                    alert('Formato de arquivo inválido.');
                }
            } catch (error) {
                alert('Erro ao importar dados. Verifique o formato do arquivo.');
            }
        };
        reader.readAsText(file);
    }
}

// Inicializar sistema quando a página carregar
let vehicleSystem;

document.addEventListener('DOMContentLoaded', () => {
    vehicleSystem = new VehicleMaintenanceSystem();
    
    // Adicionar funcionalidades de exportar/importar se necessário
    console.log('Sistema de Manutenção Preventiva carregado com sucesso!');
    console.log('Para exportar dados: vehicleSystem.exportData()');
    console.log('Para importar dados: vehicleSystem.importData(file)');
});


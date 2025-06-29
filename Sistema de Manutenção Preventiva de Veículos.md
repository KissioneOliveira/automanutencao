# Sistema de Manutenção Preventiva de Veículos

Um sistema web completo para controle e registro de manutenção preventiva de veículos passeio  e camionetes, desenvolvido com HTML, CSS e JavaScript puro.

## 🚗 Funcionalidades

### Cadastro de Veículos
- Registro completo de informações do veículo (placa, modelo, ano, quilometragem)
- Histórico de manutenções realizadas
- Configuração de intervalos personalizados (quilometragem e tempo)
- Diferentes tipos de manutenção (troca de óleo, revisão geral, etc.)
- Campo para observações detalhadas

### Controle de Manutenções
- **Cálculo automático da próxima manutenção** baseado em:
  - Quilometragem (intervalo configurável)
  - Tempo decorrido (intervalo em meses configurável)
- **Sistema de alertas visuais**:
  - 🟢 **Em dia**: Manutenção dentro do prazo
  - 🟡 **Atenção**: Próximo do vencimento (≤ 1.000 km ou ≤ 30 dias)
  - 🔴 **Atrasado**: Manutenção vencida

### Gestão e Organização
- Listagem visual de todos os veículos cadastrados
- Filtros por status (em dia, atenção, atrasado)
- Busca por placa ou modelo
- Resumo estatístico (total, atenção, atrasados)
- Edição e exclusão de registros
- Histórico completo de manutenções

### Persistência de Dados
- Armazenamento local no navegador (localStorage)
- Dados preservados entre sessões
- Funcionalidades de exportação/importação (via console)

## 📋 Como Usar

### 1. Instalação
Não é necessária instalação. Basta abrir o arquivo `index.html` em qualquer navegador moderno.

### 2. Primeiro Uso
1. Abra o arquivo `index.html` no seu navegador
2. Preencha o formulário "Cadastrar Novo Veículo" com as informações:
   - **Placa**: Formato ABC-1234 (formatação automática)
   - **Modelo**: Nome/modelo do veículo
   - **Ano**: Ano de fabricação
   - **Quilometragem Atual**: KM atual do veículo
   - **Data da Última Manutenção**: Quando foi feita a última manutenção
   - **KM da Última Manutenção**: Quilometragem na última manutenção
   - **Intervalo de KM**: A cada quantos KM fazer manutenção (padrão: 10.000)
   - **Intervalo de Meses**: A cada quantos meses fazer manutenção (padrão: 6)
   - **Tipo de Manutenção**: Selecione o tipo realizado
   - **Observações**: Informações adicionais (opcional)

3. Clique em "Cadastrar Veículo"

### 3. Gerenciamento
- **Editar**: Clique no botão "Editar" para modificar informações do veículo
- **Histórico**: Visualize todas as manutenções realizadas
- **Excluir**: Remove o veículo do sistema (com confirmação)
- **Filtros**: Use os filtros para encontrar veículos específicos

### 4. Interpretação dos Status
- **Em dia** (verde): Veículo com manutenção em dia
- **Atenção** (amarelo): Manutenção próxima do vencimento
- **Atrasado** (vermelho): Manutenção vencida - ação necessária

## 🔧 Recursos Técnicos

### Tecnologias Utilizadas
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com gradientes e animações
- **JavaScript ES6+**: Lógica de negócio e manipulação do DOM
- **LocalStorage**: Persistência de dados local

### Compatibilidade
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móveis (design responsivo)

### Recursos Avançados
- Validação em tempo real de formulários
- Formatação automática de placa
- Cálculos automáticos de próximas manutenções
- Interface responsiva para desktop e mobile
- Modais para confirmações e histórico
- Animações suaves e feedback visual

## 📱 Design Responsivo

O sistema foi desenvolvido com design responsivo, adaptando-se automaticamente a:
- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Ajuste automático do layout
- **Mobile**: Interface otimizada para toque, layout em coluna única

## 💾 Backup e Restauração

### Exportar Dados
Abra o console do navegador (F12) e execute:
```javascript
vehicleSystem.exportData()
```

### Importar Dados
1. Abra o console do navegador (F12)
2. Execute o comando:
```javascript
// Primeiro, crie um input file
const input = document.createElement('input');
input.type = 'file';
input.accept = '.json';
input.onchange = (e) => vehicleSystem.importData(e.target.files[0]);
input.click();
```

## 🛠️ Personalização

### Intervalos Padrão
Os intervalos padrão podem ser alterados editando o arquivo `index.html`:
- Intervalo de KM: linha com `value="10000"`
- Intervalo de meses: linha com `value="6"`

### Tipos de Manutenção
Para adicionar novos tipos, edite o `<select>` no arquivo `index.html`:
```html
<option value="Novo Tipo">Novo Tipo</option>
```

## 🔒 Segurança e Privacidade

- **Dados locais**: Todas as informações ficam armazenadas apenas no seu navegador
- **Sem servidor**: Não há envio de dados para servidores externos
- **Privacidade total**: Seus dados de veículos permanecem privados

## 📞 Suporte

### Problemas Comuns
1. **Dados não salvam**: Verifique se o navegador permite localStorage
2. **Layout quebrado**: Atualize o navegador ou use uma versão mais recente
3. **Cálculos incorretos**: Verifique se as datas e quilometragens estão corretas

### Limitações
- Capacidade limitada pelo localStorage do navegador (~5-10MB)
- Funciona apenas com JavaScript habilitado
- Dados são específicos do navegador/dispositivo

## 📄 Licença

Este sistema foi desenvolvido para uso pessoal e profissional. Você pode modificar e distribuir livremente.

---




class PainelGestorEmpresa {
    constructor() {
        this.init();
    }

    init() {
        const initFunc = () => {
            const empresaAtiva = JSON.parse(
                localStorage.getItem('empresaAtiva')
            );
            if (!empresaAtiva) {
                console.error(
                    'Nenhuma empresa ativa encontrada no localStorage.'
                );
                return;
            }
            this.carregarConteudoInicial();
            this.adicionarEventListeners();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFunc);
        } else {
            initFunc();
        }
    }

    carregarConteudoInicial() {
        this.carregarConteudoAba('usuarios');
    }

    adicionarEventListeners() {
        // Links do menu lateral
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const aba = link.getAttribute('data-aba');
                this.carregarConteudoAba(aba);
                if (window.innerWidth <= 768) {
                    document
                        .querySelector('.nav-lateral')
                        .classList.remove('active');
                }
            });
        });

        // Botão hamburguer (mobile)
        const menuHamburguer = document.querySelector('.menu-hamburguer');
        if (menuHamburguer) {
            menuHamburguer.addEventListener('click', () => {
                document
                    .querySelector('.nav-lateral')
                    .classList.toggle('active');
            });
        }

        // Fecha nav se clicar fora (mobile)
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.nav-lateral');
            const hamburger = document.querySelector('.menu-hamburguer');
            if (
                window.innerWidth <= 768 &&
                !nav.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                nav.classList.remove('active');
            }
        });

        // Modal de exclusão
        const btnSimExcluir = document.getElementById('btnSimExcluir');
        if (btnSimExcluir) {
            btnSimExcluir.addEventListener('click', () => this.excluirConta());
        }
        const btnNaoExcluir = document.getElementById('btnNaoExcluir');
        if (btnNaoExcluir) {
            btnNaoExcluir.addEventListener('click', () =>
                this.fecharModalExclusao()
            );
        }

        // Botão logout
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    logout() {
        console.log(
            'Empresa Ativa após logout:',
            JSON.parse(localStorage.getItem('empresaAtiva'))
        );
        alert('Logout realizado com sucesso!');
        window.location.href = '../index.html';
    }

    salvarEmpresaAtiva(empresa) {
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const idx = empresasGestor.findIndex(
            (emp) => emp.email === empresa.email
        );
        if (idx !== -1) {
            if (
                !empresa.veiculos ||
                (Array.isArray(empresa.veiculos) &&
                    empresa.veiculos.length === 0)
            ) {
                empresa.veiculos = empresasGestor[idx].veiculos || [];
            }
            const merged = { ...empresasGestor[idx], ...empresa };
            empresasGestor[idx] = merged;
            localStorage.setItem(
                'empresasGestor',
                JSON.stringify(empresasGestor)
            );
            localStorage.setItem('empresaAtiva', JSON.stringify(merged));
        } else {
            localStorage.setItem('empresaAtiva', JSON.stringify(empresa));
        }
    }

    carregarConteudoAba(aba) {
        const conteudoAba = document.getElementById('conteudoAba');
        if (!conteudoAba) return;

        let conteudo = '';
        switch (aba) {
            case 'usuarios':
                conteudo = `
                    <h2>Gestão de Usuários</h2>
                    <p>Aqui você pode gerenciar alunos e funcionários.</p>
                    <div style="margin-bottom: 1rem;">
                      <h3>Gerar Link de Cadastro</h3>
                      <select id="tipoCadastro">
                        <option value="aluno">Aluno</option>
                        <option value="funcionario">Funcionário</option>
                      </select>
                      <button id="gerarLink" class="btn btn-primary">Gerar Link</button>
                      <p id="linkGerado" style="margin-top: 0.5rem;"></p>
                    </div>
                    <!-- Bloco de Filtros -->
<div id="filtrosUsuarios">
  <div class="filtro-group">
    <label for="filtroNome">Nome:</label>
    <input type="text" id="filtroNome" placeholder="Pesquisar nome..." />
  </div>

  <div class="filtro-group">
    <label for="filtroTipo">Tipo:</label>
    <select id="filtroTipo">
      <option value="todos">Todos</option>
      <option value="aluno">Alunos</option>
      <option value="funcionario">Funcionários</option>
    </select>
  </div>

  <div class="filtro-group">
    <label for="filtroFinanceiro">Financeiro:</label>
    <select id="filtroFinanceiro">
      <option value="todos">Todos</option>
      <option value="atraso">Em Atraso</option>
      <option value="pendente">Pendente</option>
    </select>
  </div>

  <div class="filtro-group">
    <label for="filtroMotoristaUsuarios">Motorista:</label>
    <select id="filtroMotoristaUsuarios">
      <option value="">Todos</option>
    </select>
  </div>

  <div class="filtro-group">
    <label for="filtroFrotaUsuarios">Frota:</label>
    <select id="filtroFrotaUsuarios">
      <option value="">Todas</option>
    </select>
  </div>

  <div class="filtro-group">
    <label for="filtroFaculdade">Faculdade:</label>
    <select id="filtroFaculdade">
      <option value="">Todas</option>
    </select>
  </div>

  <div class="filtro-group">
    <label for="filtroEmpresa">Empresa:</label>
    <select id="filtroEmpresa">
      <option value="">Todas</option>
    </select>
  </div>
</div>

                    <button class="accordion-header" aria-expanded="false">
                      <span>Lista de Alunos</span>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="accordion-content" hidden>
                      <div class="table-responsive">
                        <table id="tabelaAlunos">
                          <thead>
                            <tr>
                              <th>Nome</th>
                              <th>Faculdade</th>
                              <th>E-mail</th>
                              <th>Telefone</th>
                              <th>Motorista</th>
                              <th>Financeiro</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <button class="accordion-header" aria-expanded="false">
                      <span>Lista de Funcionários</span>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="accordion-content" hidden>
                      <div class="table-responsive">
                        <table id="tabelaFuncionarios">
                          <thead>
                            <tr>
                              <th>Nome</th>
                              <th>Empresa</th>
                              <th>E-mail</th>
                              <th>Telefone</th>
                              <th>Motorista</th>
                              <th>Financeiro</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                `;
                break;
            case 'motoristas':
                conteudo = `
                    <h2>Gestão de Motoristas</h2>
                    <div id="formCadastroMotoristaContainer">
                      <h3>Cadastro de Motorista</h3>
                      <form id="formCadastroMotorista" class="responsive-form">
                        <label>Nome Completo</label>
                        <input type="text" id="driverNome" required>
                        <label>CNH</label>
                        <input type="text" id="driverCnh" required>
                        <label>Categoria CNH</label>
                        <input type="text" id="driverCategoria" required>
                        <label>Expedição CNH</label>
                        <input type="date" id="driverExpedicao" required>
                        <label>Validade CNH</label>
                        <input type="date" id="driverValidade" required>
                        <button type="submit" class="btn btn-primary">Concluir Cadastro</button>
                      </form>
                      <div id="linkGeradoMotorista" style="margin-top: 1rem;"></div>
                    </div>
                    <div id="tableMotoristasContainer">
                      <h3>Lista de Motoristas</h3>
                      <div class="table-responsive">
                        <table id="tabelaMotoristas">
                          <thead>
                            <tr>
                              <th>Nome</th>
                              <th>CNH</th>
                              <th>Categoria</th>
                              <th>Validade</th>
                              <th>Status</th>
                              <th>Frota Responsável</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div id="detalhesMotoristaContainer" style="display: none; margin-top: 2rem;">
                      <nav style="margin-bottom:1rem; display: flex; align-items: center;">
                        <button class="btn btn-primary" data-motorista-tab="dados">Dados</button>
                        <button class="btn btn-primary" data-motorista-tab="frota">Frota Responsável</button>
                        <button class="btn btn-primary" data-motorista-tab="feedbacks">Feedbacks</button>
                        <button class="btn btn-primary" data-motorista-tab="rotas">Rotas, Pontos e Paradas</button>
                        <button class="btn btn-primary" data-motorista-tab="associados">Associados</button>
                        <button class="btn btn-danger" id="fecharDetalhesMotorista" style="margin-left: auto;">Fechar</button>
                      </nav>
                      <div id="motoristaTabsContent"></div>
                    </div>
                `;
                break;
            case 'rotas':
                conteudo = `<h2>Gestão de Rotas</h2><p>Em breve...</p>`;
                break;
            case 'veiculos':
                conteudo = `
                    <h2>Gestão de Veículos</h2>
                    <p>Cadastre, gerencie e acompanhe a disponibilidade e manutenção.</p>
                    <button id="btnNovoVeiculo" class="btn btn-primary">Adicionar Veículo</button>
                    <div id="formCadastroVeiculo" style="display: none; margin-top: 1rem;">
                      <form class="responsive-form" id="formVeiculo">
                        <label>N° de Frota</label>
                        <input type="text" id="frotaNumero" required />
                        <label>Placa</label>
                        <input type="text" id="placaVeiculo" required />
                        <label>Renavam</label>
                        <input type="text" id="renavamVeiculo" required />
                        <label>Ano</label>
                        <input type="text" id="anoVeiculo" required />
                        <label>Modelo</label>
                        <input type="text" id="modeloVeiculo" required />
                        <label>Tipo de Combustível</label>
                        <input type="text" id="combustivelVeiculo" required />
                        <label>Assentos Totais</label>
                        <input type="number" id="assentosVeiculo" required />
                        <label>Uso</label>
                        <select id="usoVeiculo" required>
                          <option value="">Selecione...</option>
                          <option value="Empresa">Empresa</option>
                          <option value="Fretamento">Fretamento</option>
                        </select>
                        <label>Situação Financeira</label>
                        <select id="financiamentoStatus" required>
                          <option value="">Selecione...</option>
                          <option value="Quitado">Quitado</option>
                          <option value="Financiado">Financiado</option>
                        </select>
                        <div id="financiadoCampos" style="display: none;">
                          <label>Parcelas Totais</label>
                          <input type="number" id="parcelasTotais" />
                          <label>Parcelas Restantes</label>
                          <input type="number" id="parcelasRestantes" />
                          <label>Data de Vencimento</label>
                          <input type="date" id="dataVencimentoFinanciamento" />
                        </div>
                        <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Salvar Veículo</button>
                      </form>
                    </div>
                    <div class="table-responsive" style="margin-top: 1rem;">
                      <table id="tabelaVeiculos">
                        <thead>
                          <tr>
                            <th>N° Frota</th>
                            <th>Financiamento</th>
                            <th>Disponibilidade</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                    <div id="detalhesVeiculoContainer" style="display: none; margin-top: 2rem;">
                      <nav style="margin-bottom:1rem;">
                        <button class="btn btn-primary" data-veiculo-tab="dados">Dados</button>
                        <button class="btn btn-primary" data-veiculo-tab="manutencao">Manutenção</button>
                        <button class="btn btn-primary" data-veiculo-tab="agendamento">Agendamento</button>
                        <button class="btn btn-primary" data-veiculo-tab="fretamento">Fretamento</button>
                      </nav>
                      <div id="veiculoTabsContent"></div>
                    </div>
                `;
                break;
            case 'financeiro':
                conteudo = `
                    <h2>Gestão Financeira</h2>
                    <div id="filtroFinanceiro" style="margin-bottom: 1rem;">
                      <label>Filtrar por Motorista:</label>
                      <select id="filtroMotorista"><option value="">Todos</option></select>
                      <label>Filtrar por Frota:</label>
                      <select id="filtroFrota"><option value="">Todas</option></select>
                    </div>
                    <div style="display: flex; gap: 2rem;">
                      <div style="flex: 1;">
                        <h3>Alunos</h3>
                        <ul id="listaFinanceiroAlunos"></ul>
                      </div>
                      <div style="flex: 1;">
                        <h3>Funcionários</h3>
                        <ul id="listaFinanceiroFuncionarios"></ul>
                      </div>
                    </div>
                    <div id="detalhesFinanceiroContainer" style="display: none; margin-top: 2rem;">
                      <nav style="margin-bottom:1rem;">
                        <button class="btn btn-primary" data-financeiro-tab="dados">Dados</button>
                        <button class="btn btn-primary" data-financeiro-tab="financeiro">Plano</button>
                        <button class="btn btn-primary" data-financeiro-tab="historico">Histórico</button>
                        <button class="btn btn-danger" id="fecharDetalhesFinanceiro" style="margin-left: auto;">Fechar</button>
                      </nav>
                      <div id="financeiroTabsContent"></div>
                    </div>
                `;
                break;
            case 'relatorios':
                conteudo = `<h2>Relatórios</h2><p>Em breve...</p>`;
                break;
            case 'feedbacks':
                conteudo = `<h2>Feedbacks</h2><p>Em breve...</p>`;
                break;
            case 'configuracoes':
                conteudo = `
                    <h2>Configurações</h2>
                    <p>Aqui você pode definir políticas e termos.</p>
                    <button class="accordion-header" aria-expanded="false">
                      <span>Dados da Empresa</span>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="accordion-content" hidden>
                      <form id="dadosEmpresaVisual" class="responsive-form" style="margin-bottom:1rem;">
                        <label>Nome Fantasia</label>
                        <span id="nomeFantasia"></span>
                        <label>CNPJ</label>
                        <span id="cnpj"></span>
                        <label>CEP</label>
                        <span id="cep"></span>
                        <label>Rua</label>
                        <span id="rua"></span>
                        <label>Número</label>
                        <span id="numero"></span>
                        <label>Complemento</label>
                        <span id="complemento"></span>
                        <label>Bairro</label>
                        <span id="bairro"></span>
                        <label>UF</label>
                        <span id="uf"></span>
                        <label>Cidade</label>
                        <span id="cidade"></span>
                      </form>
                      <div>
                        <button id="editarEmpresa" class="btn btn-primary">Editar</button>
                        <button id="excluirEmpresa" class="btn btn-danger">Excluir Conta</button>
                      </div>
                    </div>
                    <button class="accordion-header" aria-expanded="false">
                      <span>Instituições Cadastradas</span>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="accordion-content" hidden>
                      <form id="formInstituicao" class="responsive-form">
                        <label>Nome Fantasia</label>
                        <input type="text" id="nomeFantasiaInstituicao" placeholder="Nome Fantasia" required>
                        <label>CNPJ</label>
                        <input type="text" id="cnpjInstituicao" placeholder="CNPJ" required>
                        <label>CEP</label>
                        <input type="text" id="cepInstituicao" placeholder="CEP" required>
                        <label>Rua</label>
                        <input type="text" id="ruaInstituicao" placeholder="Rua" required>
                        <label>Número</label>
                        <input type="text" id="numeroInstituicao" placeholder="Número" required>
                        <label>Complemento</label>
                        <input type="text" id="complementoInstituicao" placeholder="Complemento">
                        <label>Bairro</label>
                        <input type="text" id="bairroInstituicao" placeholder="Bairro" required>
                        <label>UF</label>
                        <input type="text" id="ufInstituicao" placeholder="UF" required>
                        <label>Cidade</label>
                        <input type="text" id="cidadeInstituicao" placeholder="Cidade" required>
                        <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Adicionar Instituição</button>
                      </form>
                      <div class="table-responsive">
                        <table class="tabela-instituicoes">
                          <thead>
                            <tr>
                              <th>Nome Fantasia</th>
                              <th>CNPJ</th>
                              <th>CEP</th>
                              <th>Rua</th>
                              <th>Número</th>
                              <th>Bairro</th>
                              <th>UF</th>
                              <th>Cidade</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <button class="accordion-header" aria-expanded="false">
                      <span>Empresas Cadastradas</span>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="accordion-content" hidden>
                      <form id="formEmpresa" class="responsive-form">
                        <label>Nome Fantasia</label>
                        <input type="text" id="nomeFantasiaEmpresa" placeholder="Nome Fantasia" required>
                        <label>CNPJ</label>
                        <input type="text" id="cnpjEmpresa" placeholder="CNPJ" required>
                        <label>CEP</label>
                        <input type="text" id="cepEmpresa" placeholder="CEP" required>
                        <label>Rua</label>
                        <input type="text" id="ruaEmpresa" placeholder="Rua" required>
                        <label>Número</label>
                        <input type="text" id="numeroEmpresa" placeholder="Número" required>
                        <label>Complemento</label>
                        <input type="text" id="complementoEmpresa" placeholder="Complemento">
                        <label>Bairro</label>
                        <input type="text" id="bairroEmpresa" placeholder="Bairro" required>
                        <label>UF</label>
                        <input type="text" id="ufEmpresa" placeholder="UF" required>
                        <label>Cidade</label>
                        <input type="text" id="cidadeEmpresa" placeholder="Cidade" required>
                        <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Adicionar Empresa</button>
                      </form>
                      <div class="table-responsive">
                        <table class="tabela-empresas">
                          <thead>
                            <tr>
                              <th>Nome Fantasia</th>
                              <th>CNPJ</th>
                              <th>CEP</th>
                              <th>Rua</th>
                              <th>Número</th>
                              <th>Bairro</th>
                              <th>UF</th>
                              <th>Cidade</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                `;
                break;
            case 'sair':
                window.location.href = '../index.html';
                break;
            default:
                conteudo = `<h2>Selecione uma aba para começar</h2>`;
        }

        conteudoAba.innerHTML = conteudo;
        this.initAccordions();

        if (window.innerWidth <= 768) {
            document.querySelector('.nav-lateral').classList.remove('active');
        }

        // Se a aba for "usuarios", inicializa os filtros e renderiza as tabelas filtradas
        if (aba === 'usuarios') {
            const gerarLink = document.getElementById('gerarLink');
            if (gerarLink) {
                gerarLink.addEventListener('click', () =>
                    this.gerarLinkCadastro()
                );
            }
            this.inicializarFiltrosUsuarios();
            this.carregarAlunos();
            this.carregarFuncionarios();
        }
        if (aba === 'configuracoes') {
            // (Chamadas inalteradas)
            this.carregarDadosEmpresa();
            this.carregarInstituicoes();
            this.carregarEmpresas();
            const editarEmpresa = document.getElementById('editarEmpresa');
            if (editarEmpresa) {
                editarEmpresa.addEventListener('click', () =>
                    this.habilitarEdicaoEmpresa()
                );
            }
            const excluirEmpresa = document.getElementById('excluirEmpresa');
            if (excluirEmpresa) {
                excluirEmpresa.addEventListener('click', () =>
                    this.abrirModalExclusao()
                );
            }
            const formInstituicao = document.getElementById('formInstituicao');
            if (formInstituicao) {
                formInstituicao.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.cadastrarInstituicao();
                });
            }
            const formEmpresa = document.getElementById('formEmpresa');
            if (formEmpresa) {
                formEmpresa.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.cadastrarEmpresa();
                });
            }
        }
        if (aba === 'veiculos') {
            const empresaAtiva = JSON.parse(
                localStorage.getItem('empresaAtiva')
            );
            if (!empresaAtiva.veiculos) {
                empresaAtiva.veiculos = [];
                this.salvarEmpresaAtiva(empresaAtiva);
            }
            this.initVeiculosEvents();
            this.carregarVeiculos();
        }
        if (aba === 'motoristas') {
            this.initMotoristasEvents();
            this.carregarMotoristas();
        }
        if (aba === 'financeiro') {
            this.carregarFinanceiro();
        }
    }

    initAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach((header) => {
            header.addEventListener('click', () => {
                const expanded =
                    header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !expanded);
                const content = header.nextElementSibling;
                content.hidden = expanded;
            });
        });
    }

    // Método para inicializar os filtros na aba de usuários
    inicializarFiltrosUsuarios() {
        const filtroNome = document.getElementById('filtroNome');
        const filtroTipo = document.getElementById('filtroTipo');
        const filtroFinanceiro = document.getElementById('filtroFinanceiro');
        const filtroMotoristaUsuarios = document.getElementById(
            'filtroMotoristaUsuarios'
        );
        const filtroFrotaUsuarios = document.getElementById(
            'filtroFrotaUsuarios'
        );
        const filtroFaculdade = document.getElementById('filtroFaculdade');
        const filtroEmpresa = document.getElementById('filtroEmpresa');

        // Adiciona listeners para disparar os filtros
        [
            filtroNome,
            filtroTipo,
            filtroFinanceiro,
            filtroMotoristaUsuarios,
            filtroFrotaUsuarios,
            filtroFaculdade,
            filtroEmpresa,
        ].forEach((el) => {
            if (el) {
                el.addEventListener('input', () => {
                    this.carregarAlunos();
                    this.carregarFuncionarios();
                });
                el.addEventListener('change', () => {
                    this.carregarAlunos();
                    this.carregarFuncionarios();
                });
            }
        });

        // Preenche dropdown de Motorista (somente motoristas com alguma associação)
        const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        const optionsMotorista = [
            ...new Set(
                motoristas
                    .filter((m) => m.associados && m.associados.length > 0)
                    .map((m) => ({ id: m.id, nome: m.nomeCompleto }))
            ),
        ];
        optionsMotorista.forEach((m) => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nome;
            filtroMotoristaUsuarios.appendChild(option);
        });

        // Preenche dropdown de Frota (somente para veículos de Fretamento com associação)
        const empresaAtiva =
            JSON.parse(localStorage.getItem('empresaAtiva')) || {};
        const veiculos = empresaAtiva.veiculos || [];
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const fleetSet = new Set();
        alunos.forEach((a) => {
            if (a.frota) fleetSet.add(a.frota);
        });
        funcionarios.forEach((f) => {
            if (f.frota) fleetSet.add(f.frota);
        });
        const optionsFrota = veiculos.filter(
            (v) => v.uso === 'Fretamento' && fleetSet.has(v.frotaNumero)
        );
        optionsFrota.forEach((v) => {
            const option = document.createElement('option');
            option.value = v.frotaNumero;
            option.textContent = `${v.frotaNumero} - ${v.modelo}`;
            filtroFrotaUsuarios.appendChild(option);
        });

        // Preenche dropdown de Faculdade (dos alunos)
        const facSet = new Set(alunos.map((a) => a.faculdade).filter(Boolean));
        facSet.forEach((fac) => {
            const option = document.createElement('option');
            option.value = fac;
            option.textContent = fac;
            filtroFaculdade.appendChild(option);
        });

        // Preenche dropdown de Empresa (dos funcionários)
        const empSet = new Set(
            funcionarios.map((f) => f.empresa).filter(Boolean)
        );
        empSet.forEach((emp) => {
            const option = document.createElement('option');
            option.value = emp;
            option.textContent = emp;
            filtroEmpresa.appendChild(option);
        });
    }

    // FUNÇÕES PARA A ABA DE USUÁRIOS – Alunos
    carregarAlunos() {
        let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const filtroNome = document.getElementById('filtroNome')
            ? document.getElementById('filtroNome').value.trim().toLowerCase()
            : '';
        const filtroTipo = document.getElementById('filtroTipo')
            ? document.getElementById('filtroTipo').value
            : 'todos';
        const filtroFinanceiro = document.getElementById('filtroFinanceiro')
            ? document.getElementById('filtroFinanceiro').value
            : 'todos';
        const filtroMotorista = document.getElementById(
            'filtroMotoristaUsuarios'
        )
            ? document.getElementById('filtroMotoristaUsuarios').value
            : '';
        const filtroFaculdade = document.getElementById('filtroFaculdade')
            ? document.getElementById('filtroFaculdade').value
            : '';
        const filtroFrota = document.getElementById('filtroFrotaUsuarios')
            ? document.getElementById('filtroFrotaUsuarios').value
            : '';

        // Se o filtro de tipo for "funcionario", não exibe alunos
        if (filtroTipo === 'funcionario') {
            alunos = [];
        }

        alunos = alunos.filter((aluno) => {
            let include = true;
            if (
                filtroNome &&
                !aluno.nomeCompleto.toLowerCase().includes(filtroNome)
            ) {
                include = false;
            }
            if (filtroFinanceiro === 'atraso') {
                const summary = this.getFinancialSummary(aluno).toLowerCase();
                if (!summary.includes('em atraso')) include = false;
            }
            if (filtroFinanceiro === 'pendente') {
                const summary = this.getFinancialSummary(aluno).toLowerCase();
                if (!summary.includes('pendente')) include = false;
            }
            if (filtroMotorista && aluno.motoristaId !== filtroMotorista) {
                include = false;
            }
            if (filtroFrota && aluno.frota !== filtroFrota) {
                include = false;
            }
            if (filtroFaculdade && aluno.faculdade !== filtroFaculdade) {
                include = false;
            }
            return include;
        });

        const tabelaAlunos = document.querySelector('#tabelaAlunos tbody');
        if (!tabelaAlunos) return;
        tabelaAlunos.innerHTML = '';
        alunos.forEach((aluno) => {
            const row = tabelaAlunos.insertRow();
            row.insertCell(0).textContent = aluno.nomeCompleto || 'N/A';
            row.insertCell(1).textContent = aluno.faculdade || 'N/A';
            row.insertCell(2).textContent = aluno.email || 'N/A';
            row.insertCell(3).textContent = aluno.telefone || 'N/A';
            const cellMotorista = row.insertCell(4);
            cellMotorista.textContent = aluno.motorista || '-';
            const cellFinanceiro = row.insertCell(5);
            cellFinanceiro.textContent = this.getFinancialSummary(aluno);
            const cellAcoes = row.insertCell(6);
            // Apenas botão Excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirAluno(aluno.id);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    excluirAluno(id) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            alunos = alunos.filter((aluno) => aluno.id !== id);
            localStorage.setItem('alunos', JSON.stringify(alunos));
            this.carregarAlunos();
        }
    }

    // FUNÇÕES PARA A ABA DE USUÁRIOS – Funcionários
    carregarFuncionarios() {
        let funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const filtroNome = document.getElementById('filtroNome')
            ? document.getElementById('filtroNome').value.trim().toLowerCase()
            : '';
        const filtroTipo = document.getElementById('filtroTipo')
            ? document.getElementById('filtroTipo').value
            : 'todos';
        const filtroFinanceiro = document.getElementById('filtroFinanceiro')
            ? document.getElementById('filtroFinanceiro').value
            : 'todos';
        const filtroMotorista = document.getElementById(
            'filtroMotoristaUsuarios'
        )
            ? document.getElementById('filtroMotoristaUsuarios').value
            : '';
        const filtroEmpresa = document.getElementById('filtroEmpresa')
            ? document.getElementById('filtroEmpresa').value
            : '';
        const filtroFrota = document.getElementById('filtroFrotaUsuarios')
            ? document.getElementById('filtroFrotaUsuarios').value
            : '';

        // Se o filtro de tipo for "aluno", não exibe funcionários
        if (filtroTipo === 'aluno') {
            funcionarios = [];
        }

        funcionarios = funcionarios.filter((funcionario) => {
            let include = true;
            if (
                filtroNome &&
                !funcionario.nomeCompleto.toLowerCase().includes(filtroNome)
            ) {
                include = false;
            }
            if (filtroFinanceiro === 'atraso') {
                const summary =
                    this.getFinancialSummary(funcionario).toLowerCase();
                if (!summary.includes('em atraso')) include = false;
            }
            if (filtroFinanceiro === 'pendente') {
                const summary =
                    this.getFinancialSummary(funcionario).toLowerCase();
                if (!summary.includes('pendente')) include = false;
            }
            if (
                filtroMotorista &&
                funcionario.motoristaId !== filtroMotorista
            ) {
                include = false;
            }
            if (filtroEmpresa && funcionario.empresa !== filtroEmpresa) {
                include = false;
            }
            if (filtroFrota && funcionario.frota !== filtroFrota) {
                include = false;
            }
            return include;
        });

        const tabelaFuncionarios = document.querySelector(
            '#tabelaFuncionarios tbody'
        );
        if (!tabelaFuncionarios) return;
        tabelaFuncionarios.innerHTML = '';
        funcionarios.forEach((funcionario) => {
            const row = tabelaFuncionarios.insertRow();
            row.insertCell(0).textContent = funcionario.nomeCompleto || 'N/A';
            row.insertCell(1).textContent = funcionario.empresa || 'N/A';
            row.insertCell(2).textContent = funcionario.email || 'N/A';
            row.insertCell(3).textContent = funcionario.telefone || 'N/A';
            const cellMotorista = row.insertCell(4);
            cellMotorista.textContent = funcionario.motorista || '-';
            const cellFinanceiro = row.insertCell(5);
            cellFinanceiro.textContent = this.getFinancialSummary(funcionario);
            const cellAcoes = row.insertCell(6);
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirFuncionario(funcionario.id);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    excluirFuncionario(id) {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            let funcionarios =
                JSON.parse(localStorage.getItem('funcionarios')) || [];
            funcionarios = funcionarios.filter(
                (funcionario) => funcionario.id !== id
            );
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            this.carregarFuncionarios();
        }
    }

    // ---------------------------- GESTÃO DE MOTORISTAS ----------------------------

    initMotoristasEvents() {
        const form = document.getElementById('formCadastroMotorista');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.cadastrarMotorista();
            });
        }
    }

    cadastrarMotorista() {
        const nomeCompleto = document.getElementById('driverNome').value.trim();
        const cnh = document.getElementById('driverCnh').value.trim();
        const categoria = document
            .getElementById('driverCategoria')
            .value.trim();
        const expedicao = document.getElementById('driverExpedicao').value;
        const validade = document.getElementById('driverValidade').value;

        if (!nomeCompleto || !cnh || !categoria || !expedicao || !validade) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        const id = Date.now().toString();
        const linkBase = window.location.origin;
        const linkCadastro = `${linkBase}/pages/cadastro-motorista.html?driverId=${id}&nome=${encodeURIComponent(
            nomeCompleto
        )}&cnh=${encodeURIComponent(cnh)}&categoria=${encodeURIComponent(
            categoria
        )}&expedicao=${expedicao}&validade=${validade}`;

        const motorista = {
            id,
            nomeCompleto,
            cnh,
            categoria,
            expedicao,
            validade,
            status: 'pendente',
            link: linkCadastro,
            frotaResponsavel: '',
            associados: [],
        };

        let motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        motoristas.push(motorista);
        localStorage.setItem('motoristas', JSON.stringify(motoristas));

        alert('Motorista cadastrado com sucesso!');
        document.getElementById('linkGeradoMotorista').innerHTML = `
          Link de cadastro: <a href="${linkCadastro}" target="_blank">${linkCadastro}</a>
        `;
        document.getElementById('formCadastroMotorista').reset();
        this.carregarMotoristas();
    }

    carregarMotoristas() {
        const tabela = document.querySelector('#tabelaMotoristas tbody');
        if (!tabela) return;
        tabela.innerHTML = '';
        let motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        const hoje = new Date().toISOString().split('T')[0];

        motoristas.forEach((m, index) => {
            const row = tabela.insertRow();
            const cellNome = row.insertCell(0);
            cellNome.textContent = m.nomeCompleto || 'Sem nome';
            cellNome.style.cursor = 'pointer';
            cellNome.style.color = '#2575fc';
            cellNome.style.textDecoration = 'underline';
            cellNome.addEventListener('click', () =>
                this.exibirDetalhesMotorista(index)
            );
            row.insertCell(1).textContent = m.cnh;
            row.insertCell(2).textContent = m.categoria;
            row.insertCell(3).textContent =
                m.validade < hoje ? 'Vencido' : 'Válido';
            row.insertCell(4).textContent = m.status;

            // Frota Responsável
            const cellFrota = row.insertCell(5);
            const selectFrota = document.createElement('select');
            selectFrota.innerHTML = `<option value="">Selecione...</option>`;
            const empresaAtiva =
                JSON.parse(localStorage.getItem('empresaAtiva')) || {};
            const veiculos = empresaAtiva.veiculos || [];
            veiculos.forEach((v) => {
                const option = document.createElement('option');
                option.value = v.frotaNumero;
                option.textContent = `${v.frotaNumero} - ${v.modelo}`;
                if (m.frotaResponsavel === v.frotaNumero) {
                    option.selected = true;
                }
                selectFrota.appendChild(option);
            });
            selectFrota.addEventListener('change', () => {
                m.frotaResponsavel = selectFrota.value;
                let motoristasAtualizados =
                    JSON.parse(localStorage.getItem('motoristas')) || [];
                motoristasAtualizados[index] = m;
                localStorage.setItem(
                    'motoristas',
                    JSON.stringify(motoristasAtualizados)
                );
                alert('Frota atribuída com sucesso!');
            });
            cellFrota.appendChild(selectFrota);

            const cellAcoes = row.insertCell(6);
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirMotorista(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    excluirMotorista(index) {
        if (confirm('Tem certeza que deseja excluir este motorista?')) {
            let motoristas =
                JSON.parse(localStorage.getItem('motoristas')) || [];
            motoristas.splice(index, 1);
            localStorage.setItem('motoristas', JSON.stringify(motoristas));
            this.carregarMotoristas();
            alert('Motorista excluído com sucesso!');
            const container = document.getElementById(
                'detalhesMotoristaContainer'
            );
            if (
                container &&
                container.getAttribute('data-motorista-index') == index
            ) {
                container.style.display = 'none';
            }
        }
    }

    exibirDetalhesMotorista(index) {
        let motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        let motorista = motoristas[index];
        if (!motorista.nomeCompleto) {
            const motoristaLogado = JSON.parse(
                localStorage.getItem('motorista')
            );
            if (motoristaLogado && motoristaLogado.id === motorista.id) {
                motorista.nomeCompleto = motoristaLogado.nomeCompleto;
                motoristas[index] = motorista;
                localStorage.setItem('motoristas', JSON.stringify(motoristas));
            }
        }
        const container = document.getElementById('detalhesMotoristaContainer');
        if (!container) return;
        container.style.display = 'block';
        container.setAttribute('data-motorista-index', index);

        const tabButtons = container.querySelectorAll('[data-motorista-tab]');
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-motorista-tab');
                this.renderMotoristaTab(tab, motorista, index);
            });
        });
        const fecharBtn = document.getElementById('fecharDetalhesMotorista');
        if (fecharBtn) {
            fecharBtn.addEventListener('click', () => {
                container.style.display = 'none';
            });
        }
        this.renderMotoristaTab('dados', motorista, index);
    }

    renderMotoristaTab(tab, motorista, index) {
        const container = document.getElementById('motoristaTabsContent');
        if (!container) return;

        let html = '';
        if (tab === 'dados') {
            const apto =
                motorista.validade >= new Date().toISOString().split('T')[0]
                    ? 'Sim'
                    : 'Não';
            html += `<h4>Dados do Motorista</h4>`;
            html += `<p><strong>Nome:</strong> ${
                motorista.nomeCompleto || 'Não informado'
            }</p>`;
            html += `<p><strong>CNH:</strong> ${motorista.cnh}</p>`;
            html += `<p><strong>Categoria:</strong> ${motorista.categoria}</p>`;
            html += `<p><strong>Expedição:</strong> ${this.formatDateBrazilian(
                motorista.expedicao
            )}</p>`;
            html += `<p><strong>Validade:</strong> ${this.formatDateBrazilian(
                motorista.validade
            )}</p>`;
            html += `<p><strong>Apto para Dirigir:</strong> ${apto}</p>`;
            html += `<p><strong>CPF:</strong> ${
                motorista.cpf || 'Não informado'
            }</p>`;
            html += `<p><strong>Data de Nascimento:</strong> ${
                motorista.dataNascimento
                    ? this.formatDateBrazilian(motorista.dataNascimento)
                    : 'Não informado'
            }</p>`;
            html += `<p><strong>E-mail:</strong> ${
                motorista.email || 'Não informado'
            }</p>`;
            html += `<p><strong>Telefone:</strong> ${
                motorista.telefone || 'Não informado'
            }</p>`;
            if (motorista.endereco) {
                html += `<p><strong>Endereço:</strong> ${motorista.endereco.rua}, ${motorista.endereco.numero} - ${motorista.endereco.bairro}, ${motorista.endereco.cidade}/${motorista.endereco.uf} - CEP: ${motorista.endereco.cep}</p>`;
            }
        } else if (tab === 'feedbacks') {
            html += `<h4>Feedbacks</h4><p>Funcionalidade em breve...</p>`;
        } else if (tab === 'rotas') {
            html += `<h4>Rotas, Pontos e Paradas</h4><p>Funcionalidade em breve...</p>`;
        } else if (tab === 'frota') {
            if (!motorista.frotaResponsavel) {
                html += `<h4>Frota Responsável</h4><p>Nenhuma frota associada.</p>`;
            } else {
                const empresaAtiva =
                    JSON.parse(localStorage.getItem('empresaAtiva')) || {};
                const veiculos = empresaAtiva.veiculos || [];
                const frota = veiculos.find(
                    (v) => v.frotaNumero === motorista.frotaResponsavel
                );
                if (!frota) {
                    html += `<h4>Frota Responsável</h4><p>Frota não encontrada.</p>`;
                } else {
                    html += `<h4>Frota Responsável: ${frota.frotaNumero} - ${frota.modelo}</h4>`;
                    html += `<p><strong>Disponibilidade:</strong> ${
                        frota.disponibilidade === 'disponivel'
                            ? 'Disponível'
                            : 'Indisponível'
                    }</p>`;
                    if (frota.agendamentos && frota.agendamentos.length > 0) {
                        html += `<p><strong>Agendamentos:</strong></p><ul>`;
                        frota.agendamentos.forEach((a) => {
                            html += `<li>${
                                a.descricao || 'Sem descrição'
                            } - ${this.formatDateBrazilian(a.data)}</li>`;
                        });
                        html += `</ul>`;
                    } else {
                        html += `<p>Sem agendamentos.</p>`;
                    }
                }
            }
        } else if (tab === 'associados') {
            const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            const funcionarios =
                JSON.parse(localStorage.getItem('funcionarios')) || [];

            // Filtra associados pelo ID do motorista
            const associadosAlunos = alunos.filter(
                (user) => user.motoristaId === motorista.id
            );
            const disponiveisAlunos = alunos.filter(
                (user) => user.motoristaId !== motorista.id
            );

            const associadosFuncionarios = funcionarios.filter(
                (user) => user.motoristaId === motorista.id
            );
            const disponiveisFuncionarios = funcionarios.filter(
                (user) => user.motoristaId !== motorista.id
            );

            html += `
                <div style="display: flex; gap: 2rem;">
                    <div style="flex: 1;">
                      <h4>Alunos Disponíveis</h4>
                      <div id="alunosDisponiveis">`;
            disponiveisAlunos.forEach((user) => {
                html += `<div><input type="checkbox" class="chkAluno" value="${user.id}"> ${user.nomeCompleto}</div>`;
            });
            html += `</div>
                    </div>
                    <div style="flex: 1;">
                      <h4>Alunos Associados</h4>
                      <div id="alunosAssociados">`;
            associadosAlunos.forEach((user) => {
                html += `<div><input type="checkbox" class="chkAlunoAssociado" value="${user.id}"> ${user.nomeCompleto}</div>`;
            });
            html += `</div>
                    </div>
                </div>
                <button id="btnAdicionarAlunos" class="btn btn-primary" style="margin-top:1rem;">Adicionar Selecionados (Alunos)</button>
                <button id="btnRemoverAlunos" class="btn btn-secondary" style="margin-top:1rem;">Remover Selecionados (Alunos)</button>
                <hr>
                <div style="display: flex; gap: 2rem;">
                    <div style="flex: 1;">
                      <h4>Funcionários Disponíveis</h4>
                      <div id="funcDisponiveis">`;
            disponiveisFuncionarios.forEach((user) => {
                html += `<div><input type="checkbox" class="chkFunc" value="${user.id}"> ${user.nomeCompleto}</div>`;
            });
            html += `</div>
                    </div>
                    <div style="flex: 1;">
                      <h4>Funcionários Associados</h4>
                      <div id="funcAssociados">`;
            associadosFuncionarios.forEach((user) => {
                html += `<div><input type="checkbox" class="chkFuncAssociado" value="${user.id}"> ${user.nomeCompleto}</div>`;
            });
            html += `</div>
                    </div>
                </div>
                <button id="btnAdicionarFunc" class="btn btn-primary" style="margin-top:1rem;">Adicionar Selecionados (Funcionários)</button>
                <button id="btnRemoverFunc" class="btn btn-secondary" style="margin-top:1rem;">Remover Selecionados (Funcionários)</button>
                <br><br>
                <button id="salvarAssociados" class="btn btn-success" style="margin-top:1rem;">Salvar Associados</button>
            `;
        }

        container.innerHTML = html;

        // Eventos da aba "associados"
        if (tab === 'associados') {
            document
                .getElementById('btnAdicionarAlunos')
                .addEventListener('click', () => {
                    const disponiveis = document.querySelectorAll(
                        '#alunosDisponiveis .chkAluno:checked'
                    );
                    disponiveis.forEach((chk) => {
                        const div = chk.parentElement;
                        chk.checked = false;
                        const clone = div.cloneNode(true);
                        clone.querySelector('input').className =
                            'chkAlunoAssociado';
                        document
                            .getElementById('alunosAssociados')
                            .appendChild(clone);
                        div.remove();
                    });
                });
            document
                .getElementById('btnRemoverAlunos')
                .addEventListener('click', () => {
                    const associados = document.querySelectorAll(
                        '#alunosAssociados .chkAlunoAssociado:checked'
                    );
                    associados.forEach((chk) => {
                        const div = chk.parentElement;
                        chk.checked = false;
                        const clone = div.cloneNode(true);
                        clone.querySelector('input').className = 'chkAluno';
                        document
                            .getElementById('alunosDisponiveis')
                            .appendChild(clone);
                        div.remove();
                    });
                });
            document
                .getElementById('btnAdicionarFunc')
                .addEventListener('click', () => {
                    const disponiveis = document.querySelectorAll(
                        '#funcDisponiveis .chkFunc:checked'
                    );
                    disponiveis.forEach((chk) => {
                        const div = chk.parentElement;
                        chk.checked = false;
                        const clone = div.cloneNode(true);
                        clone.querySelector('input').className =
                            'chkFuncAssociado';
                        document
                            .getElementById('funcAssociados')
                            .appendChild(clone);
                        div.remove();
                    });
                });
            document
                .getElementById('btnRemoverFunc')
                .addEventListener('click', () => {
                    const associados = document.querySelectorAll(
                        '#funcAssociados .chkFuncAssociado:checked'
                    );
                    associados.forEach((chk) => {
                        const div = chk.parentElement;
                        chk.checked = false;
                        const clone = div.cloneNode(true);
                        clone.querySelector('input').className = 'chkFunc';
                        document
                            .getElementById('funcDisponiveis')
                            .appendChild(clone);
                        div.remove();
                    });
                });

            document
                .getElementById('salvarAssociados')
                .addEventListener('click', () => {
                    // Pegar todos os IDs dos associados
                    let idsAssociados = [];
                    document
                        .querySelectorAll(
                            '#alunosAssociados .chkAlunoAssociado'
                        )
                        .forEach((chk) => {
                            idsAssociados.push(chk.value);
                        });
                    document
                        .querySelectorAll('#funcAssociados .chkFuncAssociado')
                        .forEach((chk) => {
                            idsAssociados.push(chk.value);
                        });

                    // Atualiza em localStorage: adiciona/remover o "motoristaId" e nomeMotorista
                    this.atualizarAssociacaoUsuarios(idsAssociados, motorista);

                    alert('Usuários associados atualizados!');

                    // Recarrega lista de alunos/funcionários (exibe Motorista na aba "Usuários")
                    this.carregarAlunos();
                    this.carregarFuncionarios();

                    // Atualiza painel financeiro
                    this.renderFinanceiroList();

                    // Recarrega a própria aba 'associados' com dados atualizados de localStorage
                    let updatedMotoristas =
                        JSON.parse(localStorage.getItem('motoristas')) || [];
                    let updatedMotorista = updatedMotoristas.find(
                        (m) => m.id === motorista.id
                    );
                    this.renderMotoristaTab(
                        'associados',
                        updatedMotorista,
                        index
                    );
                });
        }
    }

    /**
     * Agora associamos pelo ID do motorista, de modo que o usuário só perde
     * a associação se .motoristaId === aquele id.
     */
    atualizarAssociacaoUsuarios(associadosIds, motorista) {
        let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        alunos = alunos.map((aluno) => {
            // Se o aluno está na lista de associados:
            if (associadosIds.includes(aluno.id)) {
                // Define o motoristaId, o nome do motorista e a frota:
                aluno.motoristaId = motorista.id;
                aluno.motorista = motorista.nomeCompleto;
                aluno.frota = motorista.frotaResponsavel;
            } else {
                // Se ele já tinha esse motorista e saiu dos selecionados, removemos
                if (aluno.motoristaId === motorista.id) {
                    delete aluno.motoristaId;
                    delete aluno.motorista;
                    delete aluno.frota;
                }
            }
            return aluno;
        });
        localStorage.setItem('alunos', JSON.stringify(alunos));

        let funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        funcionarios = funcionarios.map((func) => {
            if (associadosIds.includes(func.id)) {
                func.motoristaId = motorista.id;
                func.motorista = motorista.nomeCompleto;
                func.frota = motorista.frotaResponsavel;
            } else {
                if (func.motoristaId === motorista.id) {
                    delete func.motoristaId;
                    delete func.motorista;
                    delete func.frota;
                }
            }
            return func;
        });
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

        // Por fim, atualiza o array de motoristas, substituindo 'm.associados' pela nova lista
        let motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        motoristas = motoristas.map((m) => {
            if (m.id === motorista.id) {
                m.associados = associadosIds;
            }
            return m;
        });
        localStorage.setItem('motoristas', JSON.stringify(motoristas));
    }

    gerarLinkCadastro() {
        const tipoCadastro = document.getElementById('tipoCadastro').value;
        const linkBase = window.location.origin;
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const nomeFantasia = empresaAtiva.nomeFantasia;
        const linkCadastro = `${linkBase}/pages/cadastro-${tipoCadastro}.html?empresa=${encodeURIComponent(
            nomeFantasia
        )}`;
        document.getElementById(
            'linkGerado'
        ).innerHTML = `Link de cadastro: <a href="${linkCadastro}" target="_blank">${linkCadastro}</a>`;
    }

    // ---------------------------- GESTÃO DE VEÍCULOS ----------------------------

    initVeiculosEvents() {
        const btnNovoVeiculo = document.getElementById('btnNovoVeiculo');
        const formCadastroVeiculo = document.getElementById(
            'formCadastroVeiculo'
        );
        if (btnNovoVeiculo && formCadastroVeiculo) {
            btnNovoVeiculo.addEventListener('click', () => {
                formCadastroVeiculo.style.display =
                    formCadastroVeiculo.style.display === 'none'
                        ? 'block'
                        : 'none';
            });
        }
        const financiamentoStatus = document.getElementById(
            'financiamentoStatus'
        );
        const financiadoCampos = document.getElementById('financiadoCampos');
        if (financiamentoStatus && financiadoCampos) {
            financiamentoStatus.addEventListener('change', () => {
                if (financiamentoStatus.value === 'Financiado') {
                    financiadoCampos.style.display = 'block';
                } else {
                    financiadoCampos.style.display = 'none';
                }
            });
        }
        const formVeiculo = document.getElementById('formVeiculo');
        if (formVeiculo) {
            formVeiculo.addEventListener('submit', (e) => {
                e.preventDefault();
                this.cadastrarVeiculo();
            });
        }
    }

    cadastrarVeiculo() {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const frotaNumero = document.getElementById('frotaNumero').value.trim();
        const placa = document.getElementById('placaVeiculo').value.trim();
        const renavam = document.getElementById('renavamVeiculo').value.trim();
        const ano = document.getElementById('anoVeiculo').value.trim();
        const modelo = document.getElementById('modeloVeiculo').value.trim();
        const combustivel = document
            .getElementById('combustivelVeiculo')
            .value.trim();
        const assentos = document
            .getElementById('assentosVeiculo')
            .value.trim();
        const uso = document.getElementById('usoVeiculo').value;
        const financiamentoSt = document.getElementById(
            'financiamentoStatus'
        ).value;

        if (
            !frotaNumero ||
            !placa ||
            !renavam ||
            !ano ||
            !modelo ||
            !combustivel ||
            !assentos ||
            !uso ||
            !financiamentoSt
        ) {
            alert('Preencha todos os campos obrigatórios do veículo.');
            return;
        }

        let parcelasTotais = null;
        let parcelasRestantes = null;
        let dataVencimentoFinanciamento = null;
        if (financiamentoSt === 'Financiado') {
            parcelasTotais = document
                .getElementById('parcelasTotais')
                .value.trim();
            parcelasRestantes = document
                .getElementById('parcelasRestantes')
                .value.trim();
            dataVencimentoFinanciamento = document.getElementById(
                'dataVencimentoFinanciamento'
            ).value;
            if (
                !parcelasTotais ||
                !parcelasRestantes ||
                !dataVencimentoFinanciamento
            ) {
                alert('Preencha os campos de financiamento.');
                return;
            }
        }

        const novoVeiculo = {
            frotaNumero,
            placa,
            renavam,
            ano,
            modelo,
            combustivel,
            assentos: parseInt(assentos, 10),
            uso,
            financiamentoStatus: financiamentoSt,
            parcelasTotais: parcelasTotais ? parseInt(parcelasTotais, 10) : 0,
            parcelasRestantes: parcelasRestantes
                ? parseInt(parcelasRestantes, 10)
                : 0,
            dataVencimentoFinanciamento: dataVencimentoFinanciamento || null,
            disponibilidade: 'disponivel',
            motivoIndisponibilidade: '',
            manutencao: {
                kmAtual: 0,
                ultimaTrocaOleoData: null,
                ultimaTrocaOleoKm: 0,
                proximaTrocaOleoData: null,
                proximaTrocaOleoKm: 0,
                pneus: {
                    estadoPneu: 'otimo',
                    kmTrocaPneu: 0,
                    limitePneu: 0,
                },
                outrasManutencoes: [],
            },
            agendamentos: [],
        };

        empresaAtiva.veiculos = empresaAtiva.veiculos || [];
        empresaAtiva.veiculos.push(novoVeiculo);
        this.salvarEmpresaAtiva(empresaAtiva);
        document.getElementById('formVeiculo').reset();
        document.getElementById('financiadoCampos').style.display = 'none';
        this.carregarVeiculos();
        alert('Veículo cadastrado com sucesso!');
    }

    carregarVeiculos() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva || !empresaAtiva.veiculos) return;
        const tabelaVeiculos = document
            .getElementById('tabelaVeiculos')
            ?.querySelector('tbody');
        if (!tabelaVeiculos) return;
        tabelaVeiculos.innerHTML = '';

        empresaAtiva.veiculos.forEach((veiculo, index) => {
            const row = tabelaVeiculos.insertRow();
            const cellFrota = row.insertCell(0);
            cellFrota.textContent = veiculo.frotaNumero;
            cellFrota.style.cursor = 'pointer';
            cellFrota.style.color = '#2575fc';
            cellFrota.style.textDecoration = 'underline';
            cellFrota.addEventListener('click', () =>
                this.exibirDetalhesVeiculo(index)
            );

            let finStatus = 'Quitado';
            if (veiculo.financiamentoStatus === 'Financiado') {
                if (veiculo.dataVencimentoFinanciamento) {
                    finStatus = `Vence em: ${this.formatDateBrazilian(
                        veiculo.dataVencimentoFinanciamento
                    )}`;
                } else {
                    finStatus = 'Financiado';
                }
            }
            row.insertCell(1).textContent = finStatus;

            let disp =
                veiculo.disponibilidade === 'disponivel'
                    ? 'Disponível'
                    : 'Indisponível';
            row.insertCell(2).textContent = disp;

            const cellAcoes = row.insertCell(3);
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirVeiculo(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    excluirVeiculo(index) {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
            if (!empresaAtiva || !empresaAtiva.veiculos) return;
            empresaAtiva.veiculos.splice(index, 1);
            this.salvarEmpresaAtiva(empresaAtiva);
            this.carregarVeiculos();
            alert('Veículo excluído com sucesso!');
        }
    }

    exibirDetalhesVeiculo(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva || !empresaAtiva.veiculos) return;
        const veiculo = empresaAtiva.veiculos[index];
        const container = document.getElementById('detalhesVeiculoContainer');
        if (!container) return;
        container.style.display = 'block';
        container.setAttribute('data-veiculo-index', index);
        const tabButtons = container.querySelectorAll('[data-veiculo-tab]');
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-veiculo-tab');
                this.renderVeiculoTabs(tab, index);
            });
        });
        this.renderVeiculoTabs('dados', index);
    }

    renderVeiculoTabs(tab, index) {
        const contentDiv = document.getElementById('veiculoTabsContent');
        if (!contentDiv) return;
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        this.verificarDisponibilidadeAutomatica(veiculo);
        this.salvarEmpresaAtiva(empresaAtiva);

        switch (tab) {
            case 'dados':
                contentDiv.innerHTML = this.renderVeiculoDadosHTML(
                    veiculo,
                    index
                );
                const btnEditar = document.getElementById(
                    'btnEditarDadosVeiculo'
                );
                if (btnEditar) {
                    btnEditar.addEventListener('click', () =>
                        this.habilitarEdicaoDadosVeiculo(index)
                    );
                }
                const btnExcluir = document.getElementById(
                    'btnExcluirVeiculoCompleto'
                );
                if (btnExcluir) {
                    btnExcluir.addEventListener('click', () =>
                        this.excluirVeiculo(index)
                    );
                }
                const btnPagarParcela =
                    document.getElementById('btnPagarParcela');
                if (btnPagarParcela) {
                    btnPagarParcela.addEventListener('click', () =>
                        this.pagarParcelaFinanciamento(index)
                    );
                }
                break;
            case 'manutencao':
                contentDiv.innerHTML = this.renderVeiculoManutencaoHTML(
                    veiculo,
                    index
                );
                this.initManutencaoEvents(index);
                break;
            case 'agendamento':
                contentDiv.innerHTML = this.renderVeiculoAgendamentoHTML(
                    veiculo,
                    index
                );
                this.initAgendamentoEvents(index);
                break;
            case 'fretamento':
                contentDiv.innerHTML = `<h3>Fretamento</h3><p>Em breve...</p>`;
                break;
            default:
                contentDiv.innerHTML = `<p>Selecione uma aba.</p>`;
        }
    }

    pagarParcelaFinanciamento(index) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        if (veiculo.financiamentoStatus !== 'Financiado') {
            alert('Este veículo não está financiado.');
            return;
        }
        if (veiculo.parcelasRestantes <= 0) {
            alert('Veículo já quitado ou não possui parcelas restantes.');
            return;
        }
        veiculo.parcelasRestantes--;
        if (veiculo.parcelasRestantes <= 0) {
            veiculo.financiamentoStatus = 'Quitado';
            veiculo.dataVencimentoFinanciamento = null;
            alert('Veículo quitado!');
        } else {
            if (veiculo.dataVencimentoFinanciamento) {
                veiculo.dataVencimentoFinanciamento = this.incrementarMes(
                    veiculo.dataVencimentoFinanciamento
                );
            }
            alert(
                'Parcela paga! Próximo vencimento em ' +
                    this.formatDateBrazilian(
                        veiculo.dataVencimentoFinanciamento
                    )
            );
        }
        this.salvarEmpresaAtiva(empresaAtiva);
        this.renderVeiculoTabs('dados', index);
        this.carregarVeiculos();
    }

    incrementarMes(dataStr) {
        const [year, month, day] = dataStr.split('-');
        const dateObj = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
        );
        dateObj.setMonth(dateObj.getMonth() + 1);
        const newYear = dateObj.getFullYear();
        const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const newDay = String(dateObj.getDate()).padStart(2, '0');
        return `${newYear}-${newMonth}-${newDay}`;
    }

    formatDateBrazilian(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    renderVeiculoDadosHTML(veiculo, index) {
        let finInfo = `<p>Situação: Quitado</p>`;
        if (veiculo.financiamentoStatus === 'Financiado') {
            finInfo = `
                <p>Parcelas Totais: ${veiculo.parcelasTotais}</p>
                <p>Parcelas Restantes: ${veiculo.parcelasRestantes}</p>
                <p>Data Vencimento: ${
                    veiculo.dataVencimentoFinanciamento
                        ? this.formatDateBrazilian(
                              veiculo.dataVencimentoFinanciamento
                          )
                        : 'não informado'
                }</p>
                <button id="btnPagarParcela" class="btn btn-primary">Pagar Parcela</button>
            `;
        }
        return `
            <h3>Dados do Veículo</h3>
            <p><strong>N° Frota:</strong> ${veiculo.frotaNumero}</p>
            <p><strong>Placa:</strong> ${veiculo.placa}</p>
            <p><strong>Renavam:</strong> ${veiculo.renavam}</p>
            <p><strong>Ano:</strong> ${veiculo.ano}</p>
            <p><strong>Modelo:</strong> ${veiculo.modelo}</p>
            <p><strong>Combustível:</strong> ${veiculo.combustivel}</p>
            <p><strong>Assentos:</strong> ${veiculo.assentos}</p>
            <p><strong>Uso:</strong> ${veiculo.uso}</p>
            <p><strong>Financiamento:</strong> ${
                veiculo.financiamentoStatus
            }</p>
            ${finInfo}
            <p><strong>Disponibilidade:</strong> ${
                veiculo.disponibilidade === 'disponivel'
                    ? 'Disponível'
                    : 'Indisponível'
            }</p>
            <p><strong>Motivo Indisponibilidade:</strong> ${
                veiculo.motivoIndisponibilidade || '-'
            }</p>
            <button id="btnEditarDadosVeiculo" class="btn btn-primary">Editar Dados</button>
            <button id="btnExcluirVeiculoCompleto" class="btn btn-danger">Excluir Veículo</button>
        `;
    }

    habilitarEdicaoDadosVeiculo(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        const contentDiv = document.getElementById('veiculoTabsContent');
        contentDiv.innerHTML = `
            <h3>Editar Dados do Veículo</h3>
            <form id="formEdicaoDadosVeiculo" class="responsive-form">
              <label>N° Frota</label>
              <input type="text" id="editFrotaNumero" value="${
                  veiculo.frotaNumero
              }" required />
              <label>Placa</label>
              <input type="text" id="editPlaca" value="${
                  veiculo.placa
              }" required />
              <label>Renavam</label>
              <input type="text" id="editRenavam" value="${
                  veiculo.renavam
              }" required />
              <label>Ano</label>
              <input type="text" id="editAno" value="${veiculo.ano}" required />
              <label>Modelo</label>
              <input type="text" id="editModelo" value="${
                  veiculo.modelo
              }" required />
              <label>Combustível</label>
              <input type="text" id="editCombustivel" value="${
                  veiculo.combustivel
              }" required />
              <label>Assentos</label>
              <input type="number" id="editAssentos" value="${
                  veiculo.assentos
              }" required />
              <label>Uso</label>
              <select id="editUso" required>
                <option value="Empresa" ${
                    veiculo.uso === 'Empresa' ? 'selected' : ''
                }>Empresa</option>
                <option value="Fretamento" ${
                    veiculo.uso === 'Fretamento' ? 'selected' : ''
                }>Fretamento</option>
              </select>
              <label>Financiamento</label>
              <select id="editFinStatus" required>
                <option value="Quitado" ${
                    veiculo.financiamentoStatus === 'Quitado' ? 'selected' : ''
                }>Quitado</option>
                <option value="Financiado" ${
                    veiculo.financiamentoStatus === 'Financiado'
                        ? 'selected'
                        : ''
                }>Financiado</option>
              </select>
              <div id="editFinCampos" style="display: ${
                  veiculo.financiamentoStatus === 'Financiado'
                      ? 'block'
                      : 'none'
              }; margin-bottom: 1rem;">
                <label>Parcelas Totais</label>
                <input type="number" id="editParcelasTotais" value="${
                    veiculo.parcelasTotais || 0
                }" />
                <label>Parcelas Restantes</label>
                <input type="number" id="editParcelasRestantes" value="${
                    veiculo.parcelasRestantes || 0
                }" />
                <label>Data de Vencimento</label>
                <input type="date" id="editDataVencimentoFinanciamento" value="${
                    veiculo.dataVencimentoFinanciamento || ''
                }" />
              </div>
              <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Salvar Alterações</button>
            </form>
        `;
        const editFinStatus = document.getElementById('editFinStatus');
        const editFinCampos = document.getElementById('editFinCampos');
        editFinStatus.addEventListener('change', () => {
            editFinCampos.style.display =
                editFinStatus.value === 'Financiado' ? 'block' : 'none';
        });
        const formEdicao = document.getElementById('formEdicaoDadosVeiculo');
        formEdicao.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarEdicaoDadosVeiculo(index);
        });
    }

    salvarEdicaoDadosVeiculo(index) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        veiculo.frotaNumero = document.getElementById('editFrotaNumero').value;
        veiculo.placa = document.getElementById('editPlaca').value;
        veiculo.renavam = document.getElementById('editRenavam').value;
        veiculo.ano = document.getElementById('editAno').value;
        veiculo.modelo = document.getElementById('editModelo').value;
        veiculo.combustivel = document.getElementById('editCombustivel').value;
        veiculo.assentos = parseInt(
            document.getElementById('editAssentos').value,
            10
        );
        veiculo.uso = document.getElementById('editUso').value;
        veiculo.financiamentoStatus =
            document.getElementById('editFinStatus').value;
        if (veiculo.financiamentoStatus === 'Financiado') {
            veiculo.parcelasTotais = parseInt(
                document.getElementById('editParcelasTotais').value || '0',
                10
            );
            veiculo.parcelasRestantes = parseInt(
                document.getElementById('editParcelasRestantes').value || '0',
                10
            );
            veiculo.dataVencimentoFinanciamento = document.getElementById(
                'editDataVencimentoFinanciamento'
            ).value;
        } else {
            veiculo.parcelasTotais = 0;
            veiculo.parcelasRestantes = 0;
            veiculo.dataVencimentoFinanciamento = null;
        }
        empresaAtiva.veiculos[index] = veiculo;
        this.salvarEmpresaAtiva(empresaAtiva);
        alert('Dados do veículo atualizados!');
        this.renderVeiculoTabs('dados', index);
        this.carregarVeiculos();
    }

    renderVeiculoManutencaoHTML(veiculo, index) {
        const manut = veiculo.manutencao;
        const historicoHTML =
            manut.outrasManutencoes && manut.outrasManutencoes.length > 0
                ? manut.outrasManutencoes
                      .map(
                          (m) =>
                              `<li>${this.formatDateBrazilian(m.data)} - KM: ${
                                  m.km
                              } - ${m.descricao}</li>`
                      )
                      .join('')
                : '<li>Nenhuma manutenção adicional registrada.</li>';
        return `
            <h3>Manutenção do Veículo</h3>
            <div style="margin-bottom:1rem;">
              <button class="btn btn-primary" data-manutencao="disponivel">Disponível</button>
              <button class="btn btn-danger" data-manutencao="indisponivel">Indisponível</button>
            </div>
            <form id="formManutencao" class="responsive-form">
              <label>KM Atual</label>
              <input type="number" id="kmAtual" value="${manut.kmAtual || 0}" />
              <label>Última troca de óleo (Data)</label>
              <input type="date" id="ultimaTrocaOleoData" value="${
                  manut.ultimaTrocaOleoData || ''
              }" />
              <label>Última troca de óleo (KM)</label>
              <input type="number" id="ultimaTrocaOleoKm" value="${
                  manut.ultimaTrocaOleoKm || 0
              }" />
              <label>Próxima troca de óleo (Data)</label>
              <input type="date" id="proximaTrocaOleoData" value="${
                  manut.proximaTrocaOleoData || ''
              }" />
              <label>Próxima troca de óleo (KM)</label>
              <input type="number" id="proximaTrocaOleoKm" value="${
                  manut.proximaTrocaOleoKm || 0
              }" />
              <label>Estado do pneu</label>
              <select id="estadoPneu">
                <option value="otimo" ${
                    manut.pneus.estadoPneu === 'otimo' ? 'selected' : ''
                }>Ótimo</option>
                <option value="bom" ${
                    manut.pneus.estadoPneu === 'bom' ? 'selected' : ''
                }>Bom</option>
                <option value="meia vida" ${
                    manut.pneus.estadoPneu === 'meia vida' ? 'selected' : ''
                }>Meia Vida</option>
                <option value="ruim" ${
                    manut.pneus.estadoPneu === 'ruim' ? 'selected' : ''
                }>Ruim</option>
              </select>
              <label>KM da última troca de pneu</label>
              <input type="number" id="kmTrocaPneu" value="${
                  manut.pneus.kmTrocaPneu || 0
              }" />
              <label>Limite de rodagem (KM) do pneu</label>
              <input type="number" id="limitePneu" value="${
                  manut.pneus.limitePneu || 0
              }" />
              <label>Outra manutenção (descrever)</label>
              <input type="text" id="descricaoOutraManutencao" placeholder="Ex: Troca de pastilhas de freio..." />
              <label>Data da outra manutenção</label>
              <input type="date" id="dataOutraManutencao" />
              <label>KM da outra manutenção</label>
              <input type="number" id="kmOutraManutencao" value="0" />
              <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Salvar Manutenção</button>
            </form>
            <div id="historicoManutencoes" style="margin-top:1rem;">
              <h4>Histórico de Outras Manutenções</h4>
              <ul>
                ${historicoHTML}
              </ul>
            </div>
        `;
    }

    initManutencaoEvents(index) {
        const btnsManutencao = document.querySelectorAll('[data-manutencao]');
        btnsManutencao.forEach((btn) => {
            btn.addEventListener('click', () => {
                const estado = btn.getAttribute('data-manutencao');
                if (estado === 'disponivel') {
                    this.definirDisponibilidade(index, 'disponivel');
                } else {
                    const motivo = prompt('Motivo da indisponibilidade:', '');
                    this.definirDisponibilidade(index, 'indisponivel', motivo);
                }
            });
        });
        const formManutencao = document.getElementById('formManutencao');
        if (formManutencao) {
            formManutencao.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarManutencao(index);
            });
        }
    }

    salvarManutencao(index) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        veiculo.manutencao.kmAtual = parseInt(
            document.getElementById('kmAtual').value || '0',
            10
        );
        veiculo.manutencao.ultimaTrocaOleoData =
            document.getElementById('ultimaTrocaOleoData').value || null;
        veiculo.manutencao.ultimaTrocaOleoKm = parseInt(
            document.getElementById('ultimaTrocaOleoKm').value || '0',
            10
        );
        veiculo.manutencao.proximaTrocaOleoData =
            document.getElementById('proximaTrocaOleoData').value || null;
        veiculo.manutencao.proximaTrocaOleoKm = parseInt(
            document.getElementById('proximaTrocaOleoKm').value || '0',
            10
        );
        veiculo.manutencao.pneus.estadoPneu =
            document.getElementById('estadoPneu').value;
        veiculo.manutencao.pneus.kmTrocaPneu = parseInt(
            document.getElementById('kmTrocaPneu').value || '0',
            10
        );
        veiculo.manutencao.pneus.limitePneu = parseInt(
            document.getElementById('limitePneu').value || '0',
            10
        );
        const descOutra = document
            .getElementById('descricaoOutraManutencao')
            .value.trim();
        const dataOutra = document.getElementById('dataOutraManutencao').value;
        const kmOutra = parseInt(
            document.getElementById('kmOutraManutencao').value || '0',
            10
        );

        if (descOutra && dataOutra) {
            veiculo.manutencao.outrasManutencoes.push({
                descricao: descOutra,
                data: dataOutra,
                km: kmOutra,
            });
        }
        this.verificarDisponibilidadeAutomatica(veiculo);
        empresaAtiva.veiculos[index] = veiculo;
        this.salvarEmpresaAtiva(empresaAtiva);
        alert('Manutenção salva!');
        this.renderVeiculoTabs('manutencao', index);
    }

    definirDisponibilidade(index, estado, motivo = '') {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        veiculo.disponibilidade = estado;
        veiculo.motivoIndisponibilidade =
            estado === 'indisponivel' ? motivo : '';
        empresaAtiva.veiculos[index] = veiculo;
        this.salvarEmpresaAtiva(empresaAtiva);
        this.renderVeiculoTabs('manutencao', index);
        this.carregarVeiculos();
    }

    verificarDisponibilidadeAutomatica(veiculo) {
        const hoje = new Date().toISOString().split('T')[0];
        let disponivel = true;
        let motivos = [];
        const agPendenteHoje = veiculo.agendamentos.some(
            (a) => a.estado === 'pendente' && a.data === hoje
        );
        if (agPendenteHoje) {
            disponivel = false;
            motivos.push('Agendamento em aberto');
        }
        if (
            veiculo.financiamentoStatus === 'Financiado' &&
            veiculo.dataVencimentoFinanciamento
        ) {
            if (veiculo.dataVencimentoFinanciamento < hoje) {
                disponivel = false;
                motivos.push('Financiamento vencido');
            }
        }
        if (veiculo.manutencao.proximaTrocaOleoData) {
            if (veiculo.manutencao.proximaTrocaOleoData < hoje) {
                disponivel = false;
                motivos.push('Óleo vencido (data)');
            }
        }
        if (
            veiculo.manutencao.proximaTrocaOleoKm > 0 &&
            veiculo.manutencao.kmAtual >= veiculo.manutencao.proximaTrocaOleoKm
        ) {
            disponivel = false;
            motivos.push('Óleo vencido (km)');
        }
        if (veiculo.manutencao.pneus.estadoPneu === 'ruim') {
            disponivel = false;
            motivos.push('Pneu ruim');
        }
        if (
            veiculo.manutencao.pneus.limitePneu > 0 &&
            veiculo.manutencao.kmAtual >= veiculo.manutencao.pneus.limitePneu
        ) {
            disponivel = false;
            motivos.push('Limite de rodagem do pneu atingido');
        }
        if (disponivel) {
            veiculo.disponibilidade = 'disponivel';
            veiculo.motivoIndisponibilidade = '';
        } else {
            veiculo.disponibilidade = 'indisponivel';
            veiculo.motivoIndisponibilidade = motivos.join(' / ');
        }
    }

    renderVeiculoAgendamentoHTML(veiculo, index) {
        let agList = '<li>Nenhum agendamento.</li>';
        if (veiculo.agendamentos && veiculo.agendamentos.length > 0) {
            agList = veiculo.agendamentos
                .map((a, i) => {
                    const dataBr = this.formatDateBrazilian(a.data);
                    let infoEstado = a.estado ? `(${a.estado})` : '';
                    let acoes = '';
                    if (a.estado === 'pendente') {
                        acoes = `
                <button class="btn btn-success" data-agendamento-index="${i}" data-action="concluir">Concluir</button>
                <button class="btn btn-danger" data-agendamento-index="${i}" data-action="cancelar">Cancelar</button>
              `;
                    }
                    return `<li>${dataBr} - ${a.tipo} - ${
                        a.descricao || ''
                    } ${infoEstado}<br>${acoes}</li>`;
                })
                .join('');
        }
        return `
        <h3>Agendamento</h3>
        <form id="formAgendamento" class="responsive-form">
          <label>Data do Agendamento</label>
          <input type="date" id="dataAgendamento" required />
          <label>Tipo de Agendamento</label>
          <select id="tipoAgendamento" required>
            <option value="">Selecione...</option>
            <option value="manutencao">Manutenção</option>
            <option value="outro">Outro</option>
          </select>
          <label>Descrição</label>
          <input type="text" id="descricaoAgendamento" placeholder="Ex: troca de óleo" />
          <button type="submit" class="btn btn-primary" style="grid-column: 1 / -1;">Salvar Agendamento</button>
        </form>
        <h4>Próximos Agendamentos</h4>
        <ul>
          ${agList}
        </ul>
      `;
    }

    initAgendamentoEvents(index) {
        const formAgendamento = document.getElementById('formAgendamento');
        if (formAgendamento) {
            formAgendamento.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarAgendamento(index);
            });
        }
        const contentDiv = document.getElementById('veiculoTabsContent');
        contentDiv.querySelectorAll('[data-action]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const agIndex = btn.getAttribute('data-agendamento-index');
                const action = btn.getAttribute('data-action');
                if (action === 'concluir') {
                    this.concluirAgendamento(index, agIndex);
                } else if (action === 'cancelar') {
                    this.cancelarAgendamento(index, agIndex);
                }
            });
        });
    }

    salvarAgendamento(index) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        const dataAgendamento =
            document.getElementById('dataAgendamento').value;
        const tipoAgendamento =
            document.getElementById('tipoAgendamento').value;
        const descricaoAgendamento = document
            .getElementById('descricaoAgendamento')
            .value.trim();

        if (!dataAgendamento || !tipoAgendamento) {
            alert('Preencha os campos de agendamento.');
            return;
        }
        veiculo.agendamentos.push({
            data: dataAgendamento,
            tipo: tipoAgendamento,
            descricao: descricaoAgendamento,
            estado: 'pendente',
        });
        this.salvarEmpresaAtiva(empresaAtiva);
        alert('Agendamento salvo!');
        this.renderVeiculoTabs('agendamento', index);
    }

    concluirAgendamento(index, agIndex) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        if (!veiculo.agendamentos[agIndex]) return;
        veiculo.agendamentos[agIndex].estado = 'concluido';
        this.salvarEmpresaAtiva(empresaAtiva);
        this.renderVeiculoTabs('agendamento', index);
    }

    cancelarAgendamento(index, agIndex) {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const veiculo = empresaAtiva.veiculos[index];
        if (!veiculo.agendamentos[agIndex]) return;
        veiculo.agendamentos[agIndex].estado = 'cancelado';
        this.salvarEmpresaAtiva(empresaAtiva);
        this.renderVeiculoTabs('agendamento', index);
    }

    carregarDadosEmpresa() {
        const nomeFantasiaEl = document.getElementById('nomeFantasia');
        if (!nomeFantasiaEl) return;
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresa = empresasGestor.find(
            (emp) => emp.email === empresaAtiva.email
        );
        if (!empresa) return;
        if (empresaAtiva.veiculos) {
            empresa.veiculos = empresaAtiva.veiculos;
        }
        this.salvarEmpresaAtiva(empresa);
        document.getElementById('nomeFantasia').textContent =
            empresa.nomeFantasia || 'N/A';
        document.getElementById('cnpj').textContent = empresa.cnpj || 'N/A';
        document.getElementById('cep').textContent =
            empresa.endereco?.cep || 'N/A';
        document.getElementById('rua').textContent =
            empresa.endereco?.rua || 'N/A';
        document.getElementById('numero').textContent =
            empresa.endereco?.numero || 'N/A';
        document.getElementById('complemento').textContent =
            empresa.endereco?.complemento || 'N/A';
        document.getElementById('bairro').textContent =
            empresa.endereco?.bairro || 'N/A';
        document.getElementById('uf').textContent =
            empresa.endereco?.uf || 'N/A';
        document.getElementById('cidade').textContent =
            empresa.endereco?.cidade || 'N/A';
    }

    habilitarEdicaoEmpresa() {
        let empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresa = empresasGestor.find(
            (emp) => emp.email === empresaAtiva.email
        );
        if (!empresa) return;
        const dadosEmpresaVisual =
            document.getElementById('dadosEmpresaVisual');
        if (!dadosEmpresaVisual) return;
        dadosEmpresaVisual.innerHTML = `
        <label>Nome Fantasia</label>
        <input type="text" id="editNomeFantasia" value="${
            empresa.nomeFantasia || ''
        }">
        <label>CNPJ</label>
        <input type="text" id="editCnpj" value="${empresa.cnpj || ''}">
        <label>CEP</label>
        <input type="text" id="editCep" value="${empresa.endereco?.cep || ''}">
        <label>Rua</label>
        <input type="text" id="editRua" value="${empresa.endereco?.rua || ''}">
        <label>Número</label>
        <input type="text" id="editNumero" value="${
            empresa.endereco?.numero || ''
        }">
        <label>Complemento</label>
        <input type="text" id="editComplemento" value="${
            empresa.endereco?.complemento || ''
        }">
        <label>Bairro</label>
        <input type="text" id="editBairro" value="${
            empresa.endereco?.bairro || ''
        }">
        <label>UF</label>
        <input type="text" id="editUf" value="${empresa.endereco?.uf || ''}">
        <label>Cidade</label>
        <input type="text" id="editCidade" value="${
            empresa.endereco?.cidade || ''
        }">
      `;
        const btnEditar = document.getElementById('editarEmpresa');
        btnEditar.textContent = 'Salvar';
        btnEditar.replaceWith(btnEditar.cloneNode(true));
        const btnSalvar = document.getElementById('editarEmpresa');
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();
            this.salvarEdicaoEmpresa();
        });
    }

    salvarEdicaoEmpresa() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresaIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empresaIndex === -1) return;
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const empresa = empresasGestor[empresaIndex];
        const oldName = empresa.nomeFantasia;
        const nomeFantasia = document.getElementById('editNomeFantasia')?.value;
        const cnpj = document.getElementById('editCnpj')?.value;
        const cep = document.getElementById('editCep')?.value;
        const rua = document.getElementById('editRua')?.value;
        const numero = document.getElementById('editNumero')?.value;
        const complemento = document.getElementById('editComplemento')?.value;
        const bairro = document.getElementById('editBairro')?.value;
        const uf = document.getElementById('editUf')?.value;
        const cidade = document.getElementById('editCidade')?.value;
        if (
            !nomeFantasia ||
            !cnpj ||
            !cep ||
            !rua ||
            !numero ||
            !bairro ||
            !uf ||
            !cidade
        ) {
            alert('Todos os campos obrigatórios devem ser preenchidos.');
            return;
        }
        empresa.nomeFantasia = nomeFantasia;
        empresa.cnpj = cnpj;
        empresa.endereco.cep = cep;
        empresa.endereco.rua = rua;
        empresa.endereco.numero = numero;
        empresa.endereco.complemento = complemento;
        empresa.endereco.bairro = bairro;
        empresa.endereco.uf = uf;
        empresa.endereco.cidade = cidade;
        empresasGestor[empresaIndex] = empresa;
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresa));
        funcionarios.forEach((func) => {
            if (func.empresa === oldName) {
                func.empresa = nomeFantasia;
            }
        });
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        if (document.getElementById('nomeFantasia')) {
            this.carregarDadosEmpresa();
        }
        const btnEditar = document.getElementById('editarEmpresa');
        if (btnEditar) {
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => this.habilitarEdicaoEmpresa();
        }
        alert('Dados atualizados com sucesso!');
    }

    // Exibe pequeno resumo de parcelas (última paga, próxima parcela, etc)
    getFinancialSummary(user) {
        if (
            user.parcelas &&
            Array.isArray(user.parcelas) &&
            user.parcelas.length > 0
        ) {
            const sorted = user.parcelas.sort(
                (a, b) =>
                    new Date(a.dataVencimento) - new Date(b.dataVencimento)
            );
            const ultimaPaga = sorted.filter((p) => p.status === 'paga').pop();
            const proxima = sorted.find((p) => p.status !== 'paga');
            let situacao = '';
            if (proxima) {
                const vencimento = new Date(proxima.dataVencimento);
                situacao = vencimento < new Date() ? 'em atraso' : 'pendente';
            }
            return `${
                ultimaPaga
                    ? 'Última paga: ' + ultimaPaga.numero
                    : 'Nenhuma paga'
            } - Próxima: ${proxima ? proxima.numero : '-'} - ${situacao}`;
        }
        return '-';
    }

    cadastrarInstituicao() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) {
            alert('Nenhuma empresa ativa encontrada.');
            return;
        }
        const instituicao = {
            nomeFantasia: document.getElementById('nomeFantasiaInstituicao')
                .value,
            cnpj: document.getElementById('cnpjInstituicao').value,
            endereco: {
                cep: document.getElementById('cepInstituicao').value,
                rua: document.getElementById('ruaInstituicao').value,
                numero: document.getElementById('numeroInstituicao').value,
                complemento: document.getElementById('complementoInstituicao')
                    .value,
                bairro: document.getElementById('bairroInstituicao').value,
                uf: document.getElementById('ufInstituicao').value,
                cidade: document.getElementById('cidadeInstituicao').value,
            },
        };
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresaIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empresaIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }
        empresasGestor[empresaIndex].instituicoes =
            empresasGestor[empresaIndex].instituicoes || [];
        empresasGestor[empresaIndex].instituicoes.push(instituicao);
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        localStorage.setItem(
            'empresaAtiva',
            JSON.stringify(empresasGestor[empresaIndex])
        );
        document.getElementById('formInstituicao').reset();
        this.carregarInstituicoes();
        alert('Instituição cadastrada com sucesso!');
    }

    carregarInstituicoes() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const instituicoes = empresaAtiva?.instituicoes || [];
        const tabelaInstituicoes = document.querySelector(
            '.tabela-instituicoes tbody'
        );
        if (!tabelaInstituicoes) return;
        tabelaInstituicoes.innerHTML = '';
        instituicoes.forEach((instituicao, index) => {
            const row = tabelaInstituicoes.insertRow();
            row.insertCell(0).textContent = instituicao.nomeFantasia;
            row.insertCell(1).textContent = instituicao.cnpj;
            row.insertCell(2).textContent = instituicao.endereco.cep;
            row.insertCell(3).textContent = instituicao.endereco.rua;
            row.insertCell(4).textContent = instituicao.endereco.numero;
            row.insertCell(5).textContent = instituicao.endereco.bairro;
            row.insertCell(6).textContent = instituicao.endereco.uf;
            row.insertCell(7).textContent = instituicao.endereco.cidade;
            const cellAcoes = row.insertCell(8);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-editar';
            btnEditar.onclick = () => this.editarInstituicao(index);
            cellAcoes.appendChild(btnEditar);
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirInstituicao(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    editarInstituicao(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const instituicao = empresaAtiva.instituicoes[index];
        document.getElementById('nomeFantasiaInstituicao').value =
            instituicao.nomeFantasia;
        document.getElementById('cnpjInstituicao').value = instituicao.cnpj;
        document.getElementById('cepInstituicao').value =
            instituicao.endereco.cep;
        document.getElementById('ruaInstituicao').value =
            instituicao.endereco.rua;
        document.getElementById('numeroInstituicao').value =
            instituicao.endereco.numero;
        document.getElementById('complementoInstituicao').value =
            instituicao.endereco.complemento;
        document.getElementById('bairroInstituicao').value =
            instituicao.endereco.bairro;
        document.getElementById('ufInstituicao').value =
            instituicao.endereco.uf;
        document.getElementById('cidadeInstituicao').value =
            instituicao.endereco.cidade;
        const formInstituicao = document.getElementById('formInstituicao');
        const btnSubmit = formInstituicao.querySelector(
            'button[type="submit"]'
        );
        btnSubmit.textContent = 'Atualizar Instituição';
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            this.atualizarInstituicao(index);
        };
    }

    atualizarInstituicao(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const empIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }
        const instituicao = empresaAtiva.instituicoes[index];
        const oldName = instituicao.nomeFantasia;
        const novoCnpj = document.getElementById('cnpjInstituicao').value;
        const cnpjExistente = empresaAtiva.instituicoes.some(
            (inst, i) => inst.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma instituição com este CNPJ.');
            return;
        }
        const newName = document.getElementById(
            'nomeFantasiaInstituicao'
        ).value;
        instituicao.nomeFantasia = newName;
        instituicao.cnpj = novoCnpj;
        instituicao.endereco.cep =
            document.getElementById('cepInstituicao').value;
        instituicao.endereco.rua =
            document.getElementById('ruaInstituicao').value;
        instituicao.endereco.numero =
            document.getElementById('numeroInstituicao').value;
        instituicao.endereco.complemento = document.getElementById(
            'complementoInstituicao'
        ).value;
        instituicao.endereco.bairro =
            document.getElementById('bairroInstituicao').value;
        instituicao.endereco.uf =
            document.getElementById('ufInstituicao').value;
        instituicao.endereco.cidade =
            document.getElementById('cidadeInstituicao').value;
        empresaAtiva.instituicoes[index] = instituicao;
        empresasGestor[empIndex].instituicoes[index] = instituicao;
        alunos.forEach((aluno) => {
            if (aluno.faculdade === oldName) {
                aluno.faculdade = newName;
            }
        });
        localStorage.setItem('alunos', JSON.stringify(alunos));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        document.getElementById('formInstituicao').reset();
        this.carregarInstituicoes();
        alert('Instituição atualizada com sucesso!');
        const formInstituicao = document.getElementById('formInstituicao');
        const btnSubmit = formInstituicao.querySelector(
            'button[type="submit"]'
        );
        btnSubmit.textContent = 'Adicionar Instituição';
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            this.cadastrarInstituicao();
        };
    }

    excluirInstituicao(index) {
        if (confirm('Tem certeza que deseja excluir esta instituição?')) {
            const empresaAtiva = JSON.parse(
                localStorage.getItem('empresaAtiva')
            );
            empresaAtiva.instituicoes.splice(index, 1);
            localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
            this.carregarInstituicoes();
            alert('Instituição excluída com sucesso!');
        }
    }

    cadastrarEmpresa() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) {
            alert('Nenhuma empresa ativa encontrada.');
            return;
        }
        const novaEmpresa = {
            nomeFantasia: document.getElementById('nomeFantasiaEmpresa').value,
            cnpj: document
                .getElementById('cnpjEmpresa')
                .value.replace(/\D/g, ''),
            endereco: {
                cep: document
                    .getElementById('cepEmpresa')
                    .value.replace(/\D/g, ''),
                rua: document.getElementById('ruaEmpresa').value,
                numero: document.getElementById('numeroEmpresa').value,
                complemento:
                    document.getElementById('complementoEmpresa').value,
                bairro: document.getElementById('bairroEmpresa').value,
                uf: document.getElementById('ufEmpresa').value,
                cidade: document.getElementById('cidadeEmpresa').value,
            },
        };
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresaIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empresaIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }
        empresasGestor[empresaIndex].empresasCadastradas =
            empresasGestor[empresaIndex].empresasCadastradas || [];
        empresasGestor[empresaIndex].empresasCadastradas.push(novaEmpresa);
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        localStorage.setItem(
            'empresaAtiva',
            JSON.stringify(empresasGestor[empresaIndex])
        );
        document.getElementById('formEmpresa').reset();
        this.carregarEmpresas();
        alert('Empresa cadastrada com sucesso!');
    }

    carregarEmpresas() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const empresasCadastradas = empresaAtiva?.empresasCadastradas || [];
        const tabelaEmpresas = document.querySelector('.tabela-empresas tbody');
        if (!tabelaEmpresas) return;
        tabelaEmpresas.innerHTML = '';
        empresasCadastradas.forEach((empresa, index) => {
            const row = tabelaEmpresas.insertRow();
            row.insertCell(0).textContent = empresa.nomeFantasia;
            row.insertCell(1).textContent = empresa.cnpj;
            row.insertCell(2).textContent = empresa.endereco.cep;
            row.insertCell(3).textContent = empresa.endereco.rua;
            row.insertCell(4).textContent = empresa.endereco.numero;
            row.insertCell(5).textContent = empresa.endereco.bairro;
            row.insertCell(6).textContent = empresa.endereco.uf;
            row.insertCell(7).textContent = empresa.endereco.cidade;
            const cellAcoes = row.insertCell(8);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-editar';
            btnEditar.onclick = () => this.editarEmpresa(index);
            cellAcoes.appendChild(btnEditar);
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirEmpresa(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    editarEmpresa(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const empresa = empresaAtiva.empresasCadastradas[index];
        document.getElementById('nomeFantasiaEmpresa').value =
            empresa.nomeFantasia;
        document.getElementById('cnpjEmpresa').value = empresa.cnpj;
        document.getElementById('cepEmpresa').value = empresa.endereco.cep;
        document.getElementById('ruaEmpresa').value = empresa.endereco.rua;
        document.getElementById('numeroEmpresa').value =
            empresa.endereco.numero;
        document.getElementById('complementoEmpresa').value =
            empresa.endereco.complemento;
        document.getElementById('bairroEmpresa').value =
            empresa.endereco.bairro;
        document.getElementById('ufEmpresa').value = empresa.endereco.uf;
        document.getElementById('cidadeEmpresa').value =
            empresa.endereco.cidade;
        const formEmpresa = document.getElementById('formEmpresa');
        const btnSubmit = formEmpresa.querySelector("button[type='submit']");
        btnSubmit.textContent = 'Atualizar Empresa';
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            this.atualizarEmpresa(index);
        };
    }

    atualizarEmpresa(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const empIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }
        const empresa = empresaAtiva.empresasCadastradas[index];
        const oldName = empresa.nomeFantasia;
        const novoCnpj = document.getElementById('cnpjEmpresa').value;
        const cnpjExistente = empresaAtiva.empresasCadastradas.some(
            (emp, i) => emp.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma empresa com este CNPJ.');
            return;
        }
        const newName = document.getElementById('nomeFantasiaEmpresa').value;
        empresa.nomeFantasia = newName;
        empresa.cnpj = novoCnpj;
        empresa.endereco.cep = document.getElementById('cepEmpresa').value;
        empresa.endereco.rua = document.getElementById('ruaEmpresa').value;
        empresa.endereco.numero =
            document.getElementById('numeroEmpresa').value;
        empresa.endereco.complemento =
            document.getElementById('complementoEmpresa').value;
        empresa.endereco.bairro =
            document.getElementById('bairroEmpresa').value;
        empresa.endereco.uf = document.getElementById('ufEmpresa').value;
        empresa.endereco.cidade =
            document.getElementById('cidadeEmpresa').value;
        empresaAtiva.empresasCadastradas[index] = empresa;
        empresasGestor[empIndex].empresasCadastradas[index] = empresa;
        funcionarios.forEach((func) => {
            if (func.empresa === oldName) {
                func.empresa = newName;
            }
        });
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        document.getElementById('formEmpresa').reset();
        this.carregarEmpresas();
        alert('Empresa atualizada com sucesso!');
        const formEmpresa = document.getElementById('formEmpresa');
        const btnSubmit = formEmpresa.querySelector("button[type='submit']");
        btnSubmit.textContent = 'Adicionar Empresa';
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            this.cadastrarEmpresa();
        };
    }

    excluirEmpresa(index) {
        if (confirm('Tem certeza que deseja excluir esta empresa?')) {
            const empresaAtiva = JSON.parse(
                localStorage.getItem('empresaAtiva')
            );
            empresaAtiva.empresasCadastradas.splice(index, 1);
            localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
            this.carregarEmpresas();
            alert('Empresa excluída com sucesso!');
        }
    }

    abrirModalExclusao() {
        document.getElementById('modalExcluirConta').classList.add('active');
    }

    fecharModalExclusao() {
        document.getElementById('modalExcluirConta').classList.remove('active');
    }

    excluirConta() {
        localStorage.removeItem('empresaAtiva');
        localStorage.removeItem('usuarios');
        localStorage.removeItem('funcionarios');
        localStorage.removeItem('instituicoes');
        localStorage.removeItem('empresas');
        alert('Conta excluída com sucesso!');
        window.location.href = '../index.html';
    }

    // ---------------------------- GESTÃO FINANCEIRA ----------------------------

    carregarFinanceiro() {
        const filtroMotorista = document.getElementById('filtroMotorista');
        const filtroFrota = document.getElementById('filtroFrota');
        const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];

        filtroMotorista.innerHTML = `<option value="">Todos</option>`;
        motoristas.forEach((m) => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nomeCompleto;
            filtroMotorista.appendChild(option);
        });

        const empresaAtiva =
            JSON.parse(localStorage.getItem('empresaAtiva')) || {};
        const veiculos = empresaAtiva.veiculos || [];
        filtroFrota.innerHTML = `<option value="">Todas</option>`;
        veiculos.forEach((v) => {
            const option = document.createElement('option');
            option.value = v.frotaNumero;
            option.textContent = `${v.frotaNumero} - ${v.modelo}`;
            filtroFrota.appendChild(option);
        });

        filtroMotorista.addEventListener('change', () =>
            this.renderFinanceiroList()
        );
        filtroFrota.addEventListener('change', () =>
            this.renderFinanceiroList()
        );
        this.renderFinanceiroList();
    }

    renderFinanceiroList() {
        // Tenta obter os dois selects da página de Financeiro
        const filtroMotoristaElem = document.getElementById('filtroMotorista');
        const filtroFrotaElem = document.getElementById('filtroFrota');

        // Se não existirem, significa que a aba Financeiro não foi carregada
        if (!filtroMotoristaElem || !filtroFrotaElem) {
            return; // simplesmente sai da função
        }

        // Caso eles existam, seguimos normalmente
        const filtroMotoristaVal = filtroMotoristaElem.value;
        const filtroFrotaVal = filtroFrotaElem.value;

        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];

        const listaAlunos = document.getElementById('listaFinanceiroAlunos');
        const listaFuncionarios = document.getElementById(
            'listaFinanceiroFuncionarios'
        );
        if (listaAlunos) listaAlunos.innerHTML = '';
        if (listaFuncionarios) listaFuncionarios.innerHTML = '';

        const getAssociatedMotorista = (user) => {
            if (!user.motoristaId) return null;
            return motoristas.find((m) => m.id === user.motoristaId) || null;
        };

        alunos.forEach((user) => {
            const assoc = getAssociatedMotorista(user);
            let include = true;
            // Filtro de motorista
            if (
                filtroMotoristaVal &&
                (!assoc || assoc.id !== filtroMotoristaVal)
            ) {
                include = false;
            }
            // Filtro de frota
            if (
                filtroFrotaVal &&
                (!assoc || assoc.frotaResponsavel !== filtroFrotaVal)
            ) {
                include = false;
            }
            if (include && listaAlunos) {
                const li = document.createElement('li');
                li.textContent = user.nomeCompleto;
                li.style.cursor = 'pointer';
                li.addEventListener('click', () =>
                    this.exibirDetalhesFinanceiro(user, 'aluno')
                );
                listaAlunos.appendChild(li);
            }
        });

        funcionarios.forEach((user) => {
            const assoc = getAssociatedMotorista(user);
            let include = true;
            // Filtro de motorista
            if (
                filtroMotoristaVal &&
                (!assoc || assoc.id !== filtroMotoristaVal)
            ) {
                include = false;
            }
            // Filtro de frota
            if (
                filtroFrotaVal &&
                (!assoc || assoc.frotaResponsavel !== filtroFrotaVal)
            ) {
                include = false;
            }
            if (include && listaFuncionarios) {
                const li = document.createElement('li');
                li.textContent = user.nomeCompleto;
                li.style.cursor = 'pointer';
                li.addEventListener('click', () =>
                    this.exibirDetalhesFinanceiro(user, 'funcionario')
                );
                listaFuncionarios.appendChild(li);
            }
        });
    }

    exibirDetalhesFinanceiro(user, type) {
        const container = document.getElementById(
            'detalhesFinanceiroContainer'
        );
        container.style.display = 'block';
        this.renderFinanceiroTab('dados', user, type);

        const tabButtons = container.querySelectorAll('[data-financeiro-tab]');
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-financeiro-tab');
                this.renderFinanceiroTab(tab, user, type);
            });
        });
        const fecharBtn = document.getElementById('fecharDetalhesFinanceiro');
        fecharBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }

    renderFinanceiroTab(tab, user, type) {
        const contentDiv = document.getElementById('financeiroTabsContent');
        if (tab === 'dados') {
            const motorista = user.motorista || '-';
            contentDiv.innerHTML = `<h4>Dados do Usuário</h4>
                <p><strong>Nome:</strong> ${
                    user.nomeCompleto || 'Não informado'
                }</p>
                <p><strong>E-mail:</strong> ${user.email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${
                    user.telefone || 'Não informado'
                }</p>
                <p><strong>Motorista Responsável:</strong> ${motorista}</p>
                <p><strong>Financeiro:</strong> ${this.getFinancialSummary(
                    user
                )}</p>`;
        } else if (tab === 'financeiro') {
            let html = `
            <h4>Gestão Financeira do Usuário</h4>
            <form id="formPlanoFinanceiro" class="responsive-form">
                <label>Quantidade de Parcelas</label>
                <input type="number" id="qtdParcelas" required />
                <label>Valor de Cada Parcela</label>
                <input type="number" id="valorParcela" required step="0.01" />
                <label>Data Inicial de Vencimento</label>
                <input type="date" id="dataInicialVencimento" required />
                <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Gerar Plano</button>
                <button type="button" id="excluirPlano" class="btn btn-danger" style="margin-top:1rem;">Excluir Plano</button>
            </form>
            <div id="tabelaParcelasContainer"></div>
            `;
            contentDiv.innerHTML = html;

            if (user.parcelas && user.parcelas.length > 0) {
                this.renderParcelasTable(user, type);
            }
            document
                .getElementById('formPlanoFinanceiro')
                .addEventListener('submit', (e) => {
                    e.preventDefault();
                    const qtd = parseInt(
                        document.getElementById('qtdParcelas').value,
                        10
                    );
                    const valor = parseFloat(
                        document.getElementById('valorParcela').value
                    );
                    const dataInicial = document.getElementById(
                        'dataInicialVencimento'
                    ).value;
                    if (!qtd || !valor || !dataInicial) {
                        alert('Preencha todos os campos.');
                        return;
                    }
                    let parcelas = [];
                    let dataVenc = new Date(dataInicial);
                    for (let i = 1; i <= qtd; i++) {
                        parcelas.push({
                            numero: i,
                            valor: valor,
                            dataVencimento: dataVenc
                                .toISOString()
                                .split('T')[0],
                            status: 'pendente',
                        });
                        dataVenc.setMonth(dataVenc.getMonth() + 1);
                    }
                    user.parcelas = parcelas;
                    if (type === 'aluno') {
                        let alunos =
                            JSON.parse(localStorage.getItem('alunos')) || [];
                        const idx = alunos.findIndex((u) => u.id === user.id);
                        if (idx !== -1) {
                            alunos[idx] = user;
                            localStorage.setItem(
                                'alunos',
                                JSON.stringify(alunos)
                            );
                        }
                    } else if (type === 'funcionario') {
                        let funcionarios =
                            JSON.parse(localStorage.getItem('funcionarios')) ||
                            [];
                        const idx = funcionarios.findIndex(
                            (u) => u.id === user.id
                        );
                        if (idx !== -1) {
                            funcionarios[idx] = user;
                            localStorage.setItem(
                                'funcionarios',
                                JSON.stringify(funcionarios)
                            );
                        }
                    }
                    alert('Plano financeiro gerado!');
                    this.renderParcelasTable(user, type);
                    this.renderFinanceiroTab('dados', user, type);
                    this.renderFinanceiroList();
                });
            document
                .getElementById('excluirPlano')
                .addEventListener('click', () => {
                    if (confirm('Deseja excluir o plano financeiro?')) {
                        delete user.parcelas;
                        if (type === 'aluno') {
                            let alunos =
                                JSON.parse(localStorage.getItem('alunos')) ||
                                [];
                            const idx = alunos.findIndex(
                                (u) => u.id === user.id
                            );
                            if (idx !== -1) {
                                alunos[idx] = user;
                                localStorage.setItem(
                                    'alunos',
                                    JSON.stringify(alunos)
                                );
                            }
                        } else {
                            let funcionarios =
                                JSON.parse(
                                    localStorage.getItem('funcionarios')
                                ) || [];
                            const idx = funcionarios.findIndex(
                                (u) => u.id === user.id
                            );
                            if (idx !== -1) {
                                funcionarios[idx] = user;
                                localStorage.setItem(
                                    'funcionarios',
                                    JSON.stringify(funcionarios)
                                );
                            }
                        }
                        document.getElementById(
                            'tabelaParcelasContainer'
                        ).innerHTML = '<p>Plano excluído.</p>';
                        alert('Plano financeiro excluído!');
                        this.renderFinanceiroTab('dados', user, type);
                        this.renderFinanceiroList();
                    }
                });
        } else if (tab === 'historico') {
            let html = `<h4>Histórico de Pagamentos</h4>`;
            if (user.historicoPagos && user.historicoPagos.length > 0) {
                html += `<ul>`;
                user.historicoPagos.forEach((p) => {
                    html += `<li>Parcela ${p.numero} - Valor: ${p.valor.toFixed(
                        2
                    )} - Data de Pagamento: ${this.formatDateBrazilian(
                        p.dataPagamento
                    )}</li>`;
                });
                html += `</ul>`;
            } else {
                html += `<p>Nenhum pagamento registrado.</p>`;
            }
            contentDiv.innerHTML = html;
        }
    }

    renderParcelasTable(user, type) {
        const container = document.getElementById('tabelaParcelasContainer');
        if (!user.parcelas || user.parcelas.length === 0) {
            container.innerHTML = '<p>Nenhuma parcela cadastrada.</p>';
            return;
        }
        let html = `<table class="table-responsive">
            <thead>
              <tr>
                <th>Parcela</th>
                <th>Valor</th>
                <th>Data de Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>`;
        user.parcelas.forEach((p, idx) => {
            html += `<tr>
                <td>${p.numero}</td>
                <td>${p.valor.toFixed(2)}</td>
                <td>${this.formatDateBrazilian(p.dataVencimento)}</td>
                <td>${p.status}</td>
                <td>
                  <button class="btn btn-primary btn-editar-parcela" data-index="${idx}">Editar</button>
                </td>
              </tr>`;
        });
        html += `</tbody></table>`;
        container.innerHTML = html;

        // Botão de editar parcela
        document.querySelectorAll('.btn-editar-parcela').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                this.editarParcela(user, idx, type);
            });
        });
    }

    editarParcela(user, parcelaIndex, type) {
        const novaSituacao = prompt(
            'Digite a nova situação para a parcela (paga/pendente):',
            'paga'
        );
        if (!novaSituacao) return;

        if (novaSituacao === 'paga') {
            const dataPagamento = prompt(
                'Digite a data de pagamento (AAAA-MM-DD):',
                new Date().toISOString().split('T')[0]
            );
            if (!dataPagamento) return;
            user.historicoPagos = user.historicoPagos || [];
            user.historicoPagos.push({
                numero: user.parcelas[parcelaIndex].numero,
                valor: user.parcelas[parcelaIndex].valor,
                dataPagamento: dataPagamento,
            });
            user.parcelas.splice(parcelaIndex, 1); // remove do array principal
        } else {
            user.parcelas[parcelaIndex].status = novaSituacao;
        }

        if (type === 'aluno') {
            let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            const idx = alunos.findIndex((u) => u.id === user.id);
            if (idx !== -1) {
                alunos[idx] = user;
                localStorage.setItem('alunos', JSON.stringify(alunos));
            }
        } else if (type === 'funcionario') {
            let funcionarios =
                JSON.parse(localStorage.getItem('funcionarios')) || [];
            const idx = funcionarios.findIndex((u) => u.id === user.id);
            if (idx !== -1) {
                funcionarios[idx] = user;
                localStorage.setItem(
                    'funcionarios',
                    JSON.stringify(funcionarios)
                );
            }
        }
        alert('Parcela atualizada!');
        this.renderParcelasTable(user, type);
        this.renderFinanceiroTab('dados', user, type);
        this.renderFinanceiroList();
    }
}

new PainelGestorEmpresa();

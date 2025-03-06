class PainelGestorEmpresa {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
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
        });
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
                // Fecha menu no mobile
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
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          `;
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

        // Inicializa os accordions
        this.initAccordions();

        // Se for mobile, recolhe o menu
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-lateral').classList.remove('active');
        }

        // Carrega dados específicos
        if (aba === 'usuarios') {
            const gerarLink = document.getElementById('gerarLink');
            if (gerarLink) {
                gerarLink.addEventListener('click', () =>
                    this.gerarLinkCadastro()
                );
            }
            this.carregarAlunos();
            this.carregarFuncionarios();
        }
        if (aba === 'configuracoes') {
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

    /* ==================== DADOS DA EMPRESA ==================== */
    carregarDadosEmpresa() {
        const nomeFantasiaEl = document.getElementById('nomeFantasia');
        if (!nomeFantasiaEl) return;

        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;

        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresa = empresasGestor.find(
            (emp) => emp.email === empresaAtiva.email
        );
        if (!empresa) return;

        localStorage.setItem('empresaAtiva', JSON.stringify(empresa));

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
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
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

        // Carrega array de funcionarios para "procura e substitui"
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];

        const empresa = empresasGestor[empresaIndex];

        // Nome antigo (para substituição em funcionarios)
        const oldName = empresa.nomeFantasia;

        // Pega valores do form
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

        // Atualiza dados da empresa principal
        empresa.nomeFantasia = nomeFantasia;
        empresa.cnpj = cnpj;
        empresa.endereco.cep = cep;
        empresa.endereco.rua = rua;
        empresa.endereco.numero = numero;
        empresa.endereco.complemento = complemento;
        empresa.endereco.bairro = bairro;
        empresa.endereco.uf = uf;
        empresa.endereco.cidade = cidade;

        // Atualiza array empresasGestor
        empresasGestor[empresaIndex] = empresa;

        // Também atualiza "empresaAtiva"
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresa));

        // === Procura e substitui nos funcionarios (se o nome antigo da empresa era usado) ===
        funcionarios.forEach((func) => {
            if (func.empresa === oldName) {
                func.empresa = nomeFantasia;
            }
        });
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

        // Se existir elemento "nomeFantasia" na tela, recarrega dados
        if (document.getElementById('nomeFantasia')) {
            this.carregarDadosEmpresa();
        }

        // Restaura botão "Editar"
        const btnEditar = document.getElementById('editarEmpresa');
        if (btnEditar) {
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => this.habilitarEdicaoEmpresa();
        }

        alert('Dados atualizados com sucesso!');
    }

    /* ==================== ALUNOS ==================== */
    carregarAlunos() {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const tabelaAlunos = document
            .getElementById('tabelaAlunos')
            ?.querySelector('tbody');
        if (!tabelaAlunos) return;

        tabelaAlunos.innerHTML = '';
        alunos.forEach((aluno, index) => {
            const row = tabelaAlunos.insertRow();
            row.insertCell(0).textContent = aluno.nomeCompleto || 'N/A';
            row.insertCell(1).textContent = aluno.faculdade || 'N/A';
            row.insertCell(2).textContent = aluno.email || 'N/A';
            row.insertCell(3).textContent = aluno.telefone || 'N/A';

            const cellAcoes = row.insertCell(4);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-editar';
            btnEditar.onclick = () => this.abrirEdicaoAluno(index);
            cellAcoes.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirAluno(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    abrirEdicaoAluno(index) {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const aluno = alunos[index];
        alert(`Editar aluno: ${aluno.nomeCompleto}`);
    }

    excluirAluno(index) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            alunos.splice(index, 1);
            localStorage.setItem('alunos', JSON.stringify(alunos));
            this.carregarAlunos();
        }
    }

    /* ==================== FUNCIONÁRIOS ==================== */
    carregarFuncionarios() {
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const tabelaFuncionarios = document
            .getElementById('tabelaFuncionarios')
            ?.querySelector('tbody');
        if (!tabelaFuncionarios) return;

        tabelaFuncionarios.innerHTML = '';
        funcionarios.forEach((funcionario, index) => {
            const row = tabelaFuncionarios.insertRow();
            row.insertCell(0).textContent = funcionario.nomeCompleto || 'N/A';
            row.insertCell(1).textContent = funcionario.empresa || 'N/A';
            row.insertCell(2).textContent = funcionario.email || 'N/A';
            row.insertCell(3).textContent = funcionario.telefone || 'N/A';

            const cellAcoes = row.insertCell(4);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-editar';
            btnEditar.onclick = () => this.abrirEdicaoFuncionario(index);
            cellAcoes.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-excluir';
            btnExcluir.onclick = () => this.excluirFuncionario(index);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    abrirEdicaoFuncionario(index) {
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const funcionario = funcionarios[index];
        alert(`Editar funcionário: ${funcionario.nomeCompleto}`);
    }

    excluirFuncionario(index) {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            const funcionarios =
                JSON.parse(localStorage.getItem('funcionarios')) || [];
            funcionarios.splice(index, 1);
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            this.carregarFuncionarios();
        }
    }

    /* ==================== INSTITUIÇÕES ==================== */
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

        // Carrega array principal e array de alunos
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];

        // Acha a empresaAtiva dentro de empresasGestor
        const empIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }

        // Instituição antes de sobrescrever
        const instituicao = empresaAtiva.instituicoes[index];
        const oldName = instituicao.nomeFantasia; // nome antigo

        // Checa se CNPJ novo já existe
        const novoCnpj = document.getElementById('cnpjInstituicao').value;
        const cnpjExistente = empresaAtiva.instituicoes.some(
            (inst, i) => inst.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma instituição com este CNPJ.');
            return;
        }

        // Pega novos valores
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

        // Atualiza em empresaAtiva
        empresaAtiva.instituicoes[index] = instituicao;

        // Atualiza em empresasGestor
        empresasGestor[empIndex].instituicoes[index] = instituicao;

        // === Procura e substitui nos alunos (se oldName == aluno.faculdade) ===
        alunos.forEach((aluno) => {
            if (aluno.faculdade === oldName) {
                aluno.faculdade = newName;
            }
        });

        // Salva tudo no localStorage
        localStorage.setItem('alunos', JSON.stringify(alunos));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));

        // Restaura formulário
        document.getElementById('formInstituicao').reset();
        this.carregarInstituicoes();
        alert('Instituição atualizada com sucesso!');

        // Restaura botão "Adicionar Instituição"
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

    /* ==================== EMPRESAS ==================== */
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
        const btnSubmit = formEmpresa.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Atualizar Empresa';
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            this.atualizarEmpresa(index);
        };
    }

    atualizarEmpresa(index) {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) return;

        // Carrega array principal e array de funcionarios
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];

        // Acha a empresaAtiva dentro de empresasGestor
        const empIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }

        // Empresa antes de sobrescrever
        const empresa = empresaAtiva.empresasCadastradas[index];
        const oldName = empresa.nomeFantasia; // nome antigo

        // Checa se CNPJ novo já existe
        const novoCnpj = document.getElementById('cnpjEmpresa').value;
        const cnpjExistente = empresaAtiva.empresasCadastradas.some(
            (emp, i) => emp.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma empresa com este CNPJ.');
            return;
        }

        // Pega novos valores
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

        // Atualiza em empresaAtiva
        empresaAtiva.empresasCadastradas[index] = empresa;

        // Atualiza em empresasGestor
        empresasGestor[empIndex].empresasCadastradas[index] = empresa;

        // === Procura e substitui nos funcionarios (se oldName == funcionario.empresa) ===
        funcionarios.forEach((func) => {
            if (func.empresa === oldName) {
                func.empresa = newName;
            }
        });

        // Salva tudo no localStorage
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));

        // Restaura formulário
        document.getElementById('formEmpresa').reset();
        this.carregarEmpresas();
        alert('Empresa atualizada com sucesso!');

        // Restaura botão "Adicionar Empresa"
        const formEmpresa = document.getElementById('formEmpresa');
        const btnSubmit = formEmpresa.querySelector('button[type="submit"]');
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

    /* ==================== MODAL EXCLUSÃO ==================== */
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

    /* ==================== GERAÇÃO DE LINK ==================== */
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
}

new PainelGestorEmpresa();

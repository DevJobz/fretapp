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

            // Carrega o conteúdo inicial e adiciona os event listeners
            this.carregarConteudoInicial();
            this.adicionarEventListeners();

            // Força o carregamento dos dados da empresa após um pequeno delay
            setTimeout(() => {
                this.carregarDadosEmpresa(); // Carrega os dados da empresa ativa
            }, 100); // 100ms de delay para garantir que o DOM esteja pronto
        });
    }

    carregarConteudoInicial() {
        this.carregarConteudoAba('usuarios');
    }

    adicionarEventListeners() {
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks) {
            navLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const aba = link.getAttribute('data-aba');
                    this.carregarConteudoAba(aba);

                    if (window.innerWidth <= 768) {
                        document
                            .querySelector('.nav-lateral')
                            .classList.remove('ativo');
                    }
                });
            });
        }

        const menuHamburguer = document.querySelector('.menu-hamburguer');
        if (menuHamburguer) {
            menuHamburguer.addEventListener('click', () => {
                document
                    .querySelector('.nav-lateral')
                    .classList.toggle('ativo');
            });
        }

        document.addEventListener('click', (e) => {
            const navLateral = document.querySelector('.nav-lateral');
            const menuHamburguer = document.querySelector('.menu-hamburguer');

            if (
                !navLateral.contains(e.target) &&
                !menuHamburguer.contains(e.target) &&
                window.innerWidth <= 768
            ) {
                navLateral.classList.remove('ativo');
            }
        });

        const btnSimExcluir = document.getElementById('btnSimExcluir');
        if (btnSimExcluir) {
            btnSimExcluir.addEventListener('click', () => {
                this.excluirConta();
            });
        }

        const btnNaoExcluir = document.getElementById('btnNaoExcluir');
        if (btnNaoExcluir) {
            btnNaoExcluir.addEventListener('click', () => {
                this.fecharModalExclusao();
            });
        }

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
                    <h3>Gerar Link de Cadastro</h3>
                    <select id="tipoCadastro">
                        <option value="aluno">Aluno</option>
                        <option value="funcionario">Funcionário</option>
                    </select>
                    <button id="gerarLink" class="btn btn-primary">Gerar Link</button>
                    <p id="linkGerado"></p>
                    <div class="lista-usuarios">
                        <h3>Lista de Alunos</h3>
                        <table id="tabelaAlunos">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Matrícula</th>
                                    <th>Faculdade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Dados dos alunos serão carregados dinamicamente aqui -->
                            </tbody>
                        </table>
                        <h3>Lista de Funcionários</h3>
                        <table id="tabelaFuncionarios">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Dados dos funcionários serão carregados dinamicamente aqui -->
                            </tbody>
                        </table>
                    </div>
                `;
                break;
            case 'configuracoes':
                conteudo = `
                    <h2>Configurações</h2>
                    <p>Aqui você pode definir políticas e termos.</p>
                    <div class="dados-empresa">
                        <h3>Dados da Empresa</h3>
                        <p>Nome Fantasia: <span id="nomeFantasia"></span></p>
                        <p>CNPJ: <span id="cnpj"></span></p>
                        <p>CEP: <span id="cep"></span></p>
                        <p>Rua: <span id="rua"></span></p>
                        <p>Número: <span id="numero"></span></p>
                        <p>Complemento: <span id="complemento"></span></p>
                        <p>Bairro: <span id="bairro"></span></p>
                        <p>UF: <span id="uf"></span></p>
                        <p>Cidade: <span id="cidade"></span></p>
                        <button id="editarEmpresa" class="btn btn-primary">Editar</button>
                        <button id="excluirEmpresa" class="btn btn-danger">Excluir Conta</button>
                    </div>
                    <div class="lista-instituicoes">
                        <h3>Instituições Cadastradas</h3>
                        <form id="formInstituicao">
                            <input type="text" id="nomeFantasiaInstituicao" placeholder="Nome Fantasia" required>
                            <input type="text" id="cnpjInstituicao" placeholder="CNPJ" required>
                            <input type="text" id="cepInstituicao" placeholder="CEP" required>
                            <input type="text" id="ruaInstituicao" placeholder="Rua" required>
                            <input type="text" id="numeroInstituicao" placeholder="Número" required>
                            <input type="text" id="complementoInstituicao" placeholder="Complemento">
                            <input type="text" id="bairroInstituicao" placeholder="Bairro" required>
                            <input type="text" id="ufInstituicao" placeholder="UF" required>
                            <input type="text" id="cidadeInstituicao" placeholder="Cidade" required>
                            <button type="submit">Adicionar Instituição</button>
                        </form>
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
                            <tbody>
                                <!-- Dados das instituições serão carregados dinamicamente aqui -->
                            </tbody>
                        </table>
                    </div>
                    <div class="lista-empresas">
                        <h3>Empresas Cadastradas</h3>
                        <form id="formEmpresa">
                            <input type="text" id="nomeFantasiaEmpresa" placeholder="Nome Fantasia" required>
                            <input type="text" id="cnpjEmpresa" placeholder="CNPJ" required>
                            <input type="text" id="cepEmpresa" placeholder="CEP" required>
                            <input type="text" id="ruaEmpresa" placeholder="Rua" required>
                            <input type="text" id="numeroEmpresa" placeholder="Número" required>
                            <input type="text" id="complementoEmpresa" placeholder="Complemento">
                            <input type="text" id="bairroEmpresa" placeholder="Bairro" required>
                            <input type="text" id="ufEmpresa" placeholder="UF" required>
                            <input type="text" id="cidadeEmpresa" placeholder="Cidade" required>
                            <button type="submit">Adicionar Empresa</button>
                        </form>
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
                            <tbody>
                                <!-- Dados das empresas serão carregados dinamicamente aqui -->
                            </tbody>
                        </table>
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

        if (aba === 'usuarios') {
            const gerarLink = document.getElementById('gerarLink');
            if (gerarLink) {
                gerarLink.addEventListener('click', () => {
                    this.gerarLinkCadastro();
                });
            }
            this.carregarAlunos();
            this.carregarFuncionarios();
        }

        if (aba === 'configuracoes') {
            // Carrega os dados apenas se a aba for "configuracoes"
            this.carregarDadosEmpresa();
            this.carregarInstituicoes();
            this.carregarEmpresas();

            const editarEmpresa = document.getElementById('editarEmpresa');
            if (editarEmpresa) {
                editarEmpresa.addEventListener('click', () => {
                    this.habilitarEdicaoEmpresa();
                });
            }

            const excluirEmpresa = document.getElementById('excluirEmpresa');
            if (excluirEmpresa) {
                excluirEmpresa.addEventListener('click', () => {
                    this.abrirModalExclusao();
                });
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

    carregarDadosEmpresa() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (!empresaAtiva) {
            console.error('Nenhuma empresa ativa encontrada no localStorage.');
            return;
        }

        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];
        const empresa = empresasGestor.find(
            (emp) => emp.email === empresaAtiva.email
        );

        if (!empresa) {
            console.error(
                'Empresa ativa não encontrada na lista de empresasGestor.'
            );
            return;
        }

        // Atualiza os dados da empresa ativa no localStorage
        localStorage.setItem('empresaAtiva', JSON.stringify(empresa));

        // Verifica se os elementos existem antes de tentar acessá-los
        const nomeFantasia = document.getElementById('nomeFantasia');
        const cnpj = document.getElementById('cnpj');
        const cep = document.getElementById('cep');
        const rua = document.getElementById('rua');
        const numero = document.getElementById('numero');
        const complemento = document.getElementById('complemento');
        const bairro = document.getElementById('bairro');
        const uf = document.getElementById('uf');
        const cidade = document.getElementById('cidade');

        if (nomeFantasia)
            nomeFantasia.textContent = empresa.nomeFantasia || 'N/A';
        if (cnpj) cnpj.textContent = empresa.cnpj || 'N/A';
        if (cep) cep.textContent = empresa.endereco?.cep || 'N/A';
        if (rua) rua.textContent = empresa.endereco?.rua || 'N/A';
        if (numero) numero.textContent = empresa.endereco?.numero || 'N/A';
        if (complemento)
            complemento.textContent = empresa.endereco?.complemento || 'N/A';
        if (bairro) bairro.textContent = empresa.endereco?.bairro || 'N/A';
        if (uf) uf.textContent = empresa.endereco?.uf || 'N/A';
        if (cidade) cidade.textContent = empresa.endereco?.cidade || 'N/A';

        this.carregarInstituicoes();
        this.carregarEmpresas();
    }

    habilitarEdicaoEmpresa() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (empresaAtiva) {
            const empresasGestor =
                JSON.parse(localStorage.getItem('empresasGestor')) || [];
            const empresa = empresasGestor.find(
                (emp) => emp.email === empresaAtiva.email
            );

            if (empresa) {
                // Preenche os campos de edição com os valores atuais da empresa
                document.getElementById('nomeFantasia').innerHTML = `
                    <input type="text" id="editNomeFantasia" value="${
                        empresa.nomeFantasia || ''
                    }">
                `;
                document.getElementById('cnpj').innerHTML = `
                    <input type="text" id="editCnpj" value="${
                        empresa.cnpj || ''
                    }">
                `;
                document.getElementById('cep').innerHTML = `
                    <input type="text" id="editCep" value="${
                        empresa.endereco?.cep || ''
                    }">
                `;
                document.getElementById('rua').innerHTML = `
                    <input type="text" id="editRua" value="${
                        empresa.endereco?.rua || ''
                    }">
                `;
                document.getElementById('numero').innerHTML = `
                    <input type="text" id="editNumero" value="${
                        empresa.endereco?.numero || ''
                    }">
                `;
                document.getElementById('complemento').innerHTML = `
                    <input type="text" id="editComplemento" value="${
                        empresa.endereco?.complemento || ''
                    }">
                `;
                document.getElementById('bairro').innerHTML = `
                    <input type="text" id="editBairro" value="${
                        empresa.endereco?.bairro || ''
                    }">
                `;
                document.getElementById('uf').innerHTML = `
                    <input type="text" id="editUf" value="${
                        empresa.endereco?.uf || ''
                    }">
                `;
                document.getElementById('cidade').innerHTML = `
                    <input type="text" id="editCidade" value="${
                        empresa.endereco?.cidade || ''
                    }">
                `;

                // Transforma o botão "Editar" em "Salvar"
                const btnEditar = document.getElementById('editarEmpresa');
                btnEditar.textContent = 'Salvar';

                // Remove o evento de clique anterior e adiciona o novo
                btnEditar.replaceWith(btnEditar.cloneNode(true)); // Remove event listeners antigos
                const btnSalvar = document.getElementById('editarEmpresa');
                btnSalvar.addEventListener('click', (e) => {
                    e.preventDefault(); // Evita o recarregamento da página
                    this.salvarEdicaoEmpresa();
                });
            }
        } else {
            console.error('Nenhuma empresa ativa encontrada no localStorage.');
        }
    }

    salvarEdicaoEmpresa() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        if (empresaAtiva) {
            const empresasGestor =
                JSON.parse(localStorage.getItem('empresasGestor')) || [];
            const empresaIndex = empresasGestor.findIndex(
                (emp) => emp.email === empresaAtiva.email
            );

            if (empresaIndex !== -1) {
                const empresa = empresasGestor[empresaIndex];

                // Captura os valores dos campos de edição
                const nomeFantasia =
                    document.getElementById('editNomeFantasia')?.value;
                const cnpj = document.getElementById('editCnpj')?.value;
                const cep = document.getElementById('editCep')?.value;
                const rua = document.getElementById('editRua')?.value;
                const numero = document.getElementById('editNumero')?.value;
                const complemento =
                    document.getElementById('editComplemento')?.value;
                const bairro = document.getElementById('editBairro')?.value;
                const uf = document.getElementById('editUf')?.value;
                const cidade = document.getElementById('editCidade')?.value;

                // Validações
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
                    alert(
                        'Todos os campos obrigatórios devem ser preenchidos.'
                    );
                    return;
                }

                // Atualiza os dados da empresa
                empresa.nomeFantasia = nomeFantasia;
                empresa.cnpj = cnpj;
                empresa.endereco.cep = cep;
                empresa.endereco.rua = rua;
                empresa.endereco.numero = numero;
                empresa.endereco.complemento = complemento;
                empresa.endereco.bairro = bairro;
                empresa.endereco.uf = uf;
                empresa.endereco.cidade = cidade;

                // Salva a lista atualizada no localStorage
                localStorage.setItem(
                    'empresasGestor',
                    JSON.stringify(empresasGestor)
                );

                // Recarrega os dados da empresa na interface
                this.carregarDadosEmpresa();

                // Restaura o botão "Editar"
                const btnEditar = document.getElementById('editarEmpresa');
                btnEditar.textContent = 'Editar';
                btnEditar.onclick = () => this.habilitarEdicaoEmpresa();

                alert('Dados atualizados com sucesso!');
            }
        } else {
            console.error('Nenhuma empresa ativa encontrada no localStorage.');
        }
    }

    carregarAlunos() {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const tabelaAlunos = document
            .getElementById('tabelaAlunos')
            .getElementsByTagName('tbody')[0];
        tabelaAlunos.innerHTML = '';

        alunos.forEach((aluno, index) => {
            const row = tabelaAlunos.insertRow();
            row.insertCell(0).textContent = aluno.nomeCompleto;
            row.insertCell(1).textContent = aluno.matricula;
            row.insertCell(2).textContent = aluno.faculdade || 'N/A';

            const cellAcoes = row.insertCell(3);
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

    carregarFuncionarios() {
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const tabelaFuncionarios = document
            .getElementById('tabelaFuncionarios')
            .getElementsByTagName('tbody')[0];
        tabelaFuncionarios.innerHTML = '';

        funcionarios.forEach((funcionario, index) => {
            const row = tabelaFuncionarios.insertRow();
            row.insertCell(0).textContent = funcionario.nomeCompleto;
            row.insertCell(1).textContent = funcionario.cpf;
            row.insertCell(2).textContent = funcionario.email;
            row.insertCell(3).textContent = funcionario.telefone;

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

    abrirEdicaoAluno(index) {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const aluno = alunos[index];
        alert(`Editar aluno ${aluno.nomeCompleto}`);
    }

    excluirAluno(index) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            alunos.splice(index, 1);
            localStorage.setItem('alunos', JSON.stringify(alunos));
            this.carregarAlunos();
        }
    }

    abrirEdicaoFuncionario(index) {
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        const funcionario = funcionarios[index];
        alert(`Editar funcionário ${funcionario.nomeCompleto}`);
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

        // Recupera a lista de empresasGestor do localStorage
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];

        // Encontra a empresa ativa na lista
        const empresaIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empresaIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }

        // Adiciona a nova instituição à lista de instituições da empresa
        empresasGestor[empresaIndex].instituicoes =
            empresasGestor[empresaIndex].instituicoes || [];
        empresasGestor[empresaIndex].instituicoes.push(instituicao);

        // Salva a lista atualizada no localStorage
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));

        // Atualiza a empresa ativa no localStorage
        localStorage.setItem(
            'empresaAtiva',
            JSON.stringify(empresasGestor[empresaIndex])
        );

        // Verificação no console
        console.log(
            'Empresa Ativa após inserção de instituição:',
            empresasGestor[empresaIndex]
        );
        console.log(
            'Lista de Empresas após inserção de instituição:',
            empresasGestor
        );

        // Limpa os campos do formulário
        document.getElementById('formInstituicao').reset();

        // Recarrega a lista de instituições
        this.carregarInstituicoes();
        alert('Instituição cadastrada com sucesso!');
    }

    carregarInstituicoes() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const instituicoes = empresaAtiva?.instituicoes || [];

        const tabelaInstituicoes = document.querySelector(
            '.tabela-instituicoes tbody'
        );
        if (!tabelaInstituicoes) {
            console.log(
                'Tabela de instituições não encontrada. A aba de Configurações pode não estar carregada.'
            );
            return; // Sai da função se a tabela não existir
        }

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

        // Preenche o formulário com os dados da instituição
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

        // Altera o botão "Adicionar Instituição" para "Atualizar Instituição"
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
        const instituicao = empresaAtiva.instituicoes[index];

        // Verifica se o CNPJ já está cadastrado
        const novoCnpj = document.getElementById('cnpjInstituicao').value;
        const cnpjExistente = empresaAtiva.instituicoes.some(
            (inst, i) => inst.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma instituição com este CNPJ.');
            return;
        }

        // Atualiza os dados da instituição
        instituicao.nomeFantasia = document.getElementById(
            'nomeFantasiaInstituicao'
        ).value;
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

        // Salva no localStorage
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));

        // Limpa os campos do formulário
        document.getElementById('formInstituicao').reset();

        // Recarrega a lista de instituições
        this.carregarInstituicoes();
        alert('Instituição atualizada com sucesso!');

        // Restaura o botão "Adicionar Instituição"
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

        // Recupera a lista de empresasGestor do localStorage
        const empresasGestor =
            JSON.parse(localStorage.getItem('empresasGestor')) || [];

        // Encontra a empresa ativa na lista
        const empresaIndex = empresasGestor.findIndex(
            (emp) => emp.email === empresaAtiva.email
        );
        if (empresaIndex === -1) {
            alert('Empresa ativa não encontrada na lista de empresasGestor.');
            return;
        }

        // Adiciona a nova empresa à lista de empresas cadastradas
        empresasGestor[empresaIndex].empresasCadastradas =
            empresasGestor[empresaIndex].empresasCadastradas || [];
        empresasGestor[empresaIndex].empresasCadastradas.push(novaEmpresa);

        // Salva a lista atualizada no localStorage
        localStorage.setItem('empresasGestor', JSON.stringify(empresasGestor));

        // Atualiza a empresa ativa no localStorage
        localStorage.setItem(
            'empresaAtiva',
            JSON.stringify(empresasGestor[empresaIndex])
        );

        // Verificação no console
        console.log(
            'Empresa Ativa após inserção de empresa:',
            empresasGestor[empresaIndex]
        );
        console.log(
            'Lista de Empresas após inserção de empresa:',
            empresasGestor
        );

        // Limpa os campos do formulário
        document.getElementById('formEmpresa').reset();

        // Recarrega a lista de empresas
        this.carregarEmpresas();
        alert('Empresa cadastrada com sucesso!');
    }

    carregarEmpresas() {
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const empresasCadastradas = empresaAtiva?.empresasCadastradas || [];

        const tabelaEmpresas = document.querySelector('.tabela-empresas tbody');
        if (!tabelaEmpresas) {
            console.log(
                'Tabela de empresas não encontrada. A aba de Configurações pode não estar carregada.'
            );
            return; // Sai da função se a tabela não existir
        }

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

        // Preenche o formulário com os dados da empresa
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

        // Altera o botão "Adicionar Empresa" para "Atualizar Empresa"
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
        const empresa = empresaAtiva.empresasCadastradas[index];

        // Verifica se o CNPJ já está cadastrado
        const novoCnpj = document.getElementById('cnpjEmpresa').value;
        const cnpjExistente = empresaAtiva.empresasCadastradas.some(
            (emp, i) => emp.cnpj === novoCnpj && i !== index
        );
        if (cnpjExistente) {
            alert('Já existe uma empresa com este CNPJ.');
            return;
        }

        // Atualiza os dados da empresa
        empresa.nomeFantasia = document.getElementById(
            'nomeFantasiaEmpresa'
        ).value;
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

        // Salva no localStorage
        localStorage.setItem('empresaAtiva', JSON.stringify(empresaAtiva));

        // Limpa os campos do formulário
        document.getElementById('formEmpresa').reset();

        // Recarrega a lista de empresas
        this.carregarEmpresas();
        alert('Empresa atualizada com sucesso!');

        // Restaura o botão "Adicionar Empresa"
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

    abrirModalExclusao() {
        document.getElementById('modalExcluirConta').style.display = 'block';
    }

    fecharModalExclusao() {
        document.getElementById('modalExcluirConta').style.display = 'none';
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

    gerarLinkCadastro() {
        const tipoCadastro = document.getElementById('tipoCadastro').value;
        const linkBase = window.location.origin;
        const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
        const nomeFantasia = empresaAtiva.nomeFantasia;

        const linkCadastro = `${linkBase}/pages/cadastro-${tipoCadastro}.html?empresa=${encodeURIComponent(
            nomeFantasia
        )}`;
        document.getElementById(
            'linkGerado'
        ).innerHTML = `Link de cadastro: <a href="${linkCadastro}" target="_blank">${linkCadastro}</a>`;
    }
}

// Inicializar o painel do gestor de empresa
new PainelGestorEmpresa();

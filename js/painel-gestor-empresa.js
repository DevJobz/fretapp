class PainelGestorEmpresa {
    constructor() {
        this.init();
    }

    init() {
        this.carregarConteudoInicial();
        this.adicionarEventListeners();
    }

    carregarConteudoInicial() {
        this.carregarConteudoAba('usuarios');
    }

    adicionarEventListeners() {
        // Evento para carregar o conteúdo da aba ao clicar nos links
        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const aba = link.getAttribute('data-aba');
                this.carregarConteudoAba(aba);

                // Fechar o menu de hambúrguer após clicar em um link (mobile)
                if (window.innerWidth <= 768) {
                    document
                        .querySelector('.nav-lateral')
                        .classList.remove('ativo');
                }
            });
        });

        // Evento para o menu de hambúrguer (mobile)
        document
            .querySelector('.menu-hamburguer')
            .addEventListener('click', () => {
                document
                    .querySelector('.nav-lateral')
                    .classList.toggle('ativo');
            });

        // Fechar o menu ao clicar fora dele (mobile)
        document.addEventListener('click', (e) => {
            const navLateral = document.querySelector('.nav-lateral');
            const menuHamburguer = document.querySelector('.menu-hamburguer');

            // Verifica se o clique foi fora do menu e do botão de hambúrguer
            if (
                !navLateral.contains(e.target) &&
                !menuHamburguer.contains(e.target) &&
                window.innerWidth <= 768
            ) {
                navLateral.classList.remove('ativo');
            }
        });
    }

    carregarConteudoAba(aba) {
    const conteudoAba = document.getElementById('conteudoAba');

    // Exemplo de conteúdo dinâmico
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
                    <h3>Lista de Usuários</h3>
                    <table id="tabelaUsuarios">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Matrícula</th>
                                <th>Faculdade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dados dos usuários serão carregados dinamicamente aqui -->
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'motoristas':
            conteudo = `
                <h2>Gestão de Motoristas</h2>
                <p>Aqui você pode gerenciar motoristas e suas atribuições.</p>
            `;
            break;
        case 'rotas':
            conteudo = `
                <h2>Gestão de Rotas</h2>
                <p>Aqui você pode definir e otimizar rotas.</p>
            `;
            break;
        case 'veiculos':
            conteudo = `
                <h2>Gestão de Veículos</h2>
                <p>Aqui você pode gerenciar veículos e sua disponibilidade.</p>
            `;
            break;
        case 'financeiro':
            conteudo = `
                <h2>Gestão Financeira</h2>
                <p>Aqui você pode visualizar e gerar faturas.</p>
            `;
            break;
        case 'relatorios':
            conteudo = `
                <h2>Relatórios</h2>
                <p>Aqui você pode acessar relatórios detalhados.</p>
            `;
            break;
        case 'feedbacks':
            conteudo = `
                <h2>Feedbacks</h2>
                <p>Aqui você pode visualizar feedbacks dos usuários.</p>
            `;
            break;
        case 'configuracoes':
            conteudo = `
                <h2>Configurações</h2>
                <p>Aqui você pode definir políticas e termos.</p>
            `;
            break;
        case 'sair':
            // Redirecionar para a página de login ou realizar logout
            window.location.href = '../index.html'; // Altere para a URL de logout ou login
            break;
        default:
            conteudo = `<h2>Selecione uma aba para começar</h2>`;
    }

    conteudoAba.innerHTML = conteudo;

    // Re-adicionar o evento de gerar link se a aba for 'usuarios'
    if (aba === 'usuarios') {
        document
            .getElementById('gerarLink')
            .addEventListener('click', () => {
                this.gerarLinkCadastro();
            });

        this.carregarUsuarios();
    }
}

    gerarLinkCadastro() {
        const tipoCadastro = document.getElementById('tipoCadastro').value;
        const linkBase = window.location.origin; // URL base do site
        const linkCadastro = `${linkBase}/pages/cadastro-${tipoCadastro}.html`;

        // Exibe o link gerado
        document.getElementById(
            'linkGerado'
        ).innerHTML = `Link de cadastro: <a href="${linkCadastro}" target="_blank">${linkCadastro}</a>`;
    }

    carregarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const tabelaUsuarios = document
            .getElementById('tabelaUsuarios')
            .getElementsByTagName('tbody')[0];
        tabelaUsuarios.innerHTML = ''; // Limpa a tabela antes de carregar novos dados

        usuarios.forEach((usuario) => {
            const row = tabelaUsuarios.insertRow();
            row.insertCell(0).textContent = usuario.nomeCompleto;
            row.insertCell(1).textContent = usuario.tipo;
            row.insertCell(2).textContent = usuario.matricula;
            row.insertCell(3).textContent = usuario.faculdade || 'N/A';

            // Botão de edição
            const cellAcoes = row.insertCell(4);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-editar';
            btnEditar.onclick = () => this.abrirEdicao(usuario);
            cellAcoes.appendChild(btnEditar);
        });
    }

    abrirEdicao(usuario) {
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('nomeCompleto').value = usuario.nomeCompleto;
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('telefone').value = usuario.telefone || '';
        document.getElementById('editarUsuario').style.display = 'block';
    }

    fecharEdicao() {
        document.getElementById('editarUsuario').style.display = 'none';
    }
}

// Inicializar o painel do gestor de empresa
new PainelGestorEmpresa();

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userType = document.getElementById('userType').value;
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    // Busca o usuário no localStorage
    const empresasGestor =
        JSON.parse(localStorage.getItem('empresasGestor')) || [];
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
    const gestoresEvento =
        JSON.parse(localStorage.getItem('gestoresEvento')) || [];
    const moderadoresEmpresa =
        JSON.parse(localStorage.getItem('moderadoresEmpresa')) || [];
    const moderadoresEvento =
        JSON.parse(localStorage.getItem('moderadoresEvento')) || [];

    let usuario = null;

    // Verifica o tipo de usuário selecionado
    switch (userType) {
        case 'aluno':
            usuario = alunos.find(
                (aluno) =>
                    (aluno.email === identifier ||
                        aluno.cpf === identifier ||
                        aluno.matricula === identifier) &&
                    aluno.senha === password
            );
            break;
        case 'funcionario':
            usuario = funcionarios.find(
                (funcionario) =>
                    (funcionario.email === identifier ||
                        funcionario.cpf === identifier ||
                        funcionario.matricula === identifier) &&
                    funcionario.senha === password
            );
            break;
        case 'motorista':
            usuario = motoristas.find(
                (motorista) =>
                    (motorista.email === identifier ||
                        motorista.cpf === identifier ||
                        motorista.matricula === identifier) &&
                    motorista.senha === password
            );
            break;
        case 'gestor-empresa':
            usuario = empresasGestor.find(
                (empresa) =>
                    empresa.email === identifier && empresa.senha === password
            );
            break;
        case 'gestor-evento':
            usuario = gestoresEvento.find(
                (gestor) =>
                    gestor.email === identifier && gestor.senha === password
            );
            break;
        case 'moderador-empresa':
            usuario = moderadoresEmpresa.find(
                (moderador) =>
                    moderador.email === identifier &&
                    moderador.senha === password
            );
            break;
        case 'moderador-evento':
            usuario = moderadoresEvento.find(
                (moderador) =>
                    moderador.email === identifier &&
                    moderador.senha === password
            );
            break;
        default:
            alert('Tipo de usuário inválido.');
            return;
    }

    // Verificação no console
    console.log('Tipo de Usuário Selecionado:', userType);
    console.log('Email/CPF Digitado:', identifier);
    console.log('Senha Digitada:', password);
    console.log('Usuário Encontrado:', usuario);

    if (usuario) {
        // Salva o usuário ativo no localStorage
        localStorage.setItem('usuarioAtivo', JSON.stringify(usuario));

        // Define a empresa ativa (apenas o identificador)
        if (userType === 'gestor-empresa') {
            localStorage.setItem(
                'empresaAtiva',
                JSON.stringify({ email: usuario.email })
            );
        }

        // Verificação no console
        console.log(
            'Usuário Ativo Após Login:',
            JSON.parse(localStorage.getItem('usuarioAtivo'))
        );
        console.log(
            'Empresa Ativa Após Login:',
            JSON.parse(localStorage.getItem('empresaAtiva'))
        );

        // Redireciona para o painel correspondente
        switch (userType) {
            case 'aluno':
                window.location.href = 'painel-aluno.html';
                break;
            case 'funcionario':
                window.location.href = 'painel-funcionario.html';
                break;
            case 'motorista':
                window.location.href = 'painel-motorista.html';
                break;
            case 'gestor-empresa':
                window.location.href = 'painel-gestor-empresa.html';
                break;
            case 'gestor-evento':
                window.location.href = 'painel-gestor-evento.html';
                break;
            case 'moderador-empresa':
                window.location.href = 'painel-moderador-empresa.html';
                break;
            case 'moderador-evento':
                window.location.href = 'painel-moderador-evento.html';
                break;
            default:
                alert('Redirecionamento inválido.');
                break;
        }
    } else {
        // Exibe mensagem de erro
        alert('Credenciais inválidas ou tipo de usuário incorreto.');
    }
});

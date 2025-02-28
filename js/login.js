document.addEventListener('DOMContentLoaded', function () {
    // Submissão do formulário de login
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const userType = document.getElementById('userType').value;
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        // Busca o usuário no localStorage
        const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

        const usuario =
            empresas.find(
                (empresa) =>
                    (empresa.email === identifier ||
                     empresa.cpfGestor === identifier) &&
                    empresa.senha === password
            ) ||
            alunos.find(
                (aluno) =>
                    (aluno.email === identifier ||
                     aluno.cpf === identifier ||
                     aluno.matricula === identifier) &&
                    aluno.senha === password
            ) ||
            funcionarios.find(
                (funcionario) =>
                    (funcionario.email === identifier ||
                     funcionario.cpf === identifier ||
                     funcionario.matricula === identifier) &&
                    funcionario.senha === password
            );

        if (usuario) {
            // Redireciona para o painel correspondente
            switch (userType) {
                case 'aluno':
                    window.location.href = 'painel-aluno.html';
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
            }
        } else {
            // Exibe mensagem de erro
            document.getElementById('mensagemErro').style.display = 'block';
        }
    });
});

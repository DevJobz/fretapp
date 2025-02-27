document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (empresa e matrícula)
    const empresaRelacionamento = 'Empresa XYZ';
    const matricula = 'FUNC2023001'; // Gerado automaticamente

    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
    document.getElementById('matricula').value = matricula;
});

document
    .getElementById('cadastroFuncionarioForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Simulação de cadastro bem-sucedido
        const funcionario = {
            empresaRelacionamento: document.getElementById(
                'empresaRelacionamento'
            ).value,
            matricula: document.getElementById('matricula').value,
            nomeCompleto: document.getElementById('nomeCompleto').value,
            cpf: document.getElementById('cpf').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                uf: document.getElementById('uf').value,
                cidade: document.getElementById('cidade').value,
            },
            senha: senha,
        };

        // Salvar no localStorage (simulação de banco de dados)
        localStorage.setItem('funcionario', JSON.stringify(funcionario));
        alert('Funcionário cadastrado com sucesso!');
        window.location.href = 'painel-funcionario.html';
    });

document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (caso necessário)
    const empresaRelacionamento = 'Empresa XYZ';
    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
});

document
    .getElementById('cadastroModeradorEmpresaForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Simulação de cadastro bem-sucedido
        const moderadorEmpresa = {
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
        localStorage.setItem(
            'moderadorEmpresa',
            JSON.stringify(moderadorEmpresa)
        );
        alert('Moderador de Empresa cadastrado com sucesso!');
        window.location.href = 'painel-moderador-empresa.html';
    });

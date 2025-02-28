document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (empresa e matrícula)
    const empresaRelacionamento = 'Empresa XYZ';
    const matricula = 'FUNC2023001'; // Gerado automaticamente

    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
    document.getElementById('matricula').value = matricula;
});

// Função para mostrar mensagens de erro
function mostrarErro(id, mensagem) {
    const erroElemento = document.getElementById(id);
    erroElemento.textContent = mensagem;
    erroElemento.style.display = 'block';
}

// Função para esconder mensagens de erro
function esconderErro(id) {
    const erroElemento = document.getElementById(id);
    erroElemento.style.display = 'none';
}

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

// Validação de CEP (8 dígitos)
document.getElementById('cep').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length > 8) {
        cep = cep.substring(0, 8); // Limita a 8 dígitos
    }
    e.target.value = cep;
});

// Validação de Senha (mínimo 6 caracteres)
document.getElementById('senha').addEventListener('input', function (e) {
    const senha = e.target.value;
    if (senha.length < 6) {
        mostrarErro('erroSenha', 'A senha deve ter no mínimo 6 caracteres.');
    } else {
        esconderErro('erroSenha');
    }
});

// Validação de Confirmação de Senha
document
    .getElementById('confirmarSenha')
    .addEventListener('input', function (e) {
        const senha = document.getElementById('senha').value;
        const confirmarSenha = e.target.value;
        if (senha !== confirmarSenha) {
            mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
        } else {
            esconderErro('erroConfirmarSenha');
        }
    });

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

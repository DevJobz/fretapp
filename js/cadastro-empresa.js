document
    .getElementById('cadastroEmpresaForm')
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
        const empresa = {
            nomeGestor: document.getElementById('nomeGestor').value,
            cpfGestor: document.getElementById('cpfGestor').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            nomeFantasia: document.getElementById('nomeFantasia').value,
            cnpj: document.getElementById('cnpj').value,
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
        localStorage.setItem('empresa', JSON.stringify(empresa));
        alert('Empresa cadastrada com sucesso!');
        window.location.href = 'painel-gestor-empresa.html';
    });

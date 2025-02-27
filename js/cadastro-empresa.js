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

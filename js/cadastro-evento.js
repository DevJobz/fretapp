document
    .getElementById('cadastroEventoForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Simulação de cadastro bem-sucedido
        const evento = {
            nomeGestor: document.getElementById('nomeGestor').value,
            cpfGestor: document.getElementById('cpfGestor').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            nomeEvento: document.getElementById('nomeEvento').value,
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
        localStorage.setItem('evento', JSON.stringify(evento));
        alert('Evento cadastrado com sucesso!');
        window.location.href = 'painel-gestor-evento.html';
    });

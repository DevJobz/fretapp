document
    .getElementById('loginForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const userType = document.getElementById('userType').value;
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        // Simulação de autenticação
        if (identifier && password) {
            alert(`Login bem-sucedido como ${userType}`);
            // Redirecionamento para o painel correspondente
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
            alert('Por favor, preencha todos os campos.');
        }
    });

document
    .getElementById('novaSenhaForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Simulação de salvamento da nova senha
        alert('Senha alterada com sucesso!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500); // Redireciona após 1,5 segundos
    });

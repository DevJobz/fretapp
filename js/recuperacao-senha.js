document
    .getElementById('recuperacaoSenhaForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;

        if (email) {
            alert('Um link de recuperação foi enviado para o seu e-mail.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500); // Redireciona após 1,5 segundos
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });

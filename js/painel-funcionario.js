document.addEventListener('DOMContentLoaded', function () {
    const funcionarioLogado = JSON.parse(
        localStorage.getItem('funcionarioLogado')
    );

    if (funcionarioLogado) {
        document.getElementById('nome').value = funcionarioLogado.nomeCompleto;
        document.getElementById('email').value = funcionarioLogado.email;
        document.getElementById('telefone').value = funcionarioLogado.telefone;
    }

    document
        .getElementById('formInformacoes')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            const funcionarioAtualizado = {
                ...funcionarioLogado,
                nomeCompleto: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
            };

            localStorage.setItem(
                'funcionarioLogado',
                JSON.stringify(funcionarioAtualizado)
            );
            alert('Informações atualizadas com sucesso!');
        });
});

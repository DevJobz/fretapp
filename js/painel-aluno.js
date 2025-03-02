document.addEventListener('DOMContentLoaded', function () {
    const alunoLogado = JSON.parse(localStorage.getItem('alunoLogado'));

    if (alunoLogado) {
        document.getElementById('nome').value = alunoLogado.nomeCompleto;
        document.getElementById('email').value = alunoLogado.email;
        document.getElementById('telefone').value = alunoLogado.telefone;
    }

    document
        .getElementById('formInformacoes')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            const alunoAtualizado = {
                ...alunoLogado,
                nomeCompleto: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
            };

            localStorage.setItem(
                'alunoLogado',
                JSON.stringify(alunoAtualizado)
            );
            alert('Informações atualizadas com sucesso!');
        });
});

document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (evento de interesse)
    const eventoInteresse = 'Evento ABC';
    document.getElementById('eventoInteresse').value = eventoInteresse;
});

document
    .getElementById('cadastroParticipanteForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Simulação de cadastro bem-sucedido
        const participante = {
            eventoInteresse: document.getElementById('eventoInteresse').value,
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
        localStorage.setItem('participante', JSON.stringify(participante));
        alert('Participante cadastrado com sucesso!');
        window.location.href = 'painel-participante.html';
    });

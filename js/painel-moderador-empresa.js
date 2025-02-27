document.addEventListener('DOMContentLoaded', function () {
    const abas = document.querySelectorAll('.aba');
    const conteudoAba = document.getElementById('conteudoAba');

    abas.forEach((aba) => {
        aba.addEventListener('click', function () {
            const abaSelecionada = this.getAttribute('data-aba');
            carregarConteudoAba(abaSelecionada);
        });
    });

    function carregarConteudoAba(aba) {
        let conteudo = '';

        switch (aba) {
            case 'usuarios':
                conteudo = `
                    <h2>Gestão de Usuários</h2>
                    <p>Aqui você pode gerenciar alunos e funcionários.</p>
                    <ul id="listaUsuarios">
                        <li>João Silva - Aluno</li>
                        <li>Maria Souza - Funcionário</li>
                    </ul>
                `;
                break;

            case 'rotas':
                conteudo = `
                    <h2>Gestão de Rotas</h2>
                    <p>Visualize e ajuste as rotas de transporte.</p>
                    <div id="mapa" style="height: 300px; background: #ccc; border-radius: 5px;"></div>
                    <p class="status-rota">Status da rota: <span id="statusRota">Em andamento</span></p>
                `;
                break;

            case 'alertas':
                conteudo = `
                    <h2>Enviar Alertas</h2>
                    <p>Envie alertas para os usuários.</p>
                    <form id="formAlertas">
                        <label for="mensagem">Mensagem:</label>
                        <textarea id="mensagem" name="mensagem" rows="4" required></textarea>
                        <button type="submit" class="btn">Enviar Alerta</button>
                    </form>
                `;
                break;
        }

        conteudoAba.innerHTML = conteudo;

        // Adicionar lógica específica para cada aba, se necessário
        if (aba === 'rotas') {
            const statusRota = document.getElementById('statusRota');
            setInterval(() => {
                statusRota.textContent =
                    'Em andamento - Próxima parada: Ponto 2';
            }, 5000);
        }

        if (aba === 'alertas') {
            document
                .getElementById('formAlertas')
                .addEventListener('submit', function (event) {
                    event.preventDefault();
                    const mensagem = document.getElementById('mensagem').value;
                    alert(`Alerta enviado: ${mensagem}`);
                });
        }
    }

    // Carregar a primeira aba por padrão
    carregarConteudoAba('usuarios');
});

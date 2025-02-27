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
            case 'passageiros':
                conteudo = `
                    <h2>Lista de Passageiros</h2>
                    <p>Aqui você pode visualizar a lista de passageiros para o dia atual.</p>
                    <ul id="listaPassageiros">
                        <li>João Silva - Ponto 1</li>
                        <li>Maria Souza - Ponto 2</li>
                        <li>Carlos Oliveira - Ponto 3</li>
                    </ul>
                `;
                break;

            case 'rotas':
                conteudo = `
                    <h2>Rotas e Pontos de Parada</h2>
                    <p>Visualize a rota otimizada com base nos pontos selecionados pelos passageiros.</p>
                    <div id="mapa" style="height: 300px; background: #ccc; border-radius: 5px;"></div>
                    <p class="status-rota">Status da rota: <span id="statusRota">Em andamento</span></p>
                `;
                break;

            case 'rastreamento':
                conteudo = `
                    <h2>Rastreamento em Tempo Real</h2>
                    <p>Acompanhe a localização do veículo.</p>
                    <div id="mapa" style="height: 300px; background: #ccc; border-radius: 5px;"></div>
                    <p class="status-veiculo">Status do veículo: <span id="statusVeiculo">Em rota</span></p>
                `;
                break;

            case 'alertas':
                conteudo = `
                    <h2>Enviar Alertas</h2>
                    <p>Envie alertas para os passageiros.</p>
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
        if (aba === 'rastreamento') {
            // Simulação de rastreamento (pode ser integrado com uma API de mapas)
            const statusVeiculo = document.getElementById('statusVeiculo');
            setInterval(() => {
                statusVeiculo.textContent = 'Em rota - Próxima parada: Ponto 2';
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
    carregarConteudoAba('passageiros');
});

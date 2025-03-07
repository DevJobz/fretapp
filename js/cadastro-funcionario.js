document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const empresaRelacionamento = urlParams.get('empresa');
    const matricula = gerarMatriculaFuncionario();

    const selectEmpresa = document.getElementById('empresa');
    const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
    const empresasCadastradas = empresaAtiva?.empresasCadastradas || [];

    // Preenche o campo "Empresa de Relacionamento"
    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;

    // Preenche o campo "Matrícula"
    document.getElementById('matricula').value = matricula;

    // Preenche a lista de empresas
    selectEmpresa.innerHTML = '<option value="">Selecione uma empresa</option>';
    empresasCadastradas.forEach((empresa) => {
        const option = document.createElement('option');
        option.value = empresa.nomeFantasia;
        option.textContent = empresa.nomeFantasia;
        selectEmpresa.appendChild(option);
    });

    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
    document.getElementById('matricula').value = matricula;

    // Validações de formulário
    document
        .getElementById('nomeCompleto')
        .addEventListener('input', function (e) {
            const nomeCompleto = e.target.value;
            const regex = /^[A-Za-zÀ-ú\s]{8,}$/;
            if (!regex.test(nomeCompleto)) {
                mostrarErro(
                    'erroNomeCompleto',
                    'Nome deve conter apenas letras e no mínimo 8 caracteres.'
                );
            } else {
                esconderErro('erroNomeCompleto');
            }
        });

    document.getElementById('cpf').addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11);
        }
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        e.target.value = cpf;

        if (cpf.replace(/\D/g, '').length !== 11) {
            mostrarErro('erroCpf', 'CPF deve ter 11 dígitos.');
        } else {
            esconderErro('erroCpf');
        }
    });

    document.getElementById('email').addEventListener('blur', function (e) {
        const email = e.target.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            mostrarErro('erroEmail', 'E-mail inválido.');
        } else {
            esconderErro('erroEmail');
        }
    });

    document.getElementById('telefone').addEventListener('input', function (e) {
        let telefone = e.target.value.replace(/\D/g, '');
        if (telefone.length > 11) {
            telefone = telefone.substring(0, 11);
        }
        if (telefone.length > 10) {
            telefone = telefone.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                '($1) $2-$3'
            );
        } else if (telefone.length > 6) {
            telefone = telefone.replace(
                /^(\d{2})(\d{4})(\d{4})$/,
                '($1) $2-$3'
            );
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/^(\d{2})(\d{4})$/, '($1) $2');
        }
        e.target.value = telefone;

        if (
            telefone.replace(/\D/g, '').length < 10 ||
            telefone.replace(/\D/g, '').length > 11
        ) {
            mostrarErro('erroTelefone', 'Telefone deve ter 10 ou 11 dígitos.');
        } else {
            esconderErro('erroTelefone');
        }
    });

    document.getElementById('cep').addEventListener('input', function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 8) {
            cep = cep.substring(0, 8);
        }
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        e.target.value = cep;

        if (cep.replace(/\D/g, '').length !== 8) {
            mostrarErro('erroCep', 'CEP deve ter 8 dígitos.');
        } else {
            esconderErro('erroCep');
        }
    });

    document.getElementById('uf').addEventListener('input', function (e) {
        const uf = e.target.value;
        const regex = /^[A-Za-zÀ-ú\s]{2}$/;
        if (!regex.test(uf)) {
            mostrarErro(
                'erroUf',
                'UF deve conter apenas letras e ter 2 caracteres.'
            );
        } else {
            esconderErro('erroUf');
        }
    });

    document.getElementById('cidade').addEventListener('input', function (e) {
        const cidade = e.target.value;
        const regex = /^[A-Za-zÀ-ú\s]{3,}$/;
        if (!regex.test(cidade)) {
            mostrarErro(
                'erroCidade',
                'Cidade deve conter apenas letras e no mínimo 3 caracteres.'
            );
        } else {
            esconderErro('erroCidade');
        }
    });

    document.getElementById('senha').addEventListener('input', function (e) {
        const senha = e.target.value;
        if (senha.length < 6) {
            mostrarErro(
                'erroSenha',
                'A senha deve ter no mínimo 6 caracteres.'
            );
        } else {
            esconderErro('erroSenha');
        }
    });

    document
        .getElementById('confirmarSenha')
        .addEventListener('input', function (e) {
            const senha = document.getElementById('senha').value;
            const confirmarSenha = e.target.value;
            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
            } else {
                esconderErro('erroConfirmarSenha');
            }
        });

    function mostrarErro(id, mensagem) {
        const erroElemento = document.getElementById(id);
        erroElemento.textContent = mensagem;
        erroElemento.style.display = 'block';
    }

    function esconderErro(id) {
        const erroElemento = document.getElementById(id);
        erroElemento.style.display = 'none';
    }

    function gerarMatriculaFuncionario() {
        const funcionarios =
            JSON.parse(localStorage.getItem('funcionarios')) || [];
        let ultimaMatricula = 0;

        if (funcionarios.length > 0) {
            ultimaMatricula =
                parseInt(funcionarios[funcionarios.length - 1].matricula, 10) ||
                0;
        }

        const novaMatricula = String(ultimaMatricula + 1).padStart(4, '0');
        return novaMatricula;
    }

    document
        .getElementById('cadastroFuncionarioForm')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            // Cria o objeto do funcionário já com o ID (correção principal)
            const funcionario = {
                id: Date.now().toString(), // <<--- Adicionado para garantir identificação única
                empresaRelacionamento: document.getElementById(
                    'empresaRelacionamento'
                ).value,
                empresa: document.getElementById('empresa').value,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
                dataNascimento: document.getElementById('dataNascimento').value,
                email: document.getElementById('email').value,
                telefone: document
                    .getElementById('telefone')
                    .value.replace(/\D/g, ''),
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                uf: document.getElementById('uf').value,
                cidade: document.getElementById('cidade').value,
                senha: document.getElementById('senha').value,
                matricula: document.getElementById('matricula').value,
            };

            const funcionarios =
                JSON.parse(localStorage.getItem('funcionarios')) || [];
            funcionarios.push(funcionario);
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

            document.getElementById('mensagemSucesso').style.display = 'block';
            setTimeout(() => {
                window.location.href = 'painel-funcionario.html';
            }, 2000);
        });
});

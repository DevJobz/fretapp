document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (empresa e matrícula)
    const empresaRelacionamento = localStorage.getItem('empresaRelacionamento') || 'Empresa XYZ';
    const matricula = gerarMatricula(); // Gera uma matrícula única

    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
    document.getElementById('matricula').value = matricula;

    // Formatação de CPF
    document.getElementById('cpf').addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Limita a 11 dígitos
        }
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        e.target.value = cpf;

        // Valida se o CPF tem 11 dígitos
        if (cpf.replace(/\D/g, '').length !== 11) {
            mostrarErro('erroCpf', 'CPF deve ter 11 dígitos.');
        } else {
            esconderErro('erroCpf');
        }
    });

    // Formatação de CEP
    document.getElementById('cep').addEventListener('input', function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 8) {
            cep = cep.substring(0, 8); // Limita a 8 dígitos
        }
        e.target.value = cep;

        // Valida se o CEP tem 8 dígitos
        if (cep.length !== 8) {
            mostrarErro('erroCep', 'CEP deve ter 8 dígitos.');
        } else {
            esconderErro('erroCep');
        }
    });

    // Validação de Senha (mínimo 6 caracteres)
    document.getElementById('senha').addEventListener('input', function (e) {
        const senha = e.target.value;
        if (senha.length < 6) {
            mostrarErro('erroSenha', 'A senha deve ter no mínimo 6 caracteres.');
        } else {
            esconderErro('erroSenha');
        }
    });

    // Validação de Confirmação de Senha
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

    // Submissão do formulário
    document
        .getElementById('cadastroFuncionarioForm')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            // Verifica se todos os campos obrigatórios estão preenchidos
            const camposObrigatorios = document.querySelectorAll(
                'input[required], select[required]'
            );
            let formularioValido = true;

            camposObrigatorios.forEach((campo) => {
                if (!campo.value) {
                    mostrarErro(
                        `erro${
                            campo.name.charAt(0).toUpperCase() +
                            campo.name.slice(1)
                        }`,
                        'Este campo é obrigatório.'
                    );
                    formularioValido = false;
                }
            });

            if (!formularioValido) {
                return;
            }

            // Verifica se o CPF, e-mail e telefone já estão cadastrados
            const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
            const email = document.getElementById('email').value;
            const telefone = document
                .getElementById('telefone')
                .value.replace(/\D/g, '');
            const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
            const cpfExistente = funcionarios.find(
                (funcionario) => funcionario.cpf === cpf
            );
            const emailExistente = funcionarios.find(
                (funcionario) => funcionario.email === email
            );
            const telefoneExistente = funcionarios.find(
                (funcionario) => funcionario.telefone === telefone
            );

            if (cpfExistente) {
                mostrarErro('erroCpf', 'CPF já cadastrado.');
                return;
            }

            if (emailExistente) {
                mostrarErro('erroEmail', 'E-mail já cadastrado.');
                return;
            }

            if (telefoneExistente) {
                mostrarErro('erroTelefone', 'Telefone já cadastrado.');
                return;
            }

            // Cria o objeto do funcionário
            const funcionario = {
                empresaRelacionamento: document.getElementById(
                    'empresaRelacionamento'
                ).value,
                matricula: document.getElementById('matricula').value,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                cpf: cpf,
                dataNascimento: document.getElementById('dataNascimento').value,
                email: email,
                telefone: telefone,
                endereco: {
                    cep: document.getElementById('cep').value,
                    rua: document.getElementById('rua').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value,
                    uf: document.getElementById('uf').value,
                    cidade: document.getElementById('cidade').value,
                },
                senha: document.getElementById('senha').value,
            };

            // Adiciona o funcionário ao localStorage
            funcionarios.push(funcionario);
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

            // Exibe a mensagem de sucesso
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            mensagemSucesso.style.display = 'block';

            // Limpa o formulário após 2 segundos e redireciona para o login
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
                document.getElementById('cadastroFuncionarioForm').reset();
                window.location.href = 'login.html';
            }, 2000);
        });

    // Função para gerar matrícula única
    function gerarMatricula() {
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        let ultimaMatricula = 0;

        // Encontra a última matrícula cadastrada
        if (funcionarios.length > 0) {
            ultimaMatricula = parseInt(
                funcionarios[funcionarios.length - 1].matricula,
                10
            );
        }

        // Gera a nova matrícula
        const novaMatricula = String(ultimaMatricula + 1).padStart(4, '0');
        return novaMatricula;
    }

    // Função para mostrar mensagens de erro
    function mostrarErro(id, mensagem) {
        const erroElemento = document.getElementById(id);
        erroElemento.textContent = mensagem;
        erroElemento.style.display = 'block';
    }

    // Função para esconder mensagens de erro
    function esconderErro(id) {
        const erroElemento = document.getElementById(id);
        erroElemento.style.display = 'none';
    }
});

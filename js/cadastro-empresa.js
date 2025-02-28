document.addEventListener('DOMContentLoaded', function () {
    // Formatação de CPF
    document.getElementById('cpfGestor').addEventListener('input', function (e) {
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
            mostrarErro('erroCpfGestor', 'CPF deve ter 11 dígitos.');
        } else {
            esconderErro('erroCpfGestor');
        }
    });

    // Formatação de CNPJ
    document.getElementById('cnpj').addEventListener('input', function (e) {
        let cnpj = e.target.value.replace(/\D/g, '');
        if (cnpj.length > 14) {
            cnpj = cnpj.substring(0, 14); // Limita a 14 dígitos
        }
        if (cnpj.length > 12) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        } else if (cnpj.length > 8) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cnpj.length > 5) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})$/, '$1.$2');
        }
        e.target.value = cnpj;

        // Valida se o CNPJ tem 14 dígitos
        if (cnpj.replace(/\D/g, '').length !== 14) {
            mostrarErro('erroCnpj', 'CNPJ deve ter 14 dígitos.');
        } else {
            esconderErro('erroCnpj');
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
        .getElementById('cadastroEmpresaForm')
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

            // Verifica se o CPF, CNPJ, e-mail e telefone já estão cadastrados
            const cpf = document.getElementById('cpfGestor').value.replace(/\D/g, '');
            const cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');
            const email = document.getElementById('email').value;
            const telefone = document
                .getElementById('telefone')
                .value.replace(/\D/g, '');
            const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
            const cpfExistente = empresas.find(
                (empresa) => empresa.cpfGestor === cpf
            );
            const cnpjExistente = empresas.find(
                (empresa) => empresa.cnpj === cnpj
            );
            const emailExistente = empresas.find(
                (empresa) => empresa.email === email
            );
            const telefoneExistente = empresas.find(
                (empresa) => empresa.telefone === telefone
            );

            if (cpfExistente) {
                mostrarErro('erroCpfGestor', 'CPF já cadastrado.');
                return;
            }

            if (cnpjExistente) {
                mostrarErro('erroCnpj', 'CNPJ já cadastrado.');
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

            // Cria o objeto da empresa
            const empresa = {
                nomeGestor: document.getElementById('nomeGestor').value,
                cpfGestor: cpf,
                email: email,
                telefone: telefone,
                nomeFantasia: document.getElementById('nomeFantasia').value,
                cnpj: cnpj,
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

            // Adiciona a empresa ao localStorage
            empresas.push(empresa);
            localStorage.setItem('empresas', JSON.stringify(empresas));

            // Salva o nome fantasia para uso posterior
            localStorage.setItem('empresaRelacionamento', empresa.nomeFantasia);

            // Exibe a mensagem de sucesso
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            mensagemSucesso.style.display = 'block';

            // Limpa o formulário após 2 segundos e redireciona para o login
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
                document.getElementById('cadastroEmpresaForm').reset();
                window.location.href = 'login.html';
            }, 2000);
        });

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

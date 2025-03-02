document.addEventListener('DOMContentLoaded', function () {
    // Função para mostrar mensagens de erro
    function mostrarErro(id, mensagem) {
        const erroElemento = document.getElementById(id);
        if (erroElemento) {
            erroElemento.textContent = mensagem;
            erroElemento.style.display = 'block';
        }
    }

    // Função para esconder mensagens de erro
    function esconderErro(id) {
        const erroElemento = document.getElementById(id);
        if (erroElemento) {
            erroElemento.style.display = 'none';
        }
    }

    // Função para formatar CPF
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        return cpf;
    }

    // Função para formatar CNPJ
    function formatarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length > 14) cnpj = cnpj.substring(0, 14);
        if (cnpj.length > 12) {
            cnpj = cnpj.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                '$1.$2.$3/$4-$5'
            );
        } else if (cnpj.length > 8) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cnpj.length > 5) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})$/, '$1.$2');
        }
        return cnpj;
    }

    // Função para formatar Telefone
    function formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
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
        return telefone;
    }

    // Função para formatar CEP
    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 8) cep = cep.substring(0, 8);
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        return cep;
    }

    // Validação de Confirmação de Senha
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    if (confirmarSenhaInput) {
        confirmarSenhaInput.addEventListener('input', function (e) {
            const senha = document.getElementById('senha').value;
            const confirmarSenha = e.target.value;

            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
            } else {
                esconderErro('erroConfirmarSenha');
            }
        });
    } else {
        console.error('Campo de confirmação de senha não encontrado!');
    }

    // Formatação de CPF
    const cpfGestorInput = document.getElementById('cpfGestor');
    if (cpfGestorInput) {
        cpfGestorInput.addEventListener('input', function (e) {
            e.target.value = formatarCPF(e.target.value);
            if (e.target.value.replace(/\D/g, '').length !== 11) {
                mostrarErro('erroCpfGestor', 'CPF deve ter 11 dígitos.');
            } else {
                esconderErro('erroCpfGestor');
            }
        });
    } else {
        console.error('Campo de CPF não encontrado!');
    }

    // Formatação de CNPJ
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function (e) {
            e.target.value = formatarCNPJ(e.target.value);
            if (e.target.value.replace(/\D/g, '').length !== 14) {
                mostrarErro('erroCnpj', 'CNPJ deve ter 14 dígitos.');
            } else {
                esconderErro('erroCnpj');
            }
        });
    } else {
        console.error('Campo de CNPJ não encontrado!');
    }

    // Formatação de Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            e.target.value = formatarTelefone(e.target.value);
            const telefoneNumerico = e.target.value.replace(/\D/g, '');
            if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
                mostrarErro(
                    'erroTelefone',
                    'Telefone deve ter 10 ou 11 dígitos.'
                );
            } else {
                esconderErro('erroTelefone');
            }
        });
    } else {
        console.error('Campo de Telefone não encontrado!');
    }

    // Formatação de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            e.target.value = formatarCEP(e.target.value);
            if (e.target.value.replace(/\D/g, '').length !== 8) {
                mostrarErro('erroCep', 'CEP deve ter 8 dígitos.');
            } else {
                esconderErro('erroCep');
            }
        });
    } else {
        console.error('Campo de CEP não encontrado!');
    }

    // Validação de Nome do Gestor
    const nomeGestorInput = document.getElementById('nomeGestor');
    if (nomeGestorInput) {
        nomeGestorInput.addEventListener('input', function (e) {
            const nomeGestor = e.target.value;
            const regex = /^[A-Za-zÀ-ú\s]{8,}$/;
            if (!regex.test(nomeGestor)) {
                mostrarErro(
                    'erroNomeGestor',
                    'Nome deve conter apenas letras e no mínimo 8 caracteres.'
                );
            } else {
                esconderErro('erroNomeGestor');
            }
        });
    } else {
        console.error('Campo de Nome do Gestor não encontrado!');
    }

    // Validação de Nome Fantasia
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    if (nomeFantasiaInput) {
        nomeFantasiaInput.addEventListener('input', function (e) {
            const nomeFantasia = e.target.value;
            const regex = /^[A-Za-zÀ-ú0-9\s]{8,}$/;
            if (!regex.test(nomeFantasia)) {
                mostrarErro(
                    'erroNomeFantasia',
                    'Nome fantasia deve conter no mínimo 8 caracteres.'
                );
            } else {
                esconderErro('erroNomeFantasia');
            }
        });
    } else {
        console.error('Campo de Nome Fantasia não encontrado!');
    }

    // Validação de Estado e Cidade
    const ufInput = document.getElementById('uf');
    if (ufInput) {
        ufInput.addEventListener('input', function (e) {
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
    } else {
        console.error('Campo de UF não encontrado!');
    }

    const cidadeInput = document.getElementById('cidade');
    if (cidadeInput) {
        cidadeInput.addEventListener('input', function (e) {
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
    } else {
        console.error('Campo de Cidade não encontrado!');
    }

    // Validação de E-mail
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function (e) {
            const email = e.target.value;
            const empresasCadastradas =
                JSON.parse(localStorage.getItem('empresasCadastradas')) || [];
            const emailExistente = empresasCadastradas.some(
                (empresa) => empresa.email === email
            );
            if (emailExistente) {
                mostrarErro('erroEmail', 'E-mail já cadastrado.');
            } else {
                esconderErro('erroEmail');
            }
        });
    } else {
        console.error('Campo de E-mail não encontrado!');
    }

    // Validação de Senha
    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        senhaInput.addEventListener('input', function (e) {
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
    } else {
        console.error('Campo de Senha não encontrado!');
    }

    // Submissão do formulário
    const cadastroEmpresaForm = document.getElementById('cadastroEmpresaForm');
    if (cadastroEmpresaForm) {
        cadastroEmpresaForm.addEventListener('submit', function (e) {
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

            // Verifica se as senhas coincidem
            const senha = document.getElementById('senha').value;
            const confirmarSenha =
                document.getElementById('confirmarSenha').value;
            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
                return;
            }

            const novaEmpresaGestor = {
                nomeGestor: document.getElementById('nomeGestor').value,
                cpfGestor: document
                    .getElementById('cpfGestor')
                    .value.replace(/\D/g, ''),
                email: document.getElementById('email').value,
                telefone: document
                    .getElementById('telefone')
                    .value.replace(/\D/g, ''),
                nomeFantasia: document.getElementById('nomeFantasia').value,
                cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),
                endereco: {
                    cep: document
                        .getElementById('cep')
                        .value.replace(/\D/g, ''),
                    rua: document.getElementById('rua').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value,
                    uf: document.getElementById('uf').value,
                    cidade: document.getElementById('cidade').value,
                },
                senha: document.getElementById('senha').value, // Certifique-se de que a senha está sendo salva
                instituicoes: [], // Inicializa a array vazia
                empresasCadastradas: [], // Inicializa a array vazia
            };

            // Recupera a lista de empresasGestor do localStorage
            const empresasGestor =
                JSON.parse(localStorage.getItem('empresasGestor')) || [];

            // Verifica se o CNPJ ou e-mail já estão cadastrados
            const cnpjExistente = empresasGestor.some(
                (empresa) => empresa.cnpj === novaEmpresaGestor.cnpj
            );
            const emailExistente = empresasGestor.some(
                (empresa) => empresa.email === novaEmpresaGestor.email
            );

            if (cnpjExistente) {
                alert('CNPJ já cadastrado.');
                return;
            }

            if (emailExistente) {
                alert('E-mail já cadastrado.');
                return;
            }

            // Adiciona a nova empresaGestor à lista
            empresasGestor.push(novaEmpresaGestor);

            // Salva a lista atualizada no localStorage
            localStorage.setItem(
                'empresasGestor',
                JSON.stringify(empresasGestor)
            );

            // Define a empresa ativa (apenas o identificador)
            localStorage.setItem(
                'empresaAtiva',
                JSON.stringify({ email: novaEmpresaGestor.email })
            );

            // Exibe mensagem de sucesso e redireciona
            alert('Empresa cadastrada com sucesso!');
            window.location.href = 'painel-gestor-empresa.html';
        });
    } else {
        console.error('Formulário de cadastro não encontrado!');
    }
});

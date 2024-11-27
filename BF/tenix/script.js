// Função para buscar os tênis do servidor (GET)
async function buscarTenis() {
    try {
        const response = await fetch("http://localhost:8080/api/tenis");  // Requisição GET para buscar todos os tênis
        if (response.ok) {
            const tenis = await response.json();  // Converte a resposta JSON em um array de tênis
            exibirTenis(tenis);  // Passa os dados dos tênis para a função que vai exibir na tela
        } else {
            console.error("Erro ao buscar tênis:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

// Função para exibir os tênis no HTML
function exibirTenis(tenis) {
    const container = document.getElementById("produtosContainer");  // Encontra o container onde os tênis serão exibidos

    // Verifica se há tênis e exibe ou esconde o container
    if (tenis.length === 0) {
        container.style.display = "none";  // Se não houver tênis, esconde o container
    } else {
        container.style.display = "block";  // Se houver tênis, exibe o container
        container.innerHTML = "";  // Limpa o conteúdo anterior

        // Cria uma div para cada tênis
        tenis.forEach((tenis) => {
            const divQuadrado = document.createElement('div');
            divQuadrado.className = 'quadrados';
            divQuadrado.id = `produto-${tenis.id}`;  // Usando o ID real do produto

            const img = document.createElement('img');
            img.src = tenis.img;
            img.alt = tenis.nome;
            img.className = 'pumafoto';

            const pNome = document.createElement('p');
            pNome.className = 'nome';
            pNome.textContent = tenis.nome;

            const h2Preco = document.createElement('h2');
            h2Preco.className = 'preco';
            h2Preco.textContent = `R$ ${tenis.preco.toFixed(2)}`;

            const divBotoes = document.createElement('div');
            divBotoes.className = 'botoes';

            // Botão de Modificar
            const btnModificar = document.createElement('button');
            btnModificar.className = 'botao modificar';
            btnModificar.textContent = 'Modificar';

            // Adicionar evento para modificar
            btnModificar.addEventListener("click", function() {
                document.getElementById("novoNome").value = tenis.nome;
                document.getElementById("novoPreco").value = tenis.preco;
                document.getElementById("novoImagem").value = tenis.img;  // Preenche o campo de imagem
                document.getElementById("popup").style.display = "block";
                document.getElementById("salvarButton").dataset.quadradoId = divQuadrado.id;  // Armazena o ID do quadrado
                // Salva a referência ao produto para atualização
                divQuadrado.dataset.nomeOriginal = tenis.nome;
                divQuadrado.dataset.precoOriginal = tenis.preco;
                divQuadrado.dataset.imagemOriginal = tenis.img;
            });

            // Botão de Excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'botao excluir';
            btnExcluir.textContent = 'Excluir';

            btnExcluir.addEventListener("click", function() {
                const confirmacao = confirm("Você tem certeza que deseja excluir este produto?");
                if (confirmacao) {
                    excluirTennis(tenis.id, divQuadrado);
                }
            });

            divBotoes.appendChild(btnModificar);
            divBotoes.appendChild(btnExcluir);

            divQuadrado.appendChild(img);
            divQuadrado.appendChild(pNome);
            divQuadrado.appendChild(h2Preco);
            divQuadrado.appendChild(divBotoes);

            container.appendChild(divQuadrado);
        });
    }
}

// Função para excluir um tênis via DELETE
async function excluirTennis(id, divQuadrado) {
    try {
        const response = await fetch(`http://localhost:8080/api/tenis/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Tênis excluído com sucesso!");
            divQuadrado.remove();  // Remove o item da interface
        } else {
            alert("Erro ao excluir o tênis.");
        }
    } catch (error) {
        console.error("Erro ao excluir o tênis:", error);
        alert("Erro de conexão ao tentar excluir o tênis.");
    }
}

// Função para adicionar um novo tênis via POST
async function adicionarTennis(nome, preco, img) {
    try {
        const response = await fetch("http://localhost:8080/api/tenis/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                preco: parseFloat(preco),
                img: img
            })
        });

        if (response.ok) {
            alert("Tênis adicionado com sucesso!");
            buscarTenis();  // Recarrega a lista de tênis
        } else {
            alert("Erro ao adicionar o tênis.");
        }
    } catch (error) {
        console.error("Erro ao adicionar o tênis:", error);
        alert("Erro de conexão ao tentar adicionar o tênis.");
    }
}

// Função para atualizar um tênis via PUT
async function atualizarTennis(id, nome, preco, img) {
    try {
        const response = await fetch(`http://localhost:8080/api/tenis/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                preco: parseFloat(preco),
                img: img
            })
        });

        if (response.ok) {
            alert("Tênis atualizado com sucesso!");
            buscarTenis();  // Recarrega a lista de tênis
            document.getElementById("popup").style.display = "none";  // Fecha o popup
        } else {
            alert("Erro ao atualizar o tênis.");
        }
    } catch (error) {
        console.error("Erro ao atualizar o tênis:", error);
        alert("Erro de conexão ao tentar atualizar o tênis.");
    }
}

// Listener para o botão de "Adicionar Tênis"
document.querySelector(".novo").addEventListener("click", function() {
    const nome = prompt("Digite o nome do tênis:");
    const preco = prompt("Digite o preço do tênis:");
    const img = prompt("Digite o caminho da imagem:");

    if (nome && preco && img) {
        adicionarTennis(nome, preco, img);
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

// Listener para o botão de "Salvar" no popup de edição
document.getElementById("salvarButton").addEventListener("click", function() {
    const novoNome = document.getElementById("novoNome").value;
    const novoPreco = document.getElementById("novoPreco").value;
    const novoImagem = document.getElementById("novoImagem").value;  // Captura a imagem modificada
    const id = this.dataset.quadradoId;  // Pega o ID do tênis a ser atualizado

    if (novoNome && novoPreco) {
        atualizarTennis(id, novoNome, novoPreco, novoImagem);  // Atualiza o tênis com a nova imagem
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

// Listener para o botão de "Fechar" no popup de edição
document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";  // Fecha o popup sem salvar
});

// Chama a função para buscar e exibir os tênis ao carregar a página
buscarTenis();

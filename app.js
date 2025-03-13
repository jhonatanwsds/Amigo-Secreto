let nomes = [];

function adicionarAmigo() {
    let input = document.getElementById("amigo"); // Pega o campo de input
    let nome = input.value.trim(); // Remove espaços extras no início e fim

    if (nome === "") { // Verifica se o campo está vazio
        alert("Por favor, insira um nome válido!"); // Exibe um alerta se o campo estiver vazio
        return; // Sai da função se o nome for vazio
    }

    nomes.push(nome); // Adiciona o nome ao array de nomes

    atualizarLista(); // Atualiza a lista de amigos visível na tela

    input.value = ""; // Limpa o campo de entrada para o próximo nome
}

function atualizarLista() {
    let lista = document.getElementById("listaAmigos"); // Pega a <ul> onde vamos mostrar os nomes
    lista.innerHTML = ""; // Limpa a lista antes de adicionar novos nomes

    // Para cada nome no array, cria um <li> e adiciona na lista
    nomes.forEach(nome => {
        let li = document.createElement("li"); // Cria um novo item <li>
        li.textContent = nome; // Define o texto do <li> com o nome
        lista.appendChild(li); // Adiciona o <li> à <ul>
    });
}

function sortearAmigo() {
    if (nomes.length === 0) { // Verifica se não há nomes na lista
        alert("Adicione pelo menos um nome antes de sortear!"); // Exibe alerta se a lista estiver vazia
        return; // Sai da função se não houver nomes
    }

    let indiceSorteado = Math.floor(Math.random() * nomes.length); // Gera um número aleatório para o índice
    let nomeSorteado = nomes[indiceSorteado]; // Pega o nome sorteado

    let resultado = document.getElementById("resultado"); // Pega o <ul> para exibir o resultado
    resultado.innerHTML = `<li>🎉 O amigo secreto é: ${nomeSorteado} 🎉</li>`; // Exibe o nome sorteado
}

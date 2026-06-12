const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnLimparTudo = document.getElementById("btnLimparTudo");
const mensagem = document.getElementById("mensagem");
const listaTarefas = document.getElementById("listaTarefas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Converte tarefas antigas (salvas como texto) para o novo formato
tarefas = tarefas.map((tarefa) => {
  if (typeof tarefa === "string") {
    return {
      texto: tarefa,
      concluida: false
    };
  }
  return tarefa;
});

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function exibirMensagem(texto, tipo) {
  mensagem.className = "mt-3 fw-bold";
  mensagem.textContent = texto;

  if (tipo === "erro") {
    mensagem.classList.add("text-danger");
  } else {
    mensagem.classList.add("text-success");
  }
}

function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa, indice) => {
    const item = document.createElement("li");
    item.className = "list-group-item";

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    if (tarefa.concluida) {
      texto.classList.add("tarefa-concluida");
    }

    const grupoBotoes = document.createElement("div");
    grupoBotoes.className = "d-flex gap-2";

    const botaoConcluir = document.createElement("button");

    botaoConcluir.className = tarefa.concluida
      ? "btn btn-sm btn-success"
      : "btn btn-sm btn-outline-success";

    botaoConcluir.textContent = tarefa.concluida
      ? "Concluída"
      : "Concluir";

    botaoConcluir.addEventListener("click", () => {
      alternarConclusao(indice);
    });

    const botaoRemover = document.createElement("button");
    botaoRemover.className = "btn btn-sm btn-outline-danger";
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", () => {
      removerTarefa(indice);
    });

    grupoBotoes.appendChild(botaoConcluir);
    grupoBotoes.appendChild(botaoRemover);

    item.appendChild(texto);
    item.appendChild(grupoBotoes);

    listaTarefas.appendChild(item);
  });
}

function adicionarTarefa() {
  const novaTarefa = inputTarefa.value.trim();

  if (novaTarefa === "") {
    exibirMensagem("Digite uma tarefa antes de adicionar.", "erro");
    return;
  }

  tarefas.push({
    texto: novaTarefa,
    concluida: false
  });

  salvarTarefas();
  renderizarTarefas();

  inputTarefa.value = "";

  exibirMensagem("Tarefa adicionada com sucesso.", "sucesso");
}

function alternarConclusao(indice) {
  tarefas[indice].concluida = !tarefas[indice].concluida;

  salvarTarefas();
  renderizarTarefas();

  exibirMensagem("Status da tarefa atualizado.", "sucesso");
}

function removerTarefa(indice) {
  tarefas.splice(indice, 1);

  salvarTarefas();
  renderizarTarefas();

  exibirMensagem("Tarefa removida com sucesso.", "sucesso");
}

function limparTudo() {
  tarefas = [];

  localStorage.removeItem("tarefas");

  renderizarTarefas();

  exibirMensagem("Todas as tarefas foram removidas.", "sucesso");
}

btnAdicionar.addEventListener("click", adicionarTarefa);

btnLimparTudo.addEventListener("click", limparTudo);

inputTarefa.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    adicionarTarefa();
  }
});

// Exibe as tarefas salvas ao abrir a página
renderizarTarefas();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}
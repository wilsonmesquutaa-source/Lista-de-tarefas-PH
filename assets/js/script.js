const inputTarefa = document.getElementById("inputTarefa");
const inputQuantidade = document.getElementById("inputQuantidade");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnLimparTudo = document.getElementById("btnLimparTudo");
const btnRestaurar = document.getElementById("btnRestaurar");

const mensagem = document.getElementById("mensagem");
const listaTarefas = document.getElementById("listaTarefas");

const totalItens = document.getElementById("totalItens");
const totalPendentes = document.getElementById("totalPendentes");
const totalFalta = document.getElementById("totalFalta");
const totalConcluidas = document.getElementById("totalConcluidas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let backupTarefas = [];

tarefas = tarefas.map((tarefa) => {

  if (typeof tarefa === "string") {
    return {
      texto: tarefa,
      quantidade: 1,
      concluida: false,
      emFalta: false
    };
  }

  return {
    texto: tarefa.texto,
    quantidade: tarefa.quantidade || 1,
    concluida: tarefa.concluida || false,
    emFalta: tarefa.emFalta || false
  };
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

function atualizarContadores() {

  totalItens.textContent = tarefas.length;

  totalConcluidas.textContent =
    tarefas.filter(t => t.concluida).length;

  totalFalta.textContent =
    tarefas.filter(t => t.emFalta).length;

  totalPendentes.textContent =
    tarefas.filter(
      t => !t.concluida && !t.emFalta
    ).length;
}

function ordenarTarefas() {

  tarefas.sort((a, b) => {

    const peso = (item) => {

      if (!item.concluida && !item.emFalta) return 1;
      if (item.emFalta) return 2;
      if (item.concluida) return 3;

      return 4;
    };

    return peso(a) - peso(b);
  });
}

function renderizarTarefas() {

  ordenarTarefas();

  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa, indice) => {

    const item = document.createElement("li");
    item.className = "list-group-item";

    const texto = document.createElement("span");
    texto.textContent =
      `${tarefa.texto} (${tarefa.quantidade})`;

    if (tarefa.concluida) {
      texto.classList.add("tarefa-concluida");
    }

    if (tarefa.emFalta) {
      texto.classList.add("tarefa-em-falta");
    }

    const grupoBotoes = document.createElement("div");
    grupoBotoes.className = "d-flex gap-2 flex-wrap";

    const btnConcluir = document.createElement("button");

    btnConcluir.className = tarefa.concluida
      ? "btn btn-success btn-sm"
      : "btn btn-outline-success btn-sm";

    btnConcluir.textContent = "✅";

    btnConcluir.addEventListener("click", () => {
      alternarConclusao(indice);
    });

    const btnFalta = document.createElement("button");

    btnFalta.className = tarefa.emFalta
      ? "btn btn-warning btn-sm"
      : "btn btn-outline-warning btn-sm";

    btnFalta.textContent = "⚠️";

    btnFalta.addEventListener("click", () => {
      alternarEmFalta(indice);
    });

    const btnRemover = document.createElement("button");

    btnRemover.className =
      "btn btn-outline-danger btn-sm";

    btnRemover.textContent = "🗑️";

    btnRemover.addEventListener("click", () => {
      removerTarefa(indice);
    });

    grupoBotoes.appendChild(btnConcluir);
    grupoBotoes.appendChild(btnFalta);
    grupoBotoes.appendChild(btnRemover);

    item.appendChild(texto);
    item.appendChild(grupoBotoes);

    listaTarefas.appendChild(item);
  });

  atualizarContadores();
}

function adicionarTarefa() {

  const texto = inputTarefa.value.trim();
  const quantidade =
    parseInt(inputQuantidade.value) || 1;

  if (texto === "") {

    exibirMensagem(
      "Digite um produto.",
      "erro"
    );

    return;
  }

  tarefas.push({
    texto,
    quantidade,
    concluida: false,
    emFalta: false
  });

  salvarTarefas();

  renderizarTarefas();

  inputTarefa.value = "";
  inputQuantidade.value = 1;

  exibirMensagem(
    "Produto adicionado.",
    "sucesso"
  );
}

function alternarConclusao(indice) {

  tarefas[indice].concluida =
    !tarefas[indice].concluida;

  if (tarefas[indice].concluida) {
    tarefas[indice].emFalta = false;
  }

  salvarTarefas();
  renderizarTarefas();
}

function alternarEmFalta(indice) {

  tarefas[indice].emFalta =
    !tarefas[indice].emFalta;

  if (tarefas[indice].emFalta) {
    tarefas[indice].concluida = false;
  }

  salvarTarefas();
  renderizarTarefas();
}

function removerTarefa(indice) {

  tarefas.splice(indice, 1);

  salvarTarefas();
  renderizarTarefas();
}

function limparTudo() {

  backupTarefas = [...tarefas];

  tarefas = [];

  salvarTarefas();

  renderizarTarefas();

  btnRestaurar.classList.remove("d-none");

  exibirMensagem(
    "Lista apagada.",
    "sucesso"
  );
}

function restaurarLista() {

  tarefas = [...backupTarefas];

  salvarTarefas();

  renderizarTarefas();

  btnRestaurar.classList.add("d-none");

  exibirMensagem(
    "Lista restaurada.",
    "sucesso"
  );
}

btnAdicionar.addEventListener(
  "click",
  adicionarTarefa
);

btnLimparTudo.addEventListener(
  "click",
  limparTudo
);

btnRestaurar.addEventListener(
  "click",
  restaurarLista
);

inputTarefa.addEventListener(
  "keydown",
  (evento) => {

    if (evento.key === "Enter") {
      adicionarTarefa();
    }
  }
);

renderizarTarefas();

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker.register(
      "./service-worker.js"
    );
  });
}

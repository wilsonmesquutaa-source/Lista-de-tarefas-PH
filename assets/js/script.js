const inputTarefa =
document.getElementById("inputTarefa");

const inputQuantidade =
document.getElementById("inputQuantidade");


const btnAdicionar =
document.getElementById("btnAdicionar");

const btnLimparTudo =
document.getElementById("btnLimparTudo");

const btnRestaurar =
document.getElementById("btnRestaurar");


const mensagem =
document.getElementById("mensagem");


const listaTarefas =
document.getElementById("listaTarefas");


const totalItens =
document.getElementById("totalItens");

const totalPendentes =
document.getElementById("totalPendentes");

const totalFalta =
document.getElementById("totalFalta");

const totalConcluidas =
document.getElementById("totalConcluidas");



let tarefas =
JSON.parse(localStorage.getItem("tarefas")) || [];


let backupTarefas = [];



tarefas = tarefas.map(tarefa => {


if(typeof tarefa === "string"){

return {

texto:tarefa,

quantidade:1,

concluida:false,

emFalta:false

};

}


return {

texto:tarefa.texto,

quantidade:tarefa.quantidade || 1,

concluida:tarefa.concluida || false,

emFalta:tarefa.emFalta || false

};


});





function salvarTarefas(){

localStorage.setItem(

"tarefas",

JSON.stringify(tarefas)

);

}





function atualizarContadores(){


totalItens.textContent =
tarefas.length;


totalConcluidas.textContent =

tarefas.filter(
t=>t.concluida
).length;



totalFalta.textContent =

tarefas.filter(
t=>t.emFalta
).length;



totalPendentes.textContent =

tarefas.filter(

t=>!t.concluida && !t.emFalta

).length;


}





function ordenarTarefas(){


tarefas.sort((a,b)=>{


function peso(item){


if(!item.concluida && !item.emFalta)
return 1;


if(item.emFalta)
return 2;


return 3;


}


return peso(a)-peso(b);


});


}






function renderizarTarefas(){


ordenarTarefas();


listaTarefas.innerHTML="";



tarefas.forEach((tarefa,index)=>{


const item =
document.createElement("li");


item.className =
"list-group-item";



const texto =
document.createElement("span");


texto.className =
"item-texto";



texto.textContent =

`${tarefa.texto} (${tarefa.quantidade})`;




if(tarefa.concluida)

texto.classList.add(
"tarefa-concluida"
);



if(tarefa.emFalta)

texto.classList.add(
"tarefa-em-falta"
);





const grupo =
document.createElement("div");


grupo.className =
"grupo-acoes";





const concluir =
document.createElement("button");


concluir.className =

"botao-acao botao-concluir";


concluir.title =
"Concluir";


concluir.textContent =
"✓";



concluir.onclick = ()=>{

alternarConclusao(index);

};







const falta =
document.createElement("button");


falta.className =

"botao-acao botao-falta";


falta.title =
"Em falta";


falta.textContent =
"!";



falta.onclick = ()=>{

alternarEmFalta(index);

};








const remover =
document.createElement("button");


remover.className =

"botao-acao botao-remover";


remover.title =
"Remover";


remover.textContent =
"🗑";



remover.onclick = ()=>{

removerTarefa(index);

};







grupo.appendChild(concluir);

grupo.appendChild(falta);

grupo.appendChild(remover);




item.appendChild(texto);

item.appendChild(grupo);



listaTarefas.appendChild(item);



});



atualizarContadores();


}






function adicionarTarefa(){


const nome =
inputTarefa.value.trim();



const quantidade =
parseInt(inputQuantidade.value)||1;



if(nome===""){

mensagem.textContent =
"Digite um produto.";

return;

}



tarefas.push({

texto:nome,

quantidade,

concluida:false,

emFalta:false

});



salvarTarefas();


renderizarTarefas();



inputTarefa.value="";

inputQuantidade.value=1;



}







function alternarConclusao(index){


tarefas[index].concluida =

!tarefas[index].concluida;



if(tarefas[index].concluida)

tarefas[index].emFalta=false;



salvarTarefas();

renderizarTarefas();


}





function alternarEmFalta(index){


tarefas[index].emFalta =

!tarefas[index].emFalta;



if(tarefas[index].emFalta)

tarefas[index].concluida=false;



salvarTarefas();

renderizarTarefas();


}






function removerTarefa(index){


tarefas.splice(index,1);


salvarTarefas();


renderizarTarefas();


}






function limparTudo(){


backupTarefas =
[...tarefas];


tarefas=[];


salvarTarefas();


renderizarTarefas();


btnRestaurar.classList.remove(
"d-none"
);


}





function restaurarLista(){


tarefas =
[...backupTarefas];


salvarTarefas();


renderizarTarefas();


btnRestaurar.classList.add(
"d-none"
);


}







btnAdicionar.onclick =
adicionarTarefa;



btnLimparTudo.onclick =
limparTudo;



btnRestaurar.onclick =
restaurarLista;





inputTarefa.addEventListener(
"keydown",
e=>{

if(e.key==="Enter")

adicionarTarefa();

});





renderizarTarefas();

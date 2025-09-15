// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseTotal = document.querySelector("header h2") 
const expenseQuantity = document.querySelector("header p span")

//Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // obtém o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")
  //Transforma o valor em centavos 
  value = Number(value) / 100
  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
  // Formata o valor no padrão BRL 
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL", 
  })
  // Retorna o valor formatado.
  return value
}

//Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: Number(amount.value.replace(/\D/g, "")) / 100, // valor numérico
    created_at: new Date(),
  }

  expenseAdd(newExpense)

  // Limpa o formulário
  form.reset()

  // Reaplica o placeholder no campo de valor
  amount.value = ""
  amount.placeholder = "R$ 0,00"

  // Foca de volta no campo "Nome da despesa"
  expense.focus()
}

//Adiciona um novo item na lista.
function expenseAdd(newExpense){
  try{
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    expenseInfo.append(expenseName, expenseCategory)

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")

    // salva o valor bruto (número) em um atributo data
    expenseAmount.dataset.amount = newExpense.amount 

    // exibe o valor formatado
    expenseAmount.textContent = formatCurrencyBRL(newExpense.amount)

    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    expenseList.append(expenseItem)

    updateTotais()
      
  } catch(error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}


//Atualiza os totais.
function updateTotais(){
  try {
    const items = expenseList.children
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas": "despesa"}`

    let total = 0

    for(let item of items){
      const itemAmount = item.querySelector(".expense-amount")

      // pega o valor numérico salvo no dataset
      let value = parseFloat(itemAmount.dataset.amount)

      if(isNaN(value)){
        throw new Error("Valor inválido encontrado")
      }

      total += value
    }

    expenseTotal.textContent = formatCurrencyBRL(total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais")
  }
}

//Evento que captura o clique nos items da lista.
expenseList.addEventListener("click", function(event) {
  // Verificar se o elemento clicado é o ícone de remover
  if(event.target.classList.contains("remove-icon")){
    //Obtem a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    
    //Remove o item da lista.
    item.remove()
  }
  //Atualiza os totais.
  updateTotais()
})

const selectTemas = document.getElementById('temasDisponibles')
const exam = document.getElementById('exam')
let units = {}

function mostrarRespuestas() {
  const respuestas = exam.querySelectorAll('input')
  const selectedUnit = units[selectTemas.value]
}

function comprobarResultado() {
  const respuestas = exam.querySelectorAll('input')
  const selectedUnit = units[selectTemas.value]
  respuestas.forEach((input) => {
    const name = input.name
    if (input.value !== '') {
      const author = selectedUnit.autores.find((author) => author.name === name)
      if (
        author.obras.some(
          (obra) => obra.toLocaleLowerCase() === input.value.toLocaleLowerCase()
        )
      ) {
        input.classList.remove('respuesta-incorrecta')
        input.classList.add('respuesta-correcta')
      } else {
        input.classList.remove('respuesta-correcta')
        input.classList.add('respuesta-incorrecta')
      }
    }
  })
}

function pressSearchUnit() {
  const selectedUnit = units[selectTemas.value]
  exam.replaceChildren()
  selectedUnit.autores.forEach((autor) => {
    const newLabel = document.createElement('label')
    newLabel.textContent = autor.name
    exam.appendChild(newLabel)
    autor.obras.forEach((element) => {
      const newInput = document.createElement('input')
      newInput.type = 'text'
      newInput.name = `${autor.name}`
      newInput.classList.add('input-respuestas')
      exam.appendChild(newInput)
    })
    exam.appendChild(document.createElement('br'))
    exam.appendChild(document.createElement('br'))
  })
}

const setData = (data) => {
  for (const key in data) {
    const newOption = document.createElement('option')
    newOption.value = key
    newOption.text = data[key].title
    selectTemas.appendChild(newOption)
  }
}

fetch('temas.json')
  .then((response) => response.json())
  .then((data) => {
    units = data
    setData(data)
  })
  .catch((error) => console.error('Error al cargar el JSON:', error))

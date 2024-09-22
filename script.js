const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)

const $selectBtn = $('#select-btn')
const $checkBtn = $('#check-btn')
const $showResponsesBtn = $('#show-responses-btn')
const $selectTemas = $('#available-units')
const $exam = $('#exam')
const $menuBtn = $('#menu-btn')
const $menu = $('#menu')
const $menuSecondGame = $('#menu-secondGame')
const $menuFirstGame = $('#menu-firstGame')
const $colorSwitch = $('#switch input[type="checkbox"]')
const $searchSG = $('#search-sg')
const $checkBtnSG = $('#check-btn-sg')
const $authorSG = $('#author-sg')
const $refreshSG = $('#refresh-sg')

$selectBtn.addEventListener('click', handleClickSelectUnit)
$checkBtn.addEventListener('click', handleClickCheckResponses)
$checkBtnSG.addEventListener('click', handleClickCheckResponsesSG)
$showResponsesBtn.addEventListener('click', handleClickShowResponses)
$menuBtn.addEventListener('click', handleClickMenu)
$menuSecondGame.addEventListener('click', handleClickSecondGame)
$menuFirstGame.addEventListener('click', handleClickFirstGame)
$colorSwitch.addEventListener('change', changeTheme)
$searchSG.addEventListener('click', handleClickSearchBook)
$refreshSG.addEventListener('click', handleClickRefreshGame)
document.addEventListener('click', handleClickDcument)
window.addEventListener('scroll', onScrollDocument)

let units = {}
let arraySecondGame = []
let secondGameNumber = -1
const secondGameList = []

function handleClickRefreshGame() {
  arraySecondGame = [...secondGameList]
}

function handleClickCheckResponsesSG() {
  if (secondGameNumber === -1) return
  const response = $authorSG.value.trim()
  if ($authorSG.value === '') return
  const authorName = arraySecondGame[secondGameNumber][0]
  const isCorrect = authorName.includes(response.toLocaleUpperCase())
  if (isCorrect) {
    $authorSG.value = authorName
    arraySecondGame.splice(secondGameNumber, 1)
  }
  setInputStyle(isCorrect, $authorSG)
}

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function handleClickSearchBook() {
  if (arraySecondGame.length === 0) {
    secondGameNumber = -1
    return
  }
  $authorSG.classList.remove('respuesta-correcta')
  $authorSG.classList.remove('respuesta-incorrecta')
  $authorSG.value = ''
  const number = generateRandomNumber(0, arraySecondGame.length - 1)
  secondGameNumber = number
  $('#book-sg').innerHTML = arraySecondGame[number][1]
}

function changeTheme(ev) {
  if (ev.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

function handleClickSecondGame() {
  $('.second-game').style.display = 'block'
  $('.first-game').style.display = 'none'
}

function handleClickFirstGame() {
  $('.second-game').style.display = 'none'
  $('.first-game').style.display = 'block'
}

function onScrollDocument() {
  if ($menu.style.display === 'block') {
    $menu.style.display = 'none'
    $menuBtn.classList.remove('change')
  }
}

function handleClickDcument(event) {
  if (!$menuBtn.contains(event.target)) {
    $menu.style.display = 'none'
    $menuBtn.classList.remove('change')
  }
}

function handleClickMenu() {
  $menuBtn.classList.toggle('change')
  if ($menu.style.display === 'block') {
    $menu.style.display = 'none'
  } else {
    $menu.style.display = 'block'
  }
}

function handleClickSelectUnit() {
  const selectedUnit = units[$selectTemas.value]

  const innerExam = selectedUnit.autores
    .map((autor) => {
      return `<div class="author-group"><label class="author-title">${
        autor.name
      }</label>
          <div class="responses-container"> ${autor.obras
            .map(
              (obra) =>
                `<input type="text" class="respuesta-input" name="${autor.name}"/>`
            )
            .join('')}
        </div>
        <label class="author-mark" id="${autor.name}">Mark: ___/${
        autor.obras.length
      }</label>
        </div>`
    })
    .join('')

  const totalResponses = selectedUnit.autores.reduce(
    (acc, el) => acc + el.obras.length,
    0
  )
  const labelTotalMark = `<label id="totalMark" class="total-mark">Total mark: ___/${totalResponses}</label>`

  $exam.innerHTML = innerExam + labelTotalMark
}

function handleClickShowResponses() {
  const respuestas = $$('.respuesta-input')
  if (respuestas.length === 0) return
  const selectedUnit = units[$selectTemas.value]
  let count = 0
  respuestas.forEach((input, i) => {
    if (i > 0 && input.name !== respuestas[i - 1].name) {
      count = 0
    }
    const name = input.name
    const author = selectedUnit.autores.find((author) => author.name === name)
    input.value = author.obras[count]
    deleteInputStyle(input)
    count++
  })
}

const authorGrouper = (listOfValues, prop) => {
  return listOfValues.reduce((acc, el) => {
    if (!acc.hasOwnProperty(el[prop])) {
      acc[el[prop]] = []
    }
    acc[el[prop]].push(el)
    return acc
  }, {})
}

function handleClickCheckResponses() {
  const respuestas = $$('.respuesta-input')
  if (respuestas.length === 0) return
  const authorMarks = $$('.author-mark')
  const totalMarkLabel = $('#totalMark')
  const selectedUnit = units[$selectTemas.value]
  const groupedAuthorsResponse = authorGrouper(Array.from(respuestas), 'name')
  const groupedAuthorMarks = authorGrouper(Array.from(authorMarks), 'id')
  let totalMark = 0
  for (const key in groupedAuthorsResponse) {
    let mark = 0
    const author = selectedUnit.autores.find((author) => author.name === key)
    groupedAuthorsResponse[key].forEach((input) => {
      const answer = input.value.toLocaleLowerCase()
      const isCorrect = author.obras.some(
        (obra) => answer === obra.toLocaleLowerCase()
      )
      if (isCorrect) {
        mark++
      }
      setInputStyle(isCorrect, input)
    })
    totalMark += mark
    const label = groupedAuthorMarks[key][0]
    const currentInnerHtml = label.innerHTML
    label.innerHTML = currentInnerHtml.replace(/^[^\/]*/, mark)
  }
  const currentMark = totalMarkLabel.innerHTML
  totalMarkLabel.innerHTML = currentMark.replace(/^[^\/]*/, totalMark)
}

function setInputStyle(isCorrect, input) {
  const styleConfig = {
    true: { add: 'respuesta-correcta', remove: 'respuesta-incorrecta' },
    false: { add: 'respuesta-incorrecta', remove: 'respuesta-correcta' },
  }
  input.classList.remove(styleConfig[isCorrect].remove)
  input.classList.add(styleConfig[isCorrect].add)
}

function deleteInputStyle(input) {
  input.classList.remove('respuesta-incorrecta')
  input.classList.remove('respuesta-correcta')
}

const createArrySecondGame = (unit, authors) => {
  unit.autores.forEach((author) => {
    const bookList = authors[author.name]
    if (!bookList || bookList.length < author.obras.length) {
      authors[author.name] = [...author.obras]
    }
  })
}

const setUnitsFirstGame = (data, key) => {
  const newOption = document.createElement('option')
  newOption.value = key
  newOption.text = data[key].title
  $selectTemas.appendChild(newOption)
}

const setData = (data) => {
  const authors = {}
  for (const key in data) {
    createArrySecondGame(data[key], authors)
    setUnitsFirstGame(data, key)
  }
  arraySecondGame = Object.entries(authors).flatMap(([autor, libros]) =>
    libros.map((libro) => [autor, libro])
  )
  secondGameList.push(...arraySecondGame)
}

fetch('temas.json')
  .then((response) => response.json())
  .then((data) => {
    for (const key in data) {
      data[key].autores.forEach(
        (author) => (author.name = author.name.toLocaleUpperCase())
      )
    }
    units = data
    setData(data)
  })
  .catch((error) => console.error('Error al cargar el JSON:', error))

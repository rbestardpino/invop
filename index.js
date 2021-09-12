function solveMatrix() {
  let data = {}
  const result = Papa.parse(
    document.getElementById('matrix').value.split(' ').join('')
  )
  console.log(result)
  data.matrix = result.data

  if (invalidMatrix(data.matrix) || result.errors.length) {
    M.toast({ html: 'Invalid matrix syntax', classes: 'red' })
    return
  }

  data.cantEstadosNaturales = data.matrix[0].length
  data.ganancia = document.getElementById('ganancia').checked
  data.solutions = {}
  data.matrixT = data.matrix[0].map((_, colIndex) =>
    data.matrix.map((row) => row[colIndex])
  )

  document.getElementById('matrixTable').innerHTML = makeTableHTML(
    data.matrix,
    data.ganancia ? 'Matriz de ganancia' : 'Matriz de pérdida'
  )

  solveViaLaplace(data)
  solveViaWald(data)
  solveViaMaxMax(data)
  solveViaSavage(data)
  solveViaHurwicz(data)

  console.log(data)
}

function solveViaLaplace(data) {
  const prob = 1 / data.cantEstadosNaturales
  let VEs = data.matrix
    .map((row) => row.reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
    .map((value) => prob * value)

  let solutionIndex,
    tableHTML =
      '<table class="striped centered"><caption>Valores Esperados</caption><thead><tr><th></th><th>VEs</th></tr></thead><tbody>'

  if (data.ganancia)
    solutionIndex = VEs.findIndex((ve) => ve == Math.max.apply(null, VEs))
  else solutionIndex = VEs.findIndex((ve) => ve == Math.min.apply(null, VEs))

  for (var i = 0; i < VEs.length; i++) {
    tableHTML +=
      '<tr><td>' +
      `<strong>A${i + 1}</strong>` +
      `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
      VEs[i] +
      '</td></tr>'
  }
  tableHTML += '</tbody></table>'

  data.solutions.laplace = `A${solutionIndex + 1}`

  document.getElementById('laplace').innerHTML = tableHTML
  Array.from(document.getElementsByClassName('solutionLaplace')).forEach(
    (el) => (el.innerText = data.solutions.laplace)
  )
}

function solveViaWald(data) {
  let solutionIndex,
    tableHTML = ''

  if (data.ganancia) {
    const mins = data.matrix.map((row) => Math.min.apply(null, row))
    const max = Math.max.apply(null, mins)
    solutionIndex = mins.findIndex((min) => min == max)

    tableHTML =
      '<table class="striped centered"><caption>Mínimos</caption><thead><tr><th></th><th>MINS</th></tr></thead><tbody>'

    for (var i = 0; i < mins.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        mins[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  } else {
    const maxs = data.matrix.map((row) => Math.max.apply(null, row))
    const min = Math.min.apply(null, maxs)
    solutionIndex = maxs.findIndex((max) => max == min)

    tableHTML =
      '<table class="striped centered"><caption>Máximos</caption><thead><tr><th></th><th>MAXS</th></tr></thead><tbody>'

    for (var i = 0; i < maxs.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        maxs[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  }
  data.solutions.wald = `A${solutionIndex + 1}`

  document.getElementById('wald').innerHTML = tableHTML
  Array.from(document.getElementsByClassName('solutionWald')).forEach(
    (el) => (el.innerText = data.solutions.wald)
  )
}

function solveViaMaxMax(data) {
  let solutionIndex,
    tableHTML = ''

  if (data.ganancia) {
    const maxs = data.matrix.map((row) => Math.max.apply(null, row))
    const max = Math.max.apply(null, maxs)
    solutionIndex = maxs.findIndex((m) => m == max)

    tableHTML =
      '<table class="striped centered"><caption>Máximos</caption><thead><tr><th></th><th>MAXS</th></tr></thead><tbody>'

    for (var i = 0; i < maxs.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        maxs[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  } else {
    const mins = data.matrix.map((row) => Math.min.apply(null, row))
    const min = Math.min.apply(null, mins)
    solutionIndex = mins.findIndex((m) => m == min)

    tableHTML =
      '<table class="striped centered"><caption>Mínimos</caption><thead><tr><th></th><th>MINS</th></tr></thead><tbody>'

    for (var i = 0; i < mins.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        mins[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  }
  data.solutions.maxmax = `A${solutionIndex + 1}`

  document.getElementById('maxmax').innerHTML = tableHTML
  Array.from(document.getElementsByClassName('solutionMaxMax')).forEach(
    (el) => (el.innerText = data.solutions.maxmax)
  )
}

function solveViaSavage(data) {
  let COMatrix = []

  let tableHTML = ''

  if (data.ganancia) {
    const maxs = data.matrixT.map((row) => Math.max.apply(null, row))
    COMatrix = data.matrix.map((row) =>
      row.map((value, index) => maxs[index] - value)
    )

    tableHTML +=
      '<table class="striped centered"><caption>Máximos</caption><thead><tr><th></th>'

    for (let i = 0; i < data.cantEstadosNaturales; i++) {
      tableHTML += `<th>F${i + 1}</th>`
    }
    tableHTML += '</tr></thead><tbody><tr><td><strong>MAXS</strong></td>'
    for (var i = 0; i < maxs.length; i++) {
      tableHTML += '<td>' + maxs[i] + '</td>'
    }
    tableHTML += '</tr></tbody></table></br>'
    tableHTML += makeTableHTML(COMatrix, 'Costos de oportunidades')

    const COMaxs = COMatrix.map((row) => Math.max.apply(null, row))
    const min = Math.min.apply(null, COMaxs)
    solutionIndex = COMaxs.findIndex((max) => max == min)

    tableHTML +=
      '</br><table class="striped centered"><caption>Máximos COs</caption><thead><tr><th></th><th>MAXS</th></tr></thead><tbody>'

    for (var i = 0; i < COMaxs.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        COMaxs[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  } else {
    const mins = data.matrixT.map((row) => Math.min.apply(null, row))
    //TODO: check if its right the substraction
    COMatrix = data.matrix.map((row) =>
      row.map((value, index) => mins[index] - value)
    )

    tableHTML +=
      '<table class="striped centered"><caption>Mínimos</caption><thead><tr><th></th>'

    for (let i = 0; i < data.cantEstadosNaturales; i++) {
      tableHTML += `<th>F${i + 1}</th>`
    }
    tableHTML += '</tr></thead><tbody><tr><td><strong>MINS</strong></td>'
    for (var i = 0; i < mins.length; i++) {
      tableHTML += '<td>' + mins[i] + '</td>'
    }
    tableHTML += '</tr></tbody></table></br>'
    tableHTML += makeTableHTML(COMatrix, 'Costos de oportunidades')

    const COMins = COMatrix.map((row) => Math.min.apply(null, row))
    const max = Math.max.apply(null, COMins)
    solutionIndex = COMins.findIndex((min) => min == max)

    tableHTML +=
      '</br><table class="striped centered"><caption>Mínimos COs</caption><thead><tr><th></th><th>MAXS</th></tr></thead><tbody>'

    for (var i = 0; i < COMins.length; i++) {
      tableHTML +=
        '<tr><td>' +
        `<strong>A${i + 1}</strong>` +
        `</td><td ${i == solutionIndex ? 'class="yellow ligthen-2"' : ''}>` +
        COMins[i] +
        '</td></tr>'
    }
    tableHTML += '</tbody></table>'
  }
  data.solutions.savage = `A${solutionIndex + 1}`

  document.getElementById('savage').innerHTML = tableHTML
  Array.from(document.getElementsByClassName('solutionSavage')).forEach(
    (el) => (el.innerText = data.solutions.savage)
  )
}

function solveViaHurwicz(data) {}

function invalidMatrix(matrix) {
  let cantEstadosNaturales = matrix[0].length
  for (const alternativa of matrix) {
    if (alternativa.length != cantEstadosNaturales) return true
    for (const value of alternativa) {
      if (!value || isNaN(value)) return true
    }
  }
  return false
}

function makeTableHTML(matrix, caption) {
  let result =
    '<table class="striped centered"><caption>' +
    caption +
    '</caption><thead><tr><th></th>'

  for (let i = 0; i < matrix[0].length; i++) {
    result += `<th>F${i + 1}</th>`
  }
  result += '</tr></thead><tbody>'

  for (var i = 0; i < matrix.length; i++) {
    result += '<tr><td>' + `<strong>A${i + 1}</strong>` + '</td>'
    for (var j = 0; j < matrix[i].length; j++) {
      result += '<td>' + matrix[i][j] + '</td>'
    }
    result += '</tr>'
  }
  result += '</tbody></table>'

  return result
}

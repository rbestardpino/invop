function solveMatrix() {
  let data = {}
  const result = Papa.parse(
    document.getElementById('matriz').value.split(' ').join('')
  )
  data['matrix'] = result.data

  if (invalidMatrix(data['matrix']) || result.errors.length) {
    M.toast({ html: 'Invalid matrix syntax', classes: 'red' })
    return
  }

  data['cantEstadosNaturales'] = data['matrix'][0].length
  data['ganancia'] = document.getElementById('ganancia').checked

  console.log(data)

  document.getElementById('matrixTable').innerHTML = makeTableHTML(data.matrix)
}

function invalidMatrix(matrix) {
  let cantEstadosNaturales = matrix[0].length
  for (const alternativa of matrix) {
    if (alternativa.length != cantEstadosNaturales) return true
    for (const value of alternativa) {
      if (!value) return true
    }
  }
  return false
}

function makeTableHTML(matrix) {
  var result = '<table class="striped centered" border=4>'

  result += '<thead><tr><th></th>'
  for (let i = 0; i < matrix[0].length; i++) {
    result += `<th>F${i + 1}</th>`
  }
  result += '</tr></thead>'

  result += '<tbody>'
  for (var i = 0; i < matrix.length; i++) {
    result += '<tr><td>' + `<strong>A${i + 1}</strong>` + '</td>'
    for (var j = 0; j < matrix[i].length; j++) {
      result += '<td>' + matrix[i][j] + '</td>'
    }
    result += '</tr>'
  }
  result += '</tbody>'
  result += '</table>'

  return result
}

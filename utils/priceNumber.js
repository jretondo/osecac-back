const dataNumberPrice = (number) => {
    let dataCell = number
    try {
        dataCell = dataCell.replace("$", "")
        dataCell = dataCell.replace(" ", "")
        dataCell = dataCell.replace(".", "")
        dataCell = dataCell.replace(",", ".")
        dataCell = parseFloat(dataCell)
    } catch (error) { }

    if (isNaN(dataCell)) {
        dataCell = cell
    }
    return dataCell
}

module.exports = dataNumberPrice
function createInitialCells(game,x,y) {

  const cells = []

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      cells.push(
        new Cell(game,i,j)
      )
    }
  }
  return cells
}


class GameOfLife {

  constructor(x,y,seed) {
    this.x = x;
    this.y = y;
    this.cells = createInitialCells(this, x,y);
    this.mapNeighbours()
    this.numCycle = 0

    if (seed.length){
      for (const s of seed){
        const cell = this.cells.find(c => c.x === s[0] && c.y === s[1])
        if (cell){
          cell.live = true
        }
      }
    }
  }

  mapNeighbours() {
    this.cells.forEach(cell => {
      for (const x_mod of [-1,0,1]) {
        for (const y_mod of [-1,0,1]) {
          const x = cell.x + x_mod
          const y = cell.y + y_mod
          if (x === cell.x && y === cell.y) {
            continue
          }
          const neighbour = this.cells.find(c => c.x === x && c.y === y)
          if (neighbour) {
            cell.neighbours.push(neighbour)
          }
        }
      }
    })

  }

  tick(){

    let cellUpdate = {}
    this.cells.forEach(cell => {
      const stateChange = cell.getStateChange()
      if (stateChange !== cell.live){
        cellUpdate[cell.id] = stateChange
      }
    })

    for (const [id, state] of Object.entries(cellUpdate)){
      const cell = this.cells.find(c => c.id === id)
      cell.live = state
    }
    this.numCycle++;

  }

}

class Cell {

  constructor(game,x,y,live=false) {
    this.game = game
    this.id = `${x}-${y}`
    this.x=x
    this.y=y
    this.live=live
    this.neighbours=[];
  }

  getLiveNeighbours(){
    return this.neighbours.filter(n => n.live)
  }

  getStateChange(){
    // returns the state change of the cell
    const liveNeighbours = this.getLiveNeighbours().length

    switch (true){
      case (this.live && liveNeighbours<2):
        return false
      case (this.live && liveNeighbours===3 || liveNeighbours===2):
        return this.live
      case (this.live && liveNeighbours>3):
        return false
      case (!this.live && liveNeighbours === 3):
        return true
      default:
        // return the current state
        return this.live
    }


  }

}

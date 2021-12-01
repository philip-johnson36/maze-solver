//for testing
var testing = document.getElementById("test");

class Square{
  constructor(element, row, col){
    this.element = element;
    this.visited = false;
    this.previous = null;
    this.row = row;
    this.col = col;
    this.start=false;
    this.finish=false;
  }
  visit(){
    this.visited = true;
  }
  setPrevious(square){
    this.previous = square;
  }
  isVisited(){
    return this.visited;
  }
  isWall(){
    return this.element.style.backgroundColor=="red";
  }
}
class Stack{
  contents=[];
  poll(){
    return this.contents.pop();
  }
  add(element){
    return this.contents.push(element); 
    
  }
  isEmpty(){
    return this.contents.length==0;
  }
}
class Queue{
  contents=[];
  poll(){
    return this.contents.shift();
  }
  add(element){
    return this.contents.push(element); 
  }
  isEmpty(){
    return this.contents.length==0;
  }
}
class Maze{
  constructor(grid, start, end, algorithm){
    this.grid=grid;
    this.start=start;
    this.end=end;
    switch(algorithm){
      case 'DFS':
        this.worklist = new Stack();
        break;
      case 'BFS':
        this.worklist = new Queue();
        break;
    }
  }
  availableNeighbor(s, rowOffset, colOffset){
    if(s.row+rowOffset>=this.grid.length || s.col+colOffset>=this.grid[0].length || s.row+rowOffset<0 || s.col+colOffset<0 || grid[s.row+rowOffset][s.col+colOffset].isVisited() || grid[s.row+rowOffset][s.col+colOffset].isWall()){
      return false;
    }
    return true;
  }
  solve(){
    var finalList = [];      
    this.worklist.add(this.start);
    finalList.push(this.start);
    this.start.visit();
    var offsets = [[-1,0],[0,-1],[1,0],[0,1]];
    while(!this.worklist.isEmpty()){
      
      var currSquare = this.worklist.poll();
      if(currSquare == this.end){
        return [currSquare, finalList];
      }
      else{
        
        for(var i=0;i<4;i++){
         if(this.availableNeighbor(currSquare, offsets[i][0], offsets[i][1])){
           
          let currNeighbor = this.grid[currSquare.row+offsets[i][0]][currSquare.col+offsets[i][1]];
          currNeighbor.visit();
          currNeighbor.setPrevious(currSquare);
          this.worklist.add(currNeighbor);
          finalList.push(currNeighbor);

          }
        }
      }
    }
    return [null, finalList];
  }
}
var maze;
var grid=[];
var choosingStart=false, choosingFinish=false;
function resize(){
  grid = [];
  var bigBox = document.getElementById("bigBox");
  if(bigBox==null){
      bigBox = document.createElement("div");
      bigBox.id = "bigBox";
  }
  else{
    while(bigBox.firstChild){
      bigBox.firstChild.remove();
    }
  }

  
  var rows = document.getElementById("rows");
  var cols = document.getElementById("cols");
  var container = document.getElementById("container");
  
  var boxDims = document.body.style.height < 500 ? 90 : 90;
  bigBox.style.width = boxDims + "vh";
  bigBox.style.height = boxDims+ "vh";


  document.body.insertBefore(bigBox, container);
  for(i=0; i<rows.value; i++){
    grid.push([]);
    for(j=0; j<cols.value; j++){
      let newBox = document.createElement("div");
      newBox.className ="emptySquare";
      newBox.style.backgroundColor="white";
      newBox.draggable=false;
      newBox.onclick=function(){
        event.preventDefault();
        
      }
      newBox.ondragover = function(event){
        event.preventDefault();
        
      }
      newBox.ondrag = function(event){
        event.preventDefault();
        for(var i=0;i<grid.length;i++){
          for(var j=0;j<grid[0].length;j++){
            
            if(Object.is(grid[i][j].element,this)&&grid[i][j].start==true){removeStart(grid[i][j]);}
            if(Object.is(grid[i][j].element,this)&&grid[i][j].finish==true){removeFinish(grid[i][j]);}
          }
        }
      }
      newBox.ondrop = function(event){
        event.preventDefault();
        var startFound=false, finishFound=false, thisObj=null;
        for(var i=0;i<grid.length;i++){
          for(var j=0;j<grid[0].length;j++){
            
            if(Object.is(grid[i][j].element,this)){thisObj = (grid[i][j]);}
            if(grid[i][j].finish==true){finishFound=true;}
            if(grid[i][j].start==true){startFound=true;}
          }
        }
        if(!finishFound){
          setFinish(thisObj);
        }
        if(!startFound){
          setStart(thisObj);
        }

      }
      newBox.onmouseenter= function(event){
        var k=event.buttons;
        if(k==1){
          if(this.style.backgroundColor=="white"){
            this.style.backgroundColor = "red";
          }
          else if(this.style.backgroundColor=="red"){
            this.style.backgroundColor = "white";
          }
          
        }
      };
      bigBox.appendChild(newBox);
      newBox.style.height = 100/rows.value +"%";
      newBox.style.width = 100/cols.value+"%";
      let newSquare= new Square(newBox, i, j);
      grid[i].push(newSquare);
    }
  }
  setStart(grid[0][0]);
  setFinish(grid[rows.value-1][cols.value-1]);
}
function chooseStart(){
  choosingStart=true;
  choosingFinish=false;
}
function chooseFinish(){
  choosingFinish=true;
  choosingStart=false;
}
function solve(){
  var alg = document.getElementById("algs").value;
  var start, finish;
  for(var i=0;i<grid.length;i++){
    for(var j=0;j<grid[0].length;j++){
      if(grid[i][j].start==true){start = grid[i][j];}
      if(grid[i][j].finish==true){finish = grid[i][j];}
    }
  }
  var maze = new Maze(grid, start, finish, alg);
  var done = maze.solve();
  var path = done[1];
  var finish = done[0];
  var check = [];
  while(finish!=null){
    check.unshift(finish);
    finish=finish.previous;
  }
  var delay1=5000/(path.length);
  var delay2=2000/check.length;
  displaySolution(path, "yellow", delay1, check, "black", delay2);
}

function displaySolution(list, color,delay, list2, color2, delay2){
  if(list.length==0){
    displaySolution(list2, color2, delay2);
    return;
  }
  var square1 = list.shift();
  if(square1.start==false && square1.finish==false){
     square1.element.style.backgroundColor=color; 
  }


  setTimeout(()=>{displaySolution(list,color, delay,list2, color2, delay2);}, delay)
}
function setFinish(square){
  square.finish=true;
  square.element.draggable=true;
  square.element.style.backgroundColor = "purple";
}
function setStart(square){
  square.start=true;
  square.element.draggable=true;
  square.element.style.backgroundColor = "purple";
}
function removeStart(square){
  square.start=false;
  square.element.draggable=false;
  square.element.style.backgroundColor = "white";
}
function removeFinish(square){
  square.finish=false;
  square.element.draggable=false;
  square.element.style.backgroundColor = "white";
}

window.onload=function(){
  resize();
}
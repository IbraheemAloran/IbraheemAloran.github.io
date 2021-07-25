//******** GLOBAL VARIABLES ********//

let grid = [];
let sptArray = [];
let pathArray = [];
let visit = [];
let algo = -1; 
//let strtIndex = 292;
let strtIndex = 118;
let finIndex = 1099;
//let finIndex = 322;
let visitedNodes = 0;
let pathLength = 0;
let calctime = 0;
let drop = false;
let wallclick = false;
let moveStart = false;
let moveEnd = false;
let lastFin = 0;
let lastSin = 0;
let blocked = true;
let clickable = true;

//******** GLOBAL VARIABLES END ********//



//****** HELPER FUNCTIONS/CLASSES SECTION *******//
//NODE CLASS
class Node{
	constructor(index, fcost, hcost, gcost){
		this.id = index;
		this.fcost = fcost;
		this.hcost = hcost;
		this.gcost = gcost;
	}
	display(){
		console.log(this.id);
		console.log(this.fcost);
		console.log(this.hcost);
		console.log(this.gcost);
	}

}



//MIN HEAP CLASS FOR ASTAR
class aheap{
	constructor(){
		this.nums = [];

	}

	//function to add a number to the heap
	add(node) {
		if(this.nums.length == 0){
			this.nums.push(node);	
		}
		else{
			this.nums.push(node);
			this.heapifyUp(this.nums.length-1);	
		}
	}


	//helper function that swaps two elements in the list
	swap(indexOne, indexTwo){
		let temp = this.nums[indexOne];
		this.nums[indexOne] = this.nums[indexTwo];
		this.nums[indexTwo] = temp;
	}

	//function to look at the smallest element in the heap (smallest = first element)
	peek(){
		if(this.nums.length == 0){ 
			console.log("heap is empty");
			return;
		}
		return this.nums[0];
	}

	//function to get the smallest element from heap and remove it
	pull(){
		if(this.nums.length == 0){ 
			console.log("heap is empty");
			return;
		}
		let min = this.nums[0];
		this.nums[0] = this.nums[this.nums.length-1];
		this.nums.pop();
		this.heapifyDown(0);
		return min;
	}

	//function to heapify upwards from the index
	heapifyUp(indexx){
		let index = indexx;
		while(index != 0){
          if(this.nums[Math.floor((index-1)/2)].fcost > this.nums[index].fcost){
            this.swap(Math.floor((index-1)/2), index);
			index = Math.floor((index-1)/2);
          }
          else if(this.nums[Math.floor((index-1)/2)].fcost == this.nums[index].fcost){
            if(this.nums[Math.floor((index-1)/2)].hcost > this.nums[index].hcost){
              this.swap(Math.floor((index-1)/2), index);
			  index = Math.floor((index-1)/2);
            }
            else{
            	break;
            }
          }
          else{
            break;
          }
			
		}
	}

	//function to heapify downward from the index
	heapifyDown(indexx){
		let index = indexx;
		while(this.hasChild(index)){
          let smallerChildindex = this.getSmallerChild(index);
          if(this.nums[smallerChildindex].fcost < this.nums[index].fcost){
            this.swap(index, smallerChildindex);
            index = smallerChildindex;
          }
          else if(this.nums[smallerChildindex].fcost == this.nums[index].fcost){
            if(this.nums[smallerChildindex].hcost < this.nums[index].hcost){
              this.swap(index, smallerChildindex);
              index = smallerChildindex;
            }
            else{
              break;
          	}
          }
          else{
            break;
          }
		}
	}

	//helper function to get smaller child of a node
	getSmallerChild(index){
      if(this.hasRightChild(index)){
        let left = this.nums[(index*2)+1];
		let right = this.nums[(index*2)+2];
		if(left.fcost > right.fcost){
			return (index*2)+2;
		}
        else if(left.fcost == right.fcost){
          if(left.hcost > right.hcost){
            return (index*2)+2;
          }
          else{
			return (index*2)+1;
		  }
        }
		else{
			return (index*2)+1;
		}
      }
      else{
        return (index*2)+1;
      }
	}

	//function to change distance in heap
	setNode(index, node){
      //console.log(this.nums[index][1])
		this.nums[index] = node;
      if(this.hasChild(index) && index != 0){
		let smallestChild = this.nums[this.getSmallerChild(index)];
		let parent = this.nums[Math.floor((index-1)/2)];
		if(node.fcost > smallestChild.fcost){
			this.heapifyDown(index);
		}
        else if(node.fcost == smallestChild.fcost){
          if(node.hcost > smallestChild.hcost){
            this.heapifyDown(index);
          }
		}
		else if(node.fcost < parent.fcost){
			this.heapifyUp(index);
		}
        else if(node.fcost == parent.fcost){
          if(node.hcost < parent.hcost){
            this.heapifyUp(index);
          }
		}
      }
      else if(index == 0){
        this.heapifyDown(index);
      }
      else{
        this.heapifyUp(index);
      }
	}

	isInside(index){
		for (let i = 0; i < this.nums.length; i++) {
		  if(this.nums[i].id == index){
            return i;
          }
		}
      return -1;
	}

	//helper function to display the heap
    display(){
    	console.log(this.nums);
  	}

  	//this function checks if a node has any children
  	hasChild(index){
  		if(this.nums.length-1 < (index*2)+1){
  			return false;
  		}
  		return true;
  	}
    hasRightChild(index){
      if(this.nums.length-1 < (index*2)+2){
  			return false;
  		}
  		return true;
    }
    isEmpty(){
    	if(this.nums.length == 0){
    		return true;
    	}
    	return false;
    }
}


//***** MIN HEAP CLASS END ******//












//MIN HEAP CLASS FOR DIJKSTRA
class heap{
	constructor(){
		this.nums = [];

	}

	//function to add a number to the heap
	add(index, dist) {
		if(this.nums.length == 0){
			this.nums.push([index,dist]);	
		}
		else{
			this.nums.push([index,dist]);
			this.heapifyUp(this.nums.length-1);	
		}
	}


	//helper function that swaps two elements in the list
	swap(indexOne, indexTwo){
		let temp = this.nums[indexOne];
		this.nums[indexOne] = this.nums[indexTwo];
		this.nums[indexTwo] = temp;
	}

	//function to look at the smallest element in the heap (smallest = first element)
	peek(){
		if(this.nums.length == 0){ 
			console.log("heap is empty");
			return;
		}
		return this.nums[0];
	}

	//function to get the smallest element from heap and remove it
	pull(){
		if(this.nums.length == 0){ 
			console.log("heap is empty");
			return;
		}
		let min = this.nums[0];
		this.nums[0] = this.nums[this.nums.length-1];
		this.nums.pop();
		this.heapifyDown(0);
		return min;
	}

	//function to heapify upwards from the index
	heapifyUp(indexx){
		let index = indexx;
		while(index != 0 && this.nums[Math.floor((index-1)/2)][1] > this.nums[index][1]){
			this.swap(Math.floor((index-1)/2), index);
			index = Math.floor((index-1)/2);
		}
	}

	//function to heapify downward from the index
	heapifyDown(indexx){
		let index = indexx;
		while(this.hasChild(index)){
          let smallerChildindex = this.getSmallerChild(index);
          if(this.nums[smallerChildindex][1] < this.nums[index][1]){
            this.swap(index, smallerChildindex);
            index = smallerChildindex;
          }
          else{
            break;
          }
		}
	}

	//helper function to get smaller child of a node
	getSmallerChild(index){
      if(this.hasRightChild(index)){
        let left = this.nums[(index*2)+1][1];
		let right = this.nums[(index*2)+2][1];
		if(left > right){
			return (index*2)+2;
		}
		else{
			return (index*2)+1;
		}
      }
      else{
        return (index*2)+1;
      }
	}

	//function to change distance in heap
	setNode(index, dist){
      //console.log(this.nums[index][1])
		this.nums[index][1] = dist;
      if(this.hasChild(index) && index != 0){
		let smallestChild = this.nums[this.getSmallerChild(index)][1];
		let parent = this.nums[Math.floor((index-1)/2)][1];
		if(dist > smallestChild){
			this.heapifyDown(index);
		}
		else if(dist < parent){
			this.heapifyUp(index);
		}
      }
      else if(index == 0){
        this.heapifyDown(index);
      }
      else{
        this.heapifyUp(index);
      }
	}

	isInside(index){
		for (let i = 0; i < this.nums.length; i++) {
		  if(this.nums[i][0] == index){
            return i;
          }
		}
      return -1;
	}

	//helper function to display the heap
    display(){
    	console.log(this.nums);
  	}

  	//this function checks if a node has any children
  	hasChild(index){
  		if(this.nums.length-1 < (index*2)+1){
  			return false;
  		}
  		return true;
  	}
    hasRightChild(index){
      if(this.nums.length-1 < (index*2)+2){
  			return false;
  		}
  		return true;
    }

    isEmpty(){
    	if(this.nums.length == 0){
    		return true;
    	}
    	return false;
    }
}

//***** MIN HEAP CLASS END ******//

//HELPER FUNCTION TO GET NEIGHBOUR CELLS OF index
function getNeighbours(index){
	let neighbours = [];
	//top left corner case
	if(index == 0){
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
			neighbours.push(index+58);
		}
	}

	//top right corner case
	else if(index == 57){
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
			neighbours.push(index+58);
		}
	}

	//botton left corner case
	else if(index == 1160){
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}

	}

	//bottom right corner case
	else if(index == 1217){
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
	}

	//top row case
	else if(index < 58){
		
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
			neighbours.push(index+58);
		}
	}

	//left column case
	else if(index%58 == 0){
		
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
			neighbours.push(index+58);
		}
	}

	//right column case
	else if((index-57)%58 == 0){
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
			neighbours.push(index+58);
		}
		
	}

	//bottom row case
	else if(index > 1160 && index < 1217){
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
	}

	else{
		if(grid[index-58][0] == 0 || grid[index-58][0] == 4){
			neighbours.push(index-58);
		}
		if(grid[index+1][0] == 0 || grid[index+1][0] == 4){
			neighbours.push(index+1);
		}
		if(grid[index-1][0] == 0 || grid[index-1][0] == 4){
			neighbours.push(index-1);
		}
		if(grid[index+58][0] == 0 || grid[index+58][0] == 4){
		neighbours.push(index+58);
		}
		
	}


	return neighbours;
}


//HELPER FUNCTION TO SHOW THE RESULTING PATH
function showPath(){
	updateGrid(finIndex,4);
	for(let x=0; x<pathArray.length; x++){
		setTimeout(function(){
			updateGrid(pathArray[x], 5);
			if(x == pathArray.length-1){
				clickable = true;
			}
		},25*x);

	}
	updateGrid(strtIndex,3);
	
}

//FUNCTION TO GET PATH IN ORDER
function getPath(){
	pathLength = 0;
	
	let pthnode = finIndex;
	pathArray = [];
	while(true){
		pthnode = sptArray[pthnode];

		if(pthnode == strtIndex){
			break;
		}
		pathArray.unshift(pthnode);
		pathLength++;
	}
	setupCardInfo(visit.length, pathLength+1, calctime);
}

//FUNCTION TO SHOW VISITED NODES
function showVisit(){
	if(blocked){
		setupCardInfo(visit.length, 0, calctime);
		updateGrid(finIndex,4);
		visit.shift();
		for(let x=0; x<visit.length; x++){
			setTimeout(function(){
				updateGrid(visit[x], 1);
				updateGrid(strtIndex,3);
				if(x == visit.length-1){
					clickable = true;
					showPath();
				}
			},15*x);
		}
	}
	else{
		updateGrid(finIndex,4);
		getPath();
		visit.shift();
		for(let x=0; x<visit.length; x++){
			setTimeout(function(){
				updateGrid(visit[x], 1);
				updateGrid(strtIndex,3);
				if(x == visit.length-1){
					showPath();
				}
			},15*x);
		}
	}
	
}


//****** HELPER FUNCTIONS/CLASSES SECTION END *******//



//******** FUCNTION CALLS ********//
initialize();

//******** FUCNTION CALLS END ********//





//STARTUP FUNCTION
function initialize(){
	for (var i = 0; i < 1218; i++) {
		grid[i] = [0,2000000];
	}
	updateGrid(strtIndex,3);
	updateGrid(finIndex,4);

	setupCardTitle(-1);
}



//FUNCTION TO BRING MODAL
function helper(){
	document.getElementById("helpModal").style.display = "block";
	//console.log("helper");
}

//FUNCTION TO UPDATE ALGO NAME IN INFO CARD
function setupCardTitle(algoNum){
	if(algoNum == -1){
		document.getElementById("algoName").innerHTML = "N/A";
	}
	else if(algoNum == 0){
		document.getElementById("algoName").innerHTML = "Dijkstra";
	}
	else if(algoNum == 1){
		document.getElementById("algoName").innerHTML = "A*";
	}
	else if(algoNum == 2){
		document.getElementById("algoName").innerHTML = "Breadth-First Search";
	}
	else if(algoNum == 3){
		document.getElementById("algoName").innerHTML = "Depthth-First Search";
	}
	algo = algoNum;
	setupCardInfo(0,0,0);
}

//FUNCTION TO UPDATE ALGO INFO IN INFO CARD
function setupCardInfo(visited, dist, time){
	let info = "Nodes visited: ".concat(visited).concat("<br>Path distance: ").concat(dist).concat("<br>Time: ").concat(time).concat("ms</p>");
	document.getElementById("algoinfo").innerHTML = info;
}


function showDrop(){
	document.getElementById("algoDrop").classList.toggle("show");
	drop = !drop;
}


// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if(event.target.id != "navbarDarkDropdownMenuLink" && drop){
  	document.getElementById("algoDrop").classList.toggle("show");
  	drop = !drop;
  }
}

window.onmouseover = function(event){
	if(clickable){
		if(wallclick && (event.target.className == "unvisitedNode" || event.target.className == "visitedNode" || event.target.className == "pathNode")){
			let num = event.target.id.split(",");
			
			let nodeid = (parseInt(num[0])*58) + parseInt(num[1]);
			updateGrid(nodeid, 2);
		}
		if(moveStart && event.target.className != "endNode"){
			
			let num = event.target.id.split(",");
			let nodeid = (parseInt(num[0])*58) + parseInt(num[1]);
			
			if(strtIndex != nodeid){
				updateGrid(strtIndex, lastSin);
				lastSin = grid[nodeid][0];
				updateGrid(nodeid, 3);
				strtIndex = nodeid;
			}
			
		}
		if(moveEnd && event.target.className != "startNode"){
			let num = event.target.id.split(",");
			
			let nodeid = (parseInt(num[0])*58) + parseInt(num[1]);
			
			if(finIndex != nodeid){
				updateGrid(finIndex, lastFin);
				lastFin = grid[nodeid][0];
				updateGrid(nodeid, 4);
				finIndex = nodeid;
			}
			
		}
	}
	
	//console.log(event.target.id);
	
}
window.onmousedown = function(event){
	if(clickable){
		if(event.target.className == "unvisitedNode" || event.target.className == "visitedNode" || event.target.className == "pathNode"){
			wallclick = true;
		}
		if(event.target.className == "startNode"){
			moveStart = true;
		}
		if(event.target.className == "endNode"){
			moveEnd = true;
		}
		/*if(event.target.className == "startNode" || event.target.className == "endNode"){

		}*/
		if(wallclick && (event.target.className == "unvisitedNode" || event.target.className == "visitedNode" || event.target.className == "pathNode")){
			//document.getElementById(event.target.id).className = "wallNode";
			let num = event.target.id.split(",");
			//console.log(num);
			let nodeid = (parseInt(num[0])*58) + parseInt(num[1]);
			updateGrid(nodeid, 2);
		}
	}
}
window.onmouseup = function(event){
	wallclick = false;
	moveStart = false;
	moveEnd = false;
}





//FUNCTION TO CLEAR BOARD
function clearBoard(){
	if(clickable){
		setupCardInfo(0,0,0);
		for(var x=0;x<1218;x++){
			if(grid[x][0] != 3 && grid[x][0] != 4){
				updateGrid(x, 0);
			}
			grid[x][1] = 2000000;
		}
		sptArray = [];
	}
}


//FUNCTION TO CLEAR PATH
function clearPath(){
	if(clickable){
		setupCardInfo(0,0,0);
		for(var x=0;x<1218;x++){
			if(grid[x][0] == 1 || grid[x][0] == 5){
				updateGrid(x, 0);
			}
			grid[x][1] = 20000000;
			
		}
		sptArray = [];
		visit = [];
		pathArray = [];
	}
}


//FUNCTION TO RUN THE SELECTED ALGORITHM
//algo can be -1=n/a, 0=dijkstra, 1=a*, 
function visualize(){
	if(clickable){
		clearPath();
		if(algo == -1){

		}
		else if(algo == 0){
			dijkstra(strtIndex, finIndex);
		}
		else if(algo == 1){
			astar(strtIndex, finIndex);
		}
		else if(algo == 3){
			dfs(strtIndex, finIndex);
		}
		else if(algo == 2){
			bfs(strtIndex, finIndex);
		}
	}

}

// FUNCTION TO UPDATE GRID STATES AND COLOUR
// a node can be 0=unvisited, 1=visited, 2=wall, 3=start, 4=end, 5=path
function updateGrid(index, state){
	grid[index][0] = state;
	let nodeID = Math.floor(index/58).toString().concat(",").concat(index%58);
	if(state == 0){	
		document.getElementById(nodeID).className = "unvisitedNode";
	}
	else if(state == 1){
		document.getElementById(nodeID).className = "visitedNode";
	}
	else if(state == 2){
		document.getElementById(nodeID).className = "wallNode";
	}
	else if(state == 3){
		document.getElementById(nodeID).className = "startNode";
	}
	else if(state == 4){
		document.getElementById(nodeID).className = "endNode";
	}
	else if(state == 5){
		document.getElementById(nodeID).className = "pathNode";
	}
}

//FUNCTION TO GENERATE RANDOM MAZE
function mazeGen(){
	if(!clickable){
		return;
	}
	clearBoard();
	let startCell = strtIndex;
	let walls = getNeighbours(startCell);

	while(walls.length != 0){
		let randomIndex = Math.floor(Math.random()*walls.length);
		let randomWall = walls[randomIndex];

		if(randomWall%58 != 0 && (randomWall-57)%58 != 0){
			if(grid[randomWall+1][0] == 0 && grid[randomWall-1][0] != 0){
				surrcells = surroundingCells(randomWall);
				//console.log(surrcells);
				if(surrcells < 2){
					updateGrid(randomWall, 1);
					walls = walls.concat(getNeighbours(randomWall));
				}
				walls.splice(randomIndex,1);
				continue;

			}
			if(grid[randomWall-1][0] == 0 && grid[randomWall+1][0] != 0){
				surrcells = surroundingCells(randomWall);
				//console.log(surrcells);
				if(surrcells < 2){
					updateGrid(randomWall, 1);
					walls = walls.concat(getNeighbours(randomWall));
				}
				walls.splice(randomIndex,1);
				continue;
			}
		}
		if(randomWall < 1160 && randomWall > 58){
			if(grid[randomWall+58][0] == 0 && grid[randomWall-58][0] != 0){
				surrcells = surroundingCells(randomWall);
				//console.log(surrcells);
				if(surrcells < 2){
					updateGrid(randomWall, 1);
					walls = walls.concat(getNeighbours(randomWall));
				}
				walls.splice(randomIndex,1);
				continue;
			}
			if(grid[randomWall-58][0] == 0 && grid[randomWall+58][0] != 0){
				surrcells = surroundingCells(randomWall);
				//console.log(surrcells);
				if(surrcells < 2){
					updateGrid(randomWall, 1);
					walls = walls.concat(getNeighbours(randomWall));
				}
				walls.splice(randomIndex,1);
				continue;
			}
		}
		//updateGrid(randomWall,2);
		walls.splice(randomIndex,1);
	}
	let endneighb = getNeighbours(finIndex);
	//updateGrid(endneighb[Math.floor(Math.random()*4)], 1);
	updateGrid(endneighb[0], 1);
	updateGrid(endneighb[1], 1);
	updateGrid(endneighb[2], 1);
	updateGrid(endneighb[3], 1);

	for(var x=0;x<1218;x++){
		if(grid[x][0] == 0){
			updateGrid(x,2);
		}
		if(grid[x][0] == 1){
			updateGrid(x,0);
		}
	}

	
}



function surroundingCells(index){
	scells = 0;
	//right
	if(grid[index+1][0] == 1 || grid[index+1][0] == 3 || grid[index+1][0] == 4){
		scells++;
	}
	//left
	if(grid[index-1][0] == 1 || grid[index-1][0] == 3 || grid[index-1][0] == 4){
		scells++;
	}
	//up
	if(grid[index-58][0] == 1 || grid[index-58][0] == 3 || grid[index-58][0] == 4){
		scells++;
	}
	//down
	if(grid[index+58][0] == 1 || grid[index+58][0] == 3 || grid[index+58][0] == 4){
		scells++;
	}

	return scells;
}


//****** PATHFINDING ALGORITHMS *******//

function dijkstra(startIndex, endIndex){
	clickable = false;
	dist = new heap();
	visitedNodes = 0;
	blocked = true;

	dist.add(startIndex,0); //set starting node = 0
	grid[startIndex][1] = 0; //set dist on grid = 0

	let start = new Date().getTime();
	while(!dist.isEmpty()){
		if(grid[endIndex][0] == 1){
			blocked = false;
			break;
		}
		let smallestUnivistedNode = dist.peek();
		let neighbours = getNeighbours(smallestUnivistedNode[0]);
		for(var x = 0; x < neighbours.length ; x++){
			if(grid[neighbours[x]][1] > smallestUnivistedNode[1]+1){
				dist.add(neighbours[x], smallestUnivistedNode[1]+1);
				grid[neighbours[x]][1] = smallestUnivistedNode[1]+1;
				sptArray[neighbours[x]] = smallestUnivistedNode[0];
			}
		}
		
		dist.pull();
		visit.push(smallestUnivistedNode[0]);
		grid[smallestUnivistedNode[0]][0] = 1;
		visitedNodes++;
		
	}
	let end = new Date().getTime();
	calctime = end-start;
	showVisit();


}



function astar(startIndex, endIndex){
	clickable = false;
	let fcosts = new aheap();
	let closed = [];
	let gcosts = [];
	visitedNodes = 0;
	blocked = true;

	for(var i=0; i<1218; i++){
		gcosts[i] = 20000000;
		closed[i] = false;
	}

	fcosts.add(new Node(startIndex, 0, 0, 0));
	gcosts[startIndex] = 0;
	grid[startIndex][1] = 0;
	let start = new Date().getTime();
	while(!fcosts.isEmpty()){
		if(grid[endIndex][0] == 1){
			blocked = false;
			break;
		}
		let current = fcosts.pull();
		let neighbours = getNeighbours(current.id);
		for(var x=0;x<neighbours.length;x++){
			if(closed[neighbours[x]]){
				continue;
			}
			let gcost = calcDist(current.id, neighbours[x]) + gcosts[current.id];
			let hcost = calcDist(neighbours[x], endIndex);
			let fcost = gcost+hcost;
			let idex = fcosts.isInside(neighbours[x]);
			
			if(gcosts[neighbours[x]] > gcost){
				gcosts[neighbours[x]] = gcost;
			}
			if(idex != -1){ //IF FCOSTS EXISTS
				if(grid[neighbours[x]][1] > fcost){ //IF NEW FCOSTS < EXISITNG FCOST
					grid[neighbours[x]][1] = fcost;
					fcosts.setNode(idex, new Node(neighbours[x], fcost, hcost, gcost)); 
					sptArray[neighbours[x]] = current.id;
				}
			}
			else{
				fcosts.add(new Node(neighbours[x], fcost, hcost, gcost));
				grid[neighbours[x]][1] = fcost;
				sptArray[neighbours[x]] = current.id;
			}
		}
		closed[current.id] = true;
		visit.push(current.id);
		grid[current.id][0] = 1;
		visitedNodes++;
	}
	let end = new Date().getTime();
	calctime = end-start;
	showVisit();

}

function dfs(startIndex, endIndex){
	clickable = false;
	let stack = [];
	let current = startIndex;
	visitedNodes = 0;
	blocked = true;

	stack.push(current);

	let start = new Date().getTime();
	while(stack.length != 0){
		if(grid[endIndex][0] == 1){
			blocked = false;
			break;
		}
		visit.push(current);
		grid[current][0] = 1;
		
		let neighbours = getNeighbours(current);
		
		if(neighbours.length != 0){
			stack.push(neighbours[0]);
			sptArray[neighbours[0]] = current;
			current = neighbours[0];
			visitedNodes++;

		}
		else{
			stack.pop();
			current = stack[stack.length-1];
		}

		
	}
	let end = new Date().getTime();
	calctime = end-start;
	showVisit();

}


function bfs(startIndex, endIndex){
	clickable = false;
	let stack = [];
	let current = startIndex;
	visitedNodes = 0;
	blocked = true;


	stack.push(current);

	let start = new Date().getTime();
	while(stack.length != 0){
		if(grid[endIndex][0] == 1){
			blocked = false;
			break;
		}
		let neighbours = getNeighbours(current);
		for(var x=0;x<neighbours.length;x++){
			if(!stack.includes(neighbours[x])){
				stack.push(neighbours[x]);
				sptArray[neighbours[x]] = current;

			}
		}

		stack.shift();
		visit.push(current);
		grid[current][0] = 1;
		current = stack[0];
		visitedNodes++;
	}
	let end = new Date().getTime();
	calctime = end-start;
	showVisit();
}


//FUNCTION TO CALCULATE DISTANCE BETWEEN TWO NODES USING PYTHAGOREAN THEOREM
function calcDist(startIndex, endIndex){
	var startx = Math.floor(startIndex%58);
	var starty = Math.floor(startIndex/58);
	
	var endx = Math.floor(endIndex%58);
	var endy = Math.floor(endIndex/58);

	return Math.abs(endx-startx) + Math.abs(endy-starty);

}
//****** PATHFINDING ALGORITHMS END *******//










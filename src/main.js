const startPointBtn = document.getElementById('start-point');
const endPointBtn = document.getElementById('end-point');
const partitionBtn = document.getElementById('partition');
const searchBtn = document.getElementById('search');
const clearAllBtn = document.getElementById('clear-all');
const buttons = document.getElementsByClassName('button');
const gridElement = document.getElementById('grid');
const flag = {
	start: 'flag-start',
	end: 'flag-end',
	partition: 'flag-partition'
}
const columnsAmount = 10;
const rowsAmount = 10;
let pointType = flag.start;
let startPoint;
let endPoint;
let partitions = [];

class Node {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.id = x + '&' + y;
		this.distanceToStartPoint = 0;
	}

	get htmlElement () {
		if (!this.html) {
			this.html = document.getElementById(this.id);
		}
		return this.html;
	}

	isPartition() {
		return this.type === flag.partition;
	}
}

let grid = new Array();

for (let i = 0; i < columnsAmount; i++) {
	grid[i] = new Array(columnsAmount);

	let gridRow = document.createElement('div');
	gridRow.className = 'grid__row';
	gridElement.appendChild(gridRow);
	for (let j = 0; j < columnsAmount; j++) {
		let node = new Node(i, j);
		grid[i][j] = node;

		let gridCell = document.createElement('div');
		gridCell.className = 'grid__cell';
		gridCell.id = node.id;
		gridCell.onclick = function () {
			gridCellClick(node);
		}
		gridRow.appendChild(gridCell);
	}
}

startPointBtn.onclick = function() {
	setActiveBtn(flag.start, this);
};
endPointBtn.onclick = function() {
	setActiveBtn(flag.end, this) ;
};
partitionBtn.onclick = function() {
	setActiveBtn(flag.partition, this) ;
}
clearAllBtn.onclick = clearAll;
searchBtn.onclick = searchPath;

function clearAll() {
	location.reload();
}

function setActiveBtn(type, button) {
	pointType = type;
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].classList.remove('active');	
	}
	button.classList.add('active');
}

function gridCellClick(node) {
	switch (pointType) {
		case flag.start:
			if (node === endPoint || node.type === flag.partition) return;
			if (startPoint) {
				startPoint.htmlElement.classList.remove('start');
				startPoint.type = null;			
			}
			startPoint = node; 
			node.htmlElement.classList.add('start')
			break;
		case flag.end:
			if (node === startPoint || node.type === flag.partition) return;
			if (endPoint) {
				endPoint.htmlElement.classList.remove('end');
				endPoint.type = null;				
			}
			endPoint = node;
			node.htmlElement.classList.add('end')
			break;
		case flag.partition:
			if (node === startPoint || node === endPoint) return;
			partitions.push(node);
			node.htmlElement.classList.add('partition')
			break;
		default:
			break;
	}
	node.type = pointType;
}

function searchPath() {
	if (!startPoint || !endPoint) return;

	let visitedPoints = [];
	let  checkingPoints = [startPoint];
	let currentCheckingPoint = startPoint;
	let aa = 0;

	while (true) {
		checkingPoints = setCheckingPoints(currentCheckingPoint, visitedPoints, checkingPoints);
		currentCheckingPoint = checkingPoints[0];

		if (!currentCheckingPoint) break;

		currentCheckingPoint = findMinValue(currentCheckingPoint, checkingPoints);

		if (currentCheckingPoint.x === endPoint.x && currentCheckingPoint.y === endPoint.y) {
			showPath(currentCheckingPoint.parent);
			break;
		}

		currentCheckingPoint.htmlElement.classList.add('visited');
	}
}

function showPath(node) {
	let result;
	if (!node.parent) {
		result = new Array();
	} else {
		node.htmlElement.classList.add('path');
		result = showPath(node.parent);
	}
	result.push(node);
	return result;
}

function setCheckingPoints(node, visitedPoints, checkingPoints) {
	visitedPoints.push(node);
	checkingPoints = checkingPoints.filter(el => el.id !== node.id);

	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (x == 0 && y == 0) continue;
			
			let checkingPoint = grid[node.x + x] ? grid[node.x + x][node.y + y] : false;
			if (!checkingPoint ||
				 checkingPoint.type === flag.partition ||
				 checkingPoint.parent ||
				 visitedPoints.some(el => checkingPoint.x === el.x && checkingPoint.y === el.y) ||
				 diagonalPointBetweenPartitions(node, x, y)
				) continue;

			const distanceToEndPoint = Math.abs(endPoint.x - checkingPoint.x) + Math.abs(endPoint.y - checkingPoint.y);
			const cost = Math.abs(x) === Math.abs(y) ? 2 : 1;
			
			checkingPoint.distanceToStartPoint = node.distanceToStartPoint + cost;
			checkingPoint.parent = node;
			checkingPoint.resultDistance = checkingPoint.distanceToStartPoint + distanceToEndPoint;
			checkingPoints.push(checkingPoint);
		}
	}
	return checkingPoints;
}

function findMinValue(minValue, checkingPoints) {
	checkingPoints.forEach(el => {
		if (el.resultDistance < minValue.resultDistance) {
			minValue = el;
		}
	})
	return minValue;
}

function diagonalPointBetweenPartitions(node, x, y) {
	if (Math.abs(x) === Math.abs(y)) {
		return grid[node.x + x][node.y].isPartition() && grid[node.x][node.y + y].isPartition();
	}

	return false;
}



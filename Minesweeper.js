let gridSize = 10;
let gridArea = gridSize*gridSize;
let numMines = 15;

let root = document.documentElement;

root.style.setProperty('--gridSize', gridSize);
document.documentElement.style.setProperty("--rowNum", gridSize);

let boxes = [];
let mines = [];
let flaggedBoxes = 0;
let flaggedBoxesArray = [];

const page = document.getElementById('page');
const gameWrapper = document.getElementById('gameWrapper');
const overlayScreen = document.getElementById('overlayScreen');
const restartButton = document.getElementById('reset');
const digButton = document.getElementById('dig');
const minesCounter = document.getElementById('minesLeft');
const difficulty = document.getElementById('difficultyDropDown');

difficulty.addEventListener('input', changeDifficulty);

function changeDifficulty(){
  switch (this.value){
    case 'easy':
      gridSize = 10;
      gridArea = gridSize*gridSize;
      numMines = 10;
      root.style.setProperty('--fontSize', '5rem');
      break;
    case 'medium':
      gridSize = 15;
      gridArea = gridSize*gridSize;
      numMines = 40;
      root.style.setProperty('--fontSize', '4rem');
      break;
    case 'hard':
      gridSize = 21;
      gridArea = gridSize*gridSize;
      numMines = 99;
      root.style.setProperty('--fontSize', '2.5rem');
      break;
  }
  restartGame();
}

minesCounter.textContent = `${flaggedBoxes} / ${numMines}`;

function createGrid(){  
  for (i=0; i < gridArea; i++){
    boxes[i] = document.createElement('div');
    boxes[i].setAttribute('class', 'box'); 
    addClass(boxes[i], i);
    boxes[i].setAttribute('boxNum', i); 
    boxes[i].value = i;
    boxes[i].addEventListener('click', checkBox);    
    gameWrapper.appendChild(boxes[i]);
  }
  mines = addMines(numMines);
  revalueBoxes(mines);
}

function changedInput(){
  gridSize = this.value;
  gridArea = gridSize*gridSize;
  root.style.setProperty('--gridSize', gridSize);
  document.documentElement.style.setProperty("--rowNum", gridSize);
  restartGame();
}

(function startGame(){
  createGrid();
})()

restartButton.addEventListener('click', function(){restartGame()});
let isDigON = true;
digButton.addEventListener('click', function(){isDigON = toggleButton(isDigON)});
// flagButton.addEventListener('click', function(){isDigON = toggleButton(isDigON)});                         

function createGrid(){  
  for (i=0; i < gridArea; i++){
    boxes[i] = document.createElement('div');
    boxes[i].setAttribute('class', 'box'); 
    addClass(boxes[i], i);
    boxes[i].setAttribute('boxNum', i); 
    boxes[i].value = i;
    boxes[i].addEventListener('click', checkBox);    
    gameWrapper.appendChild(boxes[i]);
  }
  mines = addMines(numMines);
  revalueBoxes(mines);
}

function flagMine(){
  console.log('flagged');
  let classes = this.classList;
  let thisBox = this.getAttribute('boxNum');
  if (classes.contains('flagged')){
    classes.remove('flagged');   
    flaggedBoxes-=1;
    let index = flaggedBoxesArray.indexOf(thisBox);
    flaggedBoxesArray.splice(index, 1);
    minesCounter.textContent = `${flaggedBoxes} / ${numMines}`;
    ;
  }
  else {
    if (!classes.contains('selected')){
      classes.add('flagged');      
      flaggedBoxesArray.push(parseInt(thisBox));
      flaggedBoxes+=1;
      minesCounter.textContent = `${flaggedBoxes} / ${numMines}`;      
    }
  }
  checkForWin();
}

function toggleButton(isDigON){
  console.log('toggled');
  console.log(isDigON);  
  console.log(event.target);
  if (isDigON == true){
    isDigON = false;
    toggleFlagsForMines(mines, isDigON)
    for (i=0; i < gridArea; i++){
      boxes[i].removeEventListener('click', checkBox);
      boxes[i].addEventListener('click',flagMine);
    }
    // event.target.setAttribute('style', 'background-color: white');
    event.target.innerText = 'Flag';
    return isDigON;
  }
  else if (isDigON == false){
    isDigON = true;
    toggleFlagsForMines(mines, isDigON)
    for (i=0; i < gridArea; i++){
      boxes[i].removeEventListener('click', flagMine);
      boxes[i].addEventListener('click', checkBox);
    }
    // event.target.setAttribute('style', 'background-color: skyblue');
    event.target.innerText = 'Dig'
    return isDigON;
  }
}

function toggleFlagsForMines(mines){
  if (isDigON){
    for (i=0; i<mines.length; i++){
      boxes[mines[i]].removeEventListener('click', gameOver);
      boxes[mines[i]].removeEventListener('click', changeColor);
      boxes[mines[i]].addEventListener('click', flagMine);
    }
  }
  if (!isDigON){
    for (i=0; i<mines.length; i++){
      boxes[mines[i]].addEventListener('click', gameOver);
      boxes[mines[i]].addEventListener('click', changeColor);
      boxes[mines[i]].removeEventListener('click', flagMine);
    }
  }
}
function addClass(div, num){
  if (num == 0){ //Top left corner
    div.classList.add('TLCorner');
  }
  else if (num == gridSize-1){ //Top right corner
    div.classList.add('TRCorner');
  }
  else if (num == gridArea - gridSize){ //bottom left corner
    div.classList.add('BLCorner');
  }
  else if (num == gridArea-1){ //bottom right corner
    div.classList.add('BRCorner');
  }
  else if (num > 0 && num < gridSize){ // top row
    div.classList.add('top');
  }
  else if (num%gridSize == 0){ // left column
    div.classList.add('left');
  }
  else if ((num+1)%gridSize == 0){ // right column
    div.classList.add('right');
  }
  else if (num>gridArea-gridSize && num < gridArea){ // bottom
    div.classList.add('bottom');
  }  
  else{
    div.classList.add('mid');
  }
}
function addMines(numMines){
  let numBoxes = gridArea-1;
  let ranNum;
  let mines = [];
  for (i=0; i<numMines; i++){
    ranNum = Math.floor((Math.random() * numBoxes));
    
    while (boxes[ranNum].value == 'mine'){
      ranNum = Math.floor((Math.random() * numBoxes));
    }
    boxes[ranNum].value = 'mine'; 
    mines.push(ranNum);
    boxes[ranNum].removeEventListener('click', checkBox);
    boxes[ranNum].addEventListener('click', changeColor);
    boxes[ranNum].addEventListener('click', gameOver);      
  }
  return mines;
}
function gameOver(){
  overlayScreen.classList.add('show');
  overlayScreen.addEventListener('click', hideOverlay);
  overlayMessage.textContent = `BOOM! You clicked on a mine.`;
}
function gameWin(){
  overlayScreen.classList.add('show');
  overlayScreen.addEventListener('click', hideOverlay);
  overlayMessage.textContent = `You've flagged all the mines! Congrats!`;
}
function revalueBoxes(mines){
  let boxValue;
  let boxesValues = [];
  let commonBoxes;
  let boxxClassValue;
  for (i=0; i < gridArea; i++){
    boxValue = boxes[i].value;
    boxClassValue = boxes[i].classList;
    if (boxValue != 'mine'){
      surroundingBoxes = getSurroundingArray(boxValue, boxClassValue);
      commonBoxes = surroundingBoxes.filter(value => mines.includes(value));
      boxes[i].value = commonBoxes.length;
      boxesValues.push(boxes[i].value);
    }
    else {
      boxesValues.push('mine');
    }
  }
}

function checkBox(){
  let boxNum = this.getAttribute('boxNum');
  if (this.classList.contains('flagged')){
    return;
  }
  revealBoxes(this, boxNum, [],[]);
}

function changeColor(){
  this.style.background = 'red';
  
  for (i=0; i<mines.length; i++){
    boxes[mines[i]].style.background= 'red';
  }
}

function checkIfDefined(num){
  if (typeof boxes[num] === 'undefined') {
    return false;
  }
  return true;
}

function revealBoxes(div, boxNum, loopArray, checkedLoopArray){
  if (loopArray.length !=0){
    boxNum = loopArray[0];
    div = boxes[boxNum];
    loopArray.splice(0,1);
  }
  
  let numMinesAround = div.value;
  let className = div.classList[1];
  checkedLoopArray.push(boxNum);
  console.log(className, boxNum);
  if (numMinesAround !=0){
    setColor(div, numMinesAround);   
    div.innerText = numMinesAround;
  }
  else if (numMinesAround == 0){
    div.innerText = numMinesAround;
    let {boxTL, boxTop, boxTR, boxLeft, boxRight, boxBL, boxBottom, boxBR} = boxMathArray(boxNum); 
    // console.log(boxTL, boxTop, boxTR, boxLeft, boxRight, boxBL, boxBottom, boxBR);    
    let cardinalCheck = [boxLeft, boxTop, boxRight, boxLeft];
    let boxLeftValue, boxTopValue, boxRightValue, boxBottomValue;
    let cardinalBoxValues;
    let cardinalBoxes;
    
    if (checkIfDefined(boxRight)){
      boxRightValue = boxes[boxRight].value;
    }
    if (checkIfDefined(boxLeft)){
      boxLeftValue = boxes[boxLeft].value;
    }
    if (checkIfDefined(boxTop)){
      boxTopValue = boxes[boxTop].value;
    }
    if (checkIfDefined(boxBottom)){
      boxBottomValue = boxes[boxBottom].value;
    }     
    
    switch (className){
      case 'TLCorner':         
        cardinalBoxes = [boxRight, boxBottom];
        cardinalBoxValues = [boxRightValue, boxBottomValue];
        boxes[boxRight].innerText = boxRightValue;
        boxes[boxBottom].innerText = boxBottomValue; 
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'TRCorner': 
        cardinalBoxes = [boxLeft, boxBottom];
        cardinalBoxValues = [boxLeftValue, boxBottomValue];
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxBottom].innerText = boxBottomValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'BLCorner':
        cardinalBoxes = [boxRight, boxTop];
        cardinalBoxValues = [boxRightValue, boxTopValue];
        boxes[boxRight].innerText = boxRightValue;
        boxes[boxTop].innerText = boxTopValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'BRCorner':
        cardinalBoxes = [boxLeft, boxTop];
        cardinalBoxValues = [boxLeftValue, boxTopValue];
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxTop].innerText = boxTopValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'top':
        cardinalBoxes = [boxLeft, boxRight, boxBottom];
        cardinalBoxValues = [boxLeftValue, boxRightValue, boxBottomValue];
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxRight].innerText = boxRightValue;
        boxes[boxBottom].innerText = boxBottomValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'left':
        cardinalBoxes = [boxTop, boxRight, boxBottom];
        cardinalBoxValues = [boxTopValue, boxRightValue, boxBottomValue];
        boxes[boxTop].innerText = boxTopValue;
        boxes[boxRight].innerText = boxRightValue;
        boxes[boxBottom].innerText = boxBottomValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'bottom':
        cardinalBoxes = [boxLeft, boxTop, boxRight];
        cardinalBoxValues = [boxLeftValue, boxTopValue, boxRightValue];
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxTop].innerText = boxTopValue;
        boxes[boxRight].innerText = boxRightValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'right':
        cardinalBoxes = [boxTop, boxLeft, boxBottom];
        cardinalBoxValues = [boxTopValue, boxLeftValue, boxBottomValue]; 
        boxes[boxTop].innerText = boxTopValue;
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxBottom].innerText = boxBottomValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
      case 'mid':
        cardinalBoxes = [boxTop, boxLeft, boxRight, boxBottom];
        cardinalBoxValues = [boxTopValue, boxLeftValue, boxRightValue, boxBottomValue];
        boxes[boxTop].innerText = boxTopValue;
        boxes[boxLeft].innerText = boxLeftValue;
        boxes[boxBottom].innerText = boxBottomValue;
        boxes[boxRight].innerText = boxRightValue;
        checkForZero(cardinalBoxes, cardinalBoxValues, loopArray);
        break;
    }  
    console.log(cardinalBoxes);
    console.log(`loopArray = ${loopArray}`);
    console.log(`checkedLoopArray = ${checkedLoopArray}`);
    loopArray = loopArray.filter(x => !checkedLoopArray.includes(x)); 
    console.log(`loopArray after = ${loopArray}`);
    if (loopArray.length != 0){
      revealBoxes(null, null, loopArray, checkedLoopArray);
    }
  }
}

function checkForZero(cardinalBoxes, cardinalBoxValues, loopArray){
  for (i=0; i<cardinalBoxValues.length; i++){
    let div = boxes[cardinalBoxes[i]];
    if (cardinalBoxValues[i] == 0){
      loopArray.push(cardinalBoxes[i]);
    }
    setColor(div, cardinalBoxValues[i]);
    div.innerText = cardinalBoxValues[i];
  }
}

function setColor(div, value){
  let classList = div.classList;
  switch (value){
    case 0:
      classList.add('white', 'selected');
      break;
    case 1:
      classList.add('blue', 'selected');
      break;
    case 2:
      classList.add('green', 'selected');
      break;
    case 3:
      classList.add('red', 'selected');
      break;
    case 4:
      classList.add('orange', 'selected');
      break;
    case 5:
      classList.add('yellow', 'selected');
      break;
    case 6:
      classList.add('purple', 'selected');
      break;
    case 7: 
      classList.add('brown', 'selected');
      break;
    case 8:
      classList.add('black', 'selected');
      break;
  }  
}

function getSurroundingArray(boxNum, classNames){
  let surroundingBoxes;
  if (boxNum == 'mine'){
    return 'mine';
  }
  let className = classNames[1];
  
  let {boxTL, boxTop, boxTR, boxLeft, boxRight, boxBL, boxBottom, boxBR} = boxMathArray(boxNum);  
      
  switch (className){
    case 'TLCorner':
      surroundingBoxes = [boxRight, boxBottom, boxBR];
      break;
    case 'TRCorner':
      surroundingBoxes = [boxLeft, boxBL, boxBottom];
      break;
    case 'BLCorner':
      surroundingBoxes = [boxTop, boxTR, boxRight];
      break;
    case 'BRCorner':
      surroundingBoxes = [boxLeft, boxTL, boxTop];
      break;
    case 'top':
      surroundingBoxes = [boxLeft, boxRight, boxBL, boxBottom, boxBR];
      break;
    case 'left':
      surroundingBoxes = [boxTop, boxTR, boxRight, boxBottom, boxBR];
      break;
    case 'bottom':
      surroundingBoxes = [boxLeft, boxTL, boxTop, boxTR, boxRight];
      break;
    case 'right':
      surroundingBoxes = [boxTop, boxTL, boxLeft, boxBL, boxBottom];
      break;
    case 'mid':
      surroundingBoxes = [boxTL, boxTop, boxTR, boxLeft, boxRight, boxBL, boxBottom, boxBR];
      break;
  }  
  
  // console.log(`surroundingBoxes = ${surroundingBoxes}`);  
  
  return surroundingBoxes;
}

function boxMathArray(boxNum){  
  boxNum = parseInt(boxNum);
  let boxTL = boxNum - parseInt(gridSize) - 1;
  let boxTop = boxNum - gridSize;
  let boxTR = boxNum - gridSize + 1;
  let boxLeft = boxNum - 1;
  let boxRight = boxNum + 1;
  let boxBL = boxNum + gridSize - 1;
  let boxBottom = boxNum + gridSize;
  let boxBR = boxNum + gridSize + 1;
  
  return {boxTL, boxTop, boxTR, boxLeft, boxRight, boxBL, boxBottom, boxBR};
}

function hideOverlay(){
  overlayScreen.classList.remove('show');
}

function restartGame(){
  console.log('Game restarted');
  deleteChildrenNodes(gameWrapper);
  root.style.setProperty('--gridSize', gridSize);
  document.documentElement.style.setProperty("--rowNum", gridSize);
  console.log(`gridsize is ${gridSize}`);
  console.log(`gridarea is ${gridArea}`);
  boxes = [];
  mines = [];
  for (i=0; i < gridArea; i++){
    boxes[i] = document.createElement('div');
    boxes[i].setAttribute('class', 'box'); 
    addClass(boxes[i], i);
    boxes[i].setAttribute('boxNum', i); 
    boxes[i].value = i;
    boxes[i].addEventListener('click', checkBox);    
    gameWrapper.appendChild(boxes[i]);
  }
  console.log('stillworking');
  mines = addMines(numMines);
  revalueBoxes(mines);
  flaggedMines = 0;
  flaggedBoxes = 0;
  flaggedBoxesArray = [];
  minesCounter.textContent = flaggedMines;
  console.log('done');
}

function deleteChildrenNodes(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function checkForWin(){
  console.log(flaggedBoxesArray);
  console.log(mines);
  checkedMinesArray = mines.filter(x => !flaggedBoxesArray.includes(x)); 
  if (checkedMinesArray.length == '' && flaggedBoxesArray.length == mines.length){
    gameWin();
  }
  console.log(`checked: ${checkedMinesArray}`);
}


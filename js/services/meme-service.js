'use strict'

const STORAGE_KEY = 'memes';

var gStyle = 'continual';
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gMemes;
var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = [{
    id: 1,
    url: 'img/1.jpg',
    keywords: ['happy']
}];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    linesCount: 1,
    lines: [{
        txt: '',
        size: 40,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'IMPACT',
        posX: null,
        posY: null,
        isDragging: false
    }]
}

_createImgs();

function getImgs() {
    return gImgs;
}

function getImgById(imgId) {
    var img = gImgs.find(function (img) {
        return (imgId === img.id);
    })
    return img;
}

function addText() {
    if (gIsAdd) {
        if (!(gMeme.linesCount === 1 && gMeme.lines[0].txt === '')) {
            gMeme.linesCount++;
            gMeme.selectedLineIdx = gMeme.linesCount - 1;
        }
    }
    var textLine = document.querySelector('.text-display').value;
    if (!gIstxt && textLine) {
        var line = _addMemeText();
        gMeme.lines[gMeme.selectedLineIdx] = line;
        gIstxt = true;
    }
    gMeme.lines[gMeme.selectedLineIdx].txt = textLine;
    gMeme.selectedImgId = gCurrImg.id;
    if (!textLine) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.linesCount--;
        gMeme.selectedLineIdx--;
        gIsAdd = true;
        gIstxt = false;
        gIsFocus = false;
    }
}

function setPosition() {
    if (gMeme.lines[gMeme.selectedLineIdx].posX) {
        return;
    }
    var posY;
    var posX;
    if (gMeme.linesCount === 1) {
        posX = gElCanvas.width / 2;
        posY = 50;
    } else if (gMeme.linesCount === 2) {
        posX = gElCanvas.width / 2;
        posY = gElCanvas.height - 50;
    } else if (gIsAdd) {
        posX = gElCanvas.width / 2;
        posY = gElCanvas.height / 2;
    } else {
        posX = gMeme.lines[gMeme.selectedLineIdx].posX;
        posY = gMeme.lines[gMeme.selectedLineIdx].posY;
    }
    gMeme.lines[gMeme.selectedLineIdx].posX = posX;
    gMeme.lines[gMeme.selectedLineIdx].posY = posY;
    gIsAdd = false;
}

function setMemeLineIdx() {
    gMeme.selectedLineIdx--;
    if (gMeme.selectedLineIdx < 0) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
    }
    return gMeme.selectedLineIdx;
}

function removeTextLine() {
    if (!gMeme.linesCount) {
        gMeme.lines[0].txt = '';
    } else {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.linesCount--;
        gMeme.selectedLineIdx--;
        if (gMeme.selectedLineIdx === -1) {
            gMeme.selectedLineIdx = gMeme.linesCount - 1;
        }
        gIsAdd = true;
        gIstxt = false;
    }
}

function deleteCurrMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        linesCount: 1,
        lines: [{
            txt: '',
            size: 40,
            align: 'center',
            color: 'white',
            stroke: 'black',
            font: 'IMPACT',
            posX: null,
            posY: null,
            isDragging: false
        }]
    }
    gIsAdd = false;
    gIsFocus = false;
    gIstxt = false;
}

function moveUp() {
    gMeme.lines[gMeme.selectedLineIdx].posY -= 5;
}

function moveDown() {
    gMeme.lines[gMeme.selectedLineIdx].posY += 5;
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'My_Meme'
}

function increaseFont() {
    gMeme.lines[gMeme.selectedLineIdx].size += 10;
}

function decreaseFont() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 10;
}

function alignLeft() {
    gMeme.lines[gMeme.selectedLineIdx].posX = 5;
    gMeme.lines[gMeme.selectedLineIdx].align = 'left';
}

function alignCenter() {
    gMeme.lines[gMeme.selectedLineIdx].posX = gElCanvas.width / 2;
    gMeme.lines[gMeme.selectedLineIdx].align = 'center';
}

function alignRight() {
    gMeme.lines[gMeme.selectedLineIdx].posX = gElCanvas.width - 5;
    gMeme.lines[gMeme.selectedLineIdx].align = 'right';
}

function textFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function textStroke(stroke) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = stroke;
}

function textColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function _createImgs() {
    var imgs = [];
    for (let i = 0; i < 18; i++) {
        var keyword = 'happy';
        imgs.push(_createImg(i + 1, keyword));
    }
    gImgs = imgs;
}

function _createImg(imgId = 1, keyword) {
    return {
        id: imgId,
        url: `img/${imgId}.jpg`,
        keywords: [keyword]
    }
}

function _addMemeText() {
    return {
        txt: '',
        size: 40,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'IMPACT',
        posX: null,
        posY: null,
        isDragging: false
    }
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    const pos = getEvPos(ev);
    if (gStyle === 'continual') {
        if (!isShapeClicked(pos)) return;
    } else {
        if (!gMeme.isDragging){
            gMeme.lines[gMeme.selectedLineIdx].posX = pos.x;
            gMeme.lines[gMeme.selectedLineIdx].posY = pos.y;
        }
    }
    gMeme.isDragging = true;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    if (gMeme.isDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;

        gMeme.lines[gMeme.selectedLineIdx].posX += dx;
        gMeme.lines[gMeme.selectedLineIdx].posY += dy;

        gStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    gMeme.isDragging = false;
    document.body.style.cursor = 'grab';
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function isShapeClicked(clickedPos) {
    var posX = gMeme.lines[gMeme.selectedLineIdx].posX;
    var posY = gMeme.lines[gMeme.selectedLineIdx].posY;
    var distanceX = Math.abs(posX - clickedPos.x);
    var distanceY = Math.abs(posY - clickedPos.y - gMeme.lines[gMeme.selectedLineIdx].size / 2);
    if(distanceX < 30 && distanceY < 10) return true;
    else return false;
}

// Not supported yet
function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMeme);
}

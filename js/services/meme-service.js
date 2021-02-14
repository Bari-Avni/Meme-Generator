'use strict'

const STORAGE_KEY = 'memes';

var gStyle = 'continual';
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gMemes;
var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['politics'] },
    { id: 2, url: 'img/2.jpg', keywords: ['animal'] },
    { id: 3, url: 'img/3.jpg', keywords: ['animal', 'kid'] },
    { id: 4, url: 'img/4.jpg', keywords: ['animal'] },
    { id: 5, url: 'img/5.jpg', keywords: ['kid'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['kid', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny'] },
    { id: 9, url: 'img/9.jpg', keywords: ['kid', 'funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['politics'] },
    { id: 11, url: 'img/11.jpg', keywords: ['sport'] },
    { id: 12, url: 'img/12.jpg', keywords: ['show'] },
    { id: 13, url: 'img/13.jpg', keywords: ['show'] },
    { id: 14, url: 'img/14.jpg', keywords: ['show'] },
    { id: 15, url: 'img/15.jpg', keywords: ['show'] },
    { id: 16, url: 'img/16.jpg', keywords: ['show'] },
    { id: 17, url: 'img/17.jpg', keywords: ['politics'] },
    { id: 18, url: 'img/18.jpg', keywords: ['toy'] }
];

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
        if (gMeme.selectedLineIdx === -1) {
            gMeme.selectedLineIdx = gMeme.linesCount - 1;
        }
        gIsAdd = true;
        gIstxt = false;
        gIsFocus = false;
    }
}

function setPosition() {
    if(!gMeme.lines.length) return;
    if (gMeme.lines[gMeme.selectedLineIdx].posX) return;
    if(!gIstxt) return;
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

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
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
    gElCanvas.addEventListener('mousemove', onMouseMove);
    gElCanvas.addEventListener('mousedown', onMouseDown);
    gElCanvas.addEventListener('mouseup', onMouseUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMouseMove);
    gElCanvas.addEventListener('touchstart', onMouseDown);
    gElCanvas.addEventListener('touchend', onMouseUp);
}

function onMouseDown(ev) {
    const pos = getEvPos(ev);
    if (gStyle === 'continual') {
        if (!isTextClicked(pos)) return;
    } else {
        if (!gMeme.isDragging) {
            gMeme.lines[gMeme.selectedLineIdx].posX = pos.x;
            gMeme.lines[gMeme.selectedLineIdx].posY = pos.y;
        }
    }
    gMeme.isDragging = true;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
    gIsFocus = true;
    onUpdatetextInput();
    renderCanvas();
}

function onMouseMove(ev) {
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

function onMouseUp() {
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

function isTextClicked(clickedPos) {
    for (var i = 0; i < gMeme.lines.length; i++) {
        gMeme.selectedLineIdx = i;
        var posX = gMeme.lines[i].posX;
        var posY = gMeme.lines[i].posY;
        var textLength = gCtx.measureText(gMeme.lines[i].txt).width;
        var distanceX = clickedPos.x - posX;
        var distanceY = posY - clickedPos.y;
        if (distanceY < gMeme.lines[i].size * 0.6 && distanceY > 0) {
            if (gMeme.lines[i].align === 'left') {
                if (distanceX > 0 && distanceX < textLength) return true;
            } else if (gMeme.lines[i].align === 'right') {
                if (distanceX > textLength * (-1) && distanceX < 0) return true;
            } else if (gMeme.lines[i].align === 'center') {
                if (distanceX > textLength / (-2) && distanceX < textLength / 2) return true;
            } else return false;
        }
    }
}

// Not supported yet
function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMeme);
}

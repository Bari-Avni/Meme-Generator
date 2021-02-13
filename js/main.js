'use strict'

var gElCanvas;
var gCtx;
var gCurrImg;
var gIsAdd = false;
var gIsFocus = false;
var gIstxt = false;

function init() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImgGallery();
}

function renderImgGallery() {
    var imgs = getImgs();
    var strHTMLs = imgs.map(function (img) {
        return `<img class="image-${img.id}" src="${img.url}" onclick="onSelectImg(${img.id})">`
    })
    var elGallery = document.querySelector('.images');
    elGallery.innerHTML = strHTMLs.join('');
}

function drawText(txt, size, align, color, stroke, font, x, y) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = stroke;
    gCtx.fillStyle = `${color}`;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = align;
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.lineWidth = 2;
    gCtx.rect(x, y, gElCanvas.width - 60, gMeme.lines[gMeme.selectedLineIdx].size + 20);
    gCtx.strokeStyle = 'white';
    gCtx.stroke();
}

function renderCanvas() {
    const img = new Image();
    img.src = gCurrImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        for (var i = 0; i < gMeme.linesCount; i++) {
            var line = gMeme.lines[i];
            drawText(line.txt, line.size, line.align, line.color, line.stroke, line.font, line.posX, line.posY);
        }
        if (gIsFocus) {
            var x;
            if (gMeme.lines[gMeme.selectedLineIdx].align === 'center') x = gMeme.lines[gMeme.selectedLineIdx].posX - (gElCanvas.width / 2) + 30;
            else if (gMeme.lines[gMeme.selectedLineIdx].align === 'left') x = gMeme.lines[gMeme.selectedLineIdx].posX - 5;
            else if (gMeme.lines[gMeme.selectedLineIdx].align === 'right') x = gMeme.lines[gMeme.selectedLineIdx].posX - (gElCanvas.width) + 60;
            drawRect(x, gMeme.lines[gMeme.selectedLineIdx].posY - gMeme.lines[gMeme.selectedLineIdx].size);
        }
    }
}

function onSelectImg(imgId) {
    gCurrImg = getImgById(imgId);
    gMeme.selectedImgId = gCurrImg.id;
    document.querySelector('.canvas-container').style.display = 'block';
    document.querySelector('.images-container').style.display = 'none';
    document.querySelector('.about-container').style.display = 'none';
    resizeCanvas();
    addListeners();
    renderCanvas();
}

function onSetGallery() {
    deleteCurrMeme();
    document.querySelector('.text-display').value = '';
    document.querySelector('.canvas-container').style.display = 'none';
    document.querySelector('.images-container').style.display = 'block';
    document.querySelector('.about-container').style.display = 'block';
    renderImgGallery();
}

function onAddText() {
    addText();
    setPosition();
    renderCanvas();
}

function onIncreaseFont() {
    increaseFont();
    renderCanvas();
}

function onDecreaseFont() {
    decreaseFont();
    renderCanvas();
}

function onAddTextLine() {
    gIsAdd = true;
    gIstxt = false;
    gIsFocus = false;
    document.querySelector('.text-display').value = '';
    document.querySelector('.text-display').focus();
    document.querySelector('.text-font').value = 'IMPACT';
}

function onSwitchLines() {
    if (gMeme.lines.length < 1) return;
    var currLineIdx = setMemeLineIdx();
    var lineTxt = gMeme.lines[currLineIdx].txt;
    document.querySelector('.text-display').value = lineTxt;
    var y = gMeme.lines[currLineIdx].posY - gMeme.lines[currLineIdx].size;
    gIsFocus = true;
    gIsAdd = false;
    renderCanvas();
}

function onRemoveTextLine() {
    var textLine = document.querySelector('.text-display').value;
    if (gIsFocus || textLine) {
        removeTextLine();
    }
    gIsFocus = false;
    document.querySelector('.text-display').value = '';
    renderCanvas();
}

function onAlignLeft() {
    alignLeft();
    renderCanvas();
}

function onAlignCenter() {
    alignCenter();
    renderCanvas();
}

function onAlignRight() {
    alignRight();
    renderCanvas();
}

function onMoveUp() {
    moveUp();
    renderCanvas();
}

function onMoveDown() {
    moveDown();
    renderCanvas();
}

function onTextFont() {
    var font = document.querySelector('.text-font').value;
    textFont(font);
    renderCanvas();
}

function onTextStroke() {
    var stroke = document.querySelector('.color-stroke').value;
    textStroke(stroke);
    renderCanvas();
}

function onTextColor() {
    var color = document.querySelector('.color-text').value;
    textColor(color);
    renderCanvas();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

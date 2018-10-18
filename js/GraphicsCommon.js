function colorRect(_ctx, _x,_y, _width,_height, _color, _position = "topleft", _shadowProps = {shadowColor:"black", shadowBlur:0, shadowOffsetX:0, shadowOffsetY:0}) {
    let startX, startY;

    switch(_position) {
        case "center":
            startX = _x - ((_width / 2) | 0);
            startY = _y - ((_height / 2) | 0);
        break;
        default:
            startX = _x;
            startY = _y;
        break;
    }
    _ctx.save();
    _ctx.fillStyle = _color;
    _ctx.shadowColor = _shadowProps.shadowColor;
    _ctx.shadowBlur = _shadowProps.shadowBlur;
    _ctx.shadowOffsetX = _shadowProps.shadowOffsetX;
    _ctx.shadowOffsetY = _shadowProps.shadowOffsetY;
    _ctx.fillRect(startX,startY, _width,_height);
    _ctx.restore();
}

function colorText(_ctx, _text, _x,_y, _color, _textProps = {fontStyle:"10px sans-serif", textAlign:"start", textBaseline:"alphabetic"}, _shadowProps = {shadowColor:"black", shadowBlur:0, shadowOffsetX:0, shadowOffsetY:0}) {
    _ctx.save();
    _ctx.fillStyle = _color;
    _ctx.font = _textProps.fontStyle;
    _ctx.textAlign = _textProps.textAlign;
    _ctx.textBaseline = _textProps.textBaseline;
    _ctx.shadowColor = _shadowProps.shadowColor;
    _ctx.shadowBlur = _shadowProps.shadowBlur;
    _ctx.shadowOffsetX = _shadowProps.shadowOffsetX;
    _ctx.shadowOffsetY = _shadowProps.shadowOffsetY;
    _ctx.fillText(_text, _x,_y);
    _ctx.restore();
}

function clearScreen(_ctx) {
    _ctx.clearRect(0,0, _ctx.canvas.width,_ctx.canvas.height);
}
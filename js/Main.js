let bgContext,
    fgContext,
    clock1;

window.onload = function() {
    bgContext = document.getElementById("canvasArea").getContext("2d");
    fgContext = document.getElementById("canvasArea2").getContext("2d");
    clock1 = new Clock(bgContext, fgContext, Math.round(bgContext.canvas.width/2), Math.round(bgContext.canvas.height/2 + 11), true, true, false);

    startAnimationLoop();
}

function drawAll() {
    colorRect(bgContext, 0,0, bgContext.canvas.width,bgContext.canvas.height, "rgba(0,0,0,0.4");
    clearScreen(fgContext);
    //colorText(fgContext, fps.toFixed(2) + " fps", 2,12, "white", {fontStyle:"12px sans-serif"});
    clock1.showTime();
}
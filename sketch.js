(function() {
    let initialized = false;
    var drawConfig;
    var canvas;
    var ctx;

    function startDraw() {
        canvas = document.createElement('canvas');
        const body = document.body;
        const html = document.documentElement;
        const scale = window.devicePixelRatio;
        let windowWidth = window.innerWidth;
        let windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);


        console.log(windowWidth)
        canvas.width = windowWidth * scale;
        canvas.height = windowHeight * scale;

        Object.assign(canvas.style, {
            position:"absolute", 
            zIndex: 1000, 
            // pointerEvents: 'none',
            // height: windowHeight + '!important',
            width: windowWidth + 'px',
            top: '0',
            left: '0'
        });

        body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.scale(scale, scale)
        ctx.translate(0.5, 0.5);

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function draw(e) {
            if (!isDrawing){
                [lastX, lastY] = [e.offsetX, e.offsetY];
                return;
            }

            ctx.quadraticCurveTo(lastX, lastY, (lastX + e.offsetX) / 2, (lastY + e.offsetY) / 2);
            ctx.stroke();

            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            ctx.strokeStyle = drawConfig.color;
            ctx.lineWidth = drawConfig.weight;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', function(e) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            isDrawing = false;
        });
        canvas.addEventListener('mouseout', () => isDrawing = false);
        initialized = true;
    }

    chrome.runtime.onMessage.addListener(function(msg) {
        console.log(msg);
        if (msg.command === 'stop') {
            canvas.remove();
            initialized = false;
            return;
        }

        if (!initialized) {
            startDraw();
        }
        drawConfig = msg.drawConfig;
        if (msg.command === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

})();

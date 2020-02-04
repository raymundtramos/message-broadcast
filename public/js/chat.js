function showLatestMessage() {
    // $("#msg").scrollTop($("#msg").height());
    var msg = document.getElementById('msg');
    msg.scrollTop = msg.scrollHeight - msg.clientHeight;
}

function chatPushCommon(origin, element) {
    var originClass;
    if (origin) {
        originClass = 'myMessage';
    } else {
        originClass = 'fromThem';
    }
    $("#msg")
        .append($('<div>', { class: 'message' })
            .append($('<div>', { class: originClass })
                .append(element)));

    showLatestMessage();
}

// Push chat to the messages window
function chatPush(origin, message) {
    chatPushCommon(origin, '<p>' + message + '</p>')
}

// Push chat to the messages window
function chatPushImage(origin, imgDataURL) {
    var img = document.createElement('img');
    img.className = 'msgImg';
    img.onload = function() {
        showLatestMessage();
    }
    img.src = imgDataURL;
    chatPushCommon(origin, img);
}

function rotateImg(img, canvas, context, orientation) {
    var rotationVal = 0;

    switch (orientation) {
        case 3: // Rotate -180
        case 4: // Rotate -180, Mirrored. Treat as case 3 for now
            canvas.width = img.width;
            canvas.height = img.height;
            rotationVal = (-Math.PI);
            break;
        case 5: // Rotate 90, Mirrored. Treat as case 6 for now
        case 6: // Rotate 90
            canvas.width = Math.min(img.width, img.height);
            canvas.height = Math.max(img.width, img.height);
            rotationVal = (0.5 * Math.PI);
            break;
        case 7: // Rotate -90, Mirrored. Treat as case 8 for now
        case 8: // Rotate -90
            canvas.width = Math.min(img.width, img.height);
            canvas.height = Math.max(img.width, img.height);
            rotationVal = (-0.5 * Math.PI);
            break;
        case 1: // Normal
        case 2: // Normal, Mirrored. Treat as case 1 for now
        default: // Undefined. Treat as normal
            canvas.width = img.width;
            canvas.height = img.height;
    }

    // alert('img.width = ' + img.width + ' img.height = ' + img.height);
    // alert('canvas.width = ' + canvas.width + ' canvas.height = ' + canvas.height);

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotationVal);
    context.drawImage(img, -img.width / 2, -img.height / 2);
    context.restore();
}

function resizeImg(rotatedCanvas, canvas, context) {
    // Constants
    const MSG_IMG_MAX_WIDTH = 640;
    const MSG_IMG_MAX_HEIGHT = 480;

    var aspectRatio = rotatedCanvas.width / rotatedCanvas.height;
    var isHorizontal = (rotatedCanvas.width > rotatedCanvas.height);
    var isSquare = (rotatedCanvas.width == rotatedCanvas.height);

    if ((rotatedCanvas.width > MSG_IMG_MAX_WIDTH) && (isHorizontal || isSquare)) {
        canvas.width = MSG_IMG_MAX_WIDTH;
        canvas.height = MSG_IMG_MAX_WIDTH / aspectRatio;
    } else if ((rotatedCanvas.height > MSG_IMG_MAX_HEIGHT)) {
        canvas.width = MSG_IMG_MAX_HEIGHT * aspectRatio;
        canvas.height = MSG_IMG_MAX_HEIGHT;
    } else {
        // img is less that MAX_IMG sizes
        // send as is
        canvas.width = rotatedCanvas.width;
        canvas.height = rotatedCanvas.height;
    }

    context.drawImage(rotatedCanvas, 0, 0, canvas.width, canvas.height);
}

// Resize image for easier transfer and uniform display
function processImg(div, imgDataURL, callback) {
    var img = document.createElement('img');
    img.className = 'hiddenImg';
    img.onload = function() {
        EXIF.getData(this, function() {
            var orientation = EXIF.getTag(this, "Orientation");
            var rotatedCanvas = document.createElement('canvas');
            var rotatedContext = rotatedCanvas.getContext('2d');
            var scaledCanvas = document.createElement('canvas');
            var scaledContext = scaledCanvas.getContext('2d');
            rotateImg(img, rotatedCanvas, rotatedContext, orientation);
            resizeImg(rotatedCanvas, scaledCanvas, scaledContext)

            // Remove the temporary img element 
            $(div).children('img').remove();

            if (callback) {
                callback(scaledCanvas.toDataURL());
            }
        });
    }
    img.src = imgDataURL;

    $(div).append(img);
}
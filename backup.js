  var imgWidth = img.width;
  var imgHeight = img.height;
  var aspectRatio = imgWidth / imgHeight;
  var isHorizontal = (imgWidth > imgHeight);
  var isSquare = (imgHeight == imgWidth);
  var finalWidth;
  var finalHeight;

  alert('width = ' + imgWidth + ', height = ' + imgHeight);

  console.log('imgWidth', imgWidth);
  console.log('imgHeight', imgHeight);

  if ((imgWidth > MSG_IMG_MAX_WIDTH) && (isHorizontal || isSquare)) {
      finalWidth = MSG_IMG_MAX_WIDTH;
      finalHeight = MSG_IMG_MAX_WIDTH / aspectRatio;
  } else if ((imgHeight > MSG_IMG_MAX_HEIGHT)) {
      finalWidth = MSG_IMG_MAX_HEIGHT * aspectRatio;
      finalHeight = MSG_IMG_MAX_HEIGHT;
  } else {
      // img is less that MAX_IMG sizes
      // send as is
      finalWidth = imgWidth;
      finalHeight = imgHeight;
  }

  var scaledCanvas = document.createElement('canvas');
  var scaledContext = scaledCanvas.getContext('2d');
  scaledCanvas.width = finalWidth;
  scaledCanvas.height = finalHeight;

  // Rotate the image if needed
  if (isHorizontal || isSquare) {
      scaledContext.drawImage(img, 0, 0, finalWidth, finalHeight);
  } else {
      var rotatedCanvas = document.createElement('canvas');
      var rotatedContext = rotatedCanvas.getContext('2d');
      rotatedCanvas.width = imgWidth;
      rotatedCanvas.height = imgHeight;

      rotatedContext.save();
      rotatedContext.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
      rotatedContext.rotate(Math.PI / 2);
      rotatedContext.drawImage(img, -rotatedCanvas.height / 2, -rotatedCanvas.width / 2);
      rotatedContext.restore();

      alert('width = ' + scaledCanvas.width + ', height = ' + scaledCanvas.height);

      scaledContext.drawImage(rotatedCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
  }

  return scaledCanvas.toDataURL();
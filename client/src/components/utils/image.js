export function zoomImg() {
    const hoverImages = document.querySelectorAll('.show-product-images__slider-img');
    const currentImage = document.querySelector('.show-product-images__current-img-item');
    const resultClass = document.querySelector('.show-product-images__current-img-zoom-result');

    if (hoverImages !== null && currentImage !== null && resultClass !== null) {
        function removeAllClass(nodeList, className) {
            nodeList.forEach(element => {
                element.style.borderColor = 'transparent';
                element.classList.remove(className);
            })
        }

        hoverImages.forEach(hoverImage => {
            hoverImage.addEventListener("mouseover", function (e) {
                removeAllClass(hoverImages, 'selected');
                currentImage.src = hoverImage.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
                e.target.classList.add('selected');
                imageZoom(currentImage, resultClass)
            });
            imageZoom(currentImage, resultClass)
        })
        currentImage.addEventListener('mouseover', function (e) {
            resultClass.style.visibility = 'visible';
        })
        currentImage.addEventListener('mouseout', function (e) {
            resultClass.style.visibility = 'hidden';
        })

        function imageZoom(imgClass, resultClass) {
            let img, lens, result, cx, cy;
            img = imgClass;
            result = resultClass;
            lens = document.querySelector('.show-product-images__current-img-zoom-lens')
            cx = result.offsetWidth / lens.offsetWidth;
            cy = result.offsetHeight / lens.offsetHeight;
            result.style.backgroundImage = "url('" + img.src + "')";
            result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
            lens.addEventListener("mousemove", moveLens);
            img.addEventListener("mousemove", moveLens);
            lens.addEventListener("touchmove", moveLens);
            img.addEventListener("touchmove", moveLens);

            function moveLens(e) {
                let pos, x, y;
                e.preventDefault();
                pos = getCursorPos(e);
                x = pos.x - (lens.offsetWidth / 2);
                y = pos.y - (lens.offsetHeight / 2);
                if (x > img.width - lens.offsetWidth) {
                    x = img.width - lens.offsetWidth;
                }
                if (x < 0) {
                    x = 0;
                }
                if (y > img.height - lens.offsetHeight) {
                    y = img.height - lens.offsetHeight;
                }
                if (y < 0) {
                    y = 0;
                }
                lens.style.left = x + "px";
                lens.style.top = y + "px";
                result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
            }

            function getCursorPos(e) {
                let a, x = 0, y = 0;
                e = e || window.event;
                a = img.getBoundingClientRect();
                x = e.pageX - a.left;
                y = e.pageY - a.top;
                x = x - window.pageXOffset;
                y = y - window.pageYOffset;
                return {x: x, y: y};
            }
        }
    }
}
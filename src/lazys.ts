const visibilityCheck = (target) => {
    var style = getComputedStyle(target)

    if (target.offsetHeight === 0 ||
        style.display === 'none' ||
        style.visibility !== 'visible' ||
        parseFloat(style.opacity || '') <= 0.0 ||
        parseInt(style.height || '', 10) <= 0 ||
        parseInt(style.width || '', 10) <= 0
    ) {
        return false
    }
    return true
}

const elements_visible_check = (images) => {
    for (let i = 0; i < images.length; i++) {
        if (visibilityCheck(images[i])) {
            return false;
        }
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazys"));
    if ('loading' in HTMLImageElement.prototype && elements_visible_check(lazyImages)) {
        lazyImages.forEach(function (lazyImage) {
            lazyImage.setAttribute("loading", "lazy");
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
        });
    } else if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target as HTMLImageElement;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.srcset = lazyImage.dataset.srcset;
                    lazyImage.classList.remove("lazys");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});
let imageList = [];
let currentIndex = 0;
let timer;

function loadImageList() {
    console.log("Loading image list...");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "images.txt", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("images.txt loaded.");
            const lines = xhr.responseText.trim().split("\n");
            imageList = lines.map(line => {
                const [file, duration] = line.trim().split(",");
                return {
                    file: "images/" + file.trim(),
                    duration: parseInt(duration.trim())
                };
            });
            console.log("Parsed image list:", imageList);

            if (imageList.length > 0) {
                currentIndex = 0;
                showImage();
            } else {
                console.error("Image list is empty.");
            }
        } else {
            console.error("Error loading images.txt", xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error("AJAX error while loading images.txt");
    };
    xhr.send();
}

function showImage() {
    if (imageList.length === 0) return;

    clearTimeout(timer);
    const imageObj = imageList[currentIndex];
    const img = $("#gallery-image");

    console.log("Showing image:", imageObj.file);

    img.fadeOut(300, function () {
        img.attr("src", imageObj.file).fadeIn(300);
    });

    timer = setTimeout(() => {
        currentIndex = (currentIndex + 1) % imageList.length;
        showImage();
    }, imageObj.duration);
}

function showNext() {
    clearTimeout(timer);
    currentIndex = (currentIndex + 1) % imageList.length;
    showImage();
}

function showPrevious() {
    clearTimeout(timer);
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    showImage();
}

$(document).ready(function () {
    console.log("Document ready.");
    $("#next").click(showNext);
    $("#prev").click(showPrevious);
    $("#update").click(loadImageList);

    loadImageList(); // load at start
});

export function pageHandle(element, event) {
    const listUploadAttr = ["choose-file", "upload-btn", "input-number"];

    let result;
    listUploadAttr.some((attr) => {
        if (attr.match(element.getAttribute("upload-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const getFileInput = (inputElement) => {
        let data = new FormData();
        inputElement.onchange = function (event) {
            let fileList = inputElement.files;
            console.log(fileList);
        };
    };

    switch (result[0]) {
        case "choose-file": {
            const previewImages = document.querySelectorAll(".preview-images");

            if (previewImages) {
                previewImages.forEach((img) => img.remove());
            }

            window.onchange = (e) => {
                let output = document.querySelector(".product-upload__image");
                let images = e.target.files;
                if (images) {
                    Array.from(images).forEach((image) => {
                        let img = new Image();
                        img.classList.add("preview-images");
                        img.title = image.name;
                        img.src = URL.createObjectURL(image);
                        output.appendChild(img);
                        output.onload = function () {
                            URL.revokeObjectURL(img.src);
                        };
                    });
                }
            };
            break;
        }

        case "upload-btn": {
            event.preventDefault();
            let formData = new FormData();

            const input = document.querySelector("#product-upload__form").querySelectorAll('input[type="text"]');

            input.forEach((i) => {
                formData.append(i.name, i.value);
            });

            let images = document.getElementById("image").files;
            Array.from(images).forEach((img) => {
                formData.append("images", img, img.name);
            });

            const sale = document.querySelector(".product-upload__sale-checkbox:checked");

            sale ? formData.append("sale", true) : formData.append("sale", false);

            const description = document.getElementById("description").value;
            formData.append("description", description);

            $.ajax({
                type: "POST",
                url: "/product/add",
                contentType: false,
                processData: false,
                data: formData,
            }).done((res) => {
                console.log(res);
            });
            break;
        }

        case "input-number": {
            result[1].addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/^0+/, "").replace(/[^0-9]/g, "");
            });
            break;
        }
    }
}

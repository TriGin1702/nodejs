// // const products = [];

function product(brand, name, description, type, gia, image) {
    this.brand = brand;
    this.name = name;
    this.description = description;
    this.type = type;
    this.gia = gia;
    this.image = image;
}

// // async function inputForms() {
// //     const infors = document.querySelectorAll('.more');
// //     infors.forEach((element) => {
// //         const name = element.querySelector('.name').value;
// //         const description = element.querySelector('.description').value;
// //         const gia = element.querySelector('.gia').value;
// //         const image = element.querySelector('.image').files[0].name;
// //         const brandSelect = element.querySelector('.brand');
// //         const brand = brandSelect.options[brandSelect.selectedIndex].value;
// //         const typeSelect = element.querySelector('.type');
// //         const type = typeSelect.options[typeSelect.selectedIndex].value;
// //         const newProduct1 = new product(brand, name, description, type, gia, image);
// //         products.push(newProduct1);
// //         console.log(products);
// //     });
// //     const inputs = document.querySelectorAll('.more input, .more textarea, .more img');
// //     inputs.forEach((input) => {
// //         input.value = '';
// //     });
// //     await send(products);
// //     products.length = 0;
// // }

async function inputForm(event) {
    const inputone = event.target.closest('.more');
    if (event.target.closest('.btn2') === inputone.querySelector('.btn2')) {

        const name = inputone.querySelector('.name').value;
        const description = inputone.querySelector('.description').value;
        const gia = inputone.querySelector('.gia').value;
        const image = inputone.querySelector('.image').files[0];
        const brandSelect = inputone.querySelector('.brand');
        const brand = brandSelect.options[brandSelect.selectedIndex].value;
        const typeSelect = inputone.querySelector('.type');
        const type = typeSelect.options[typeSelect.selectedIndex].value;

        // Tạo đối tượng FormData và thêm dữ liệu và file vào đó
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('gia', gia);
        formData.append('brand', brand);
        formData.append('type', type);
        formData.append('image', image);

        // Gọi hàm send với đối tượng FormData
        await send(formData);

        const inputs = inputone.querySelectorAll('.more textarea');
        inputs.forEach((input) => {
            input.value = '';
        });
    }
}

function previewImage(event) {
    var input = event.target.closest('.image');
    var preview = input.parentElement.querySelector('.preview');
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function Moreproduct() {
    const elements = document.querySelector('.more');
    const form = document.querySelector('.form');
    const saveAll = document.getElementById('allsave');
    saveAll.remove();
    const newDiv = document.createElement('div');
    newDiv.className = 'more';
    newDiv.innerHTML = elements.innerHTML;
    const saveAllButton = document.createElement('button');
    saveAllButton.type = 'submit';
    saveAllButton.className = 'btn btn-success';
    saveAllButton.id = 'allsave';
    saveAllButton.style.float = 'right';
    saveAllButton.style.marginRight = '20px';
    saveAllButton.textContent = 'Save All';

    newDiv.appendChild(saveAllButton);
    form.appendChild(newDiv);
}

async function send(formData) {
    try {
        const response = await fetch("/home", {
            method: "POST",
            body: formData, // Gửi FormData thay vì JSON.stringify(data)
        });

        const result = await response.text();
        console.log("Success:", result);
    } catch (error) {
        console.log("Error:", error);
    }
}
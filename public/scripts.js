// const input = document.querySelector('input[name="price"]')// seleciona o input valor
// input.addEventListener("keydown", function(e) {// pega o que ta sendo digitado

//     setTimeout(function() { // função setTimeout faz espera 1 milesegundos pra a fução que ta dentro funcionar

//         let { value } = e.target

//         value = value.replace(/\D/g,"") // tira tods potos e vigula e digito e troca por vazio

//         // formato em real
//         value = new Intl.NumberFormat('pt-BR', { // formato do brasil
//             style: 'currency', // 1 = 1.000
//             currency: 'BRL'    // R$
//         }).format(value/100) 

//         e.target.value = value

//     }, 1);


// })

const Mask = {
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "") // tira tods potos e vigula e digito e troca por vazio

        // formato em real
        return new Intl.NumberFormat('pt-BR', { // formato do brasil
            style: 'currency', // 1 = 1.000
            currency: 'BRL'    // R$
        }).format(value / 100)
    }
}

const PhotosUpload = {

    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6, // limite e fotos 6 exemplo 7 ai so pode colocar 7 fotos
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            // cria uma imagem
            reader.onload = () => {
                const image = new Image() /* <img/> */
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        // Cria uma div
        const div = document.createElement('div')
        // Adiciona uma foto
        div.classList.add('photo')

        // cria uma funcionalidade de click
        div.onclick = PhotosUpload.removePhoto

        // coloca uma imagem dentro da div
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    // Remove as button
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    // Remove a imagme
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photos">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    }

}
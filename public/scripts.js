const Mask = {
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "") // tira tods pontos e vigula e digito e troca por vazio

        // formato em real
        return new Intl.NumberFormat('pt-BR', { // formato do brasil
            style: 'currency', // 1 = 1.000
            currency: 'BRL'    // R$
        }).format(value/100)
    }
}

// PHOTOS UPLOAD

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6, // limite de seis fotos
    files: [],
    handleFileInput(event) {
            const { files: fileList } = event.target
            PhotosUpload.input = event.target
           
            if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)



            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image() // = <img/>
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
          // Cria uma <div></div>
          const div = document.createElement('div') 
          div.classList.add('photo')

          div.onclick = PhotosUpload.removePhoto

          div.appendChild(image)

          div.appendChild(PhotosUpload.getRemoveButton())

          return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photos">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    // clica na imagem e exclui
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }

}



// imagem 
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'), // seleciona a imagem grande // 01
    preview: document.querySelectorAll('.gallery-preview img'), // pega todas as imagem
    setImage(e){
        const { target } = e

        //remove todas imagem active
        ImageGallery.preview.forEach(preview => preview.classList.remove('active'))

        // Seleciona todas imagem e ativa
        target.classList.add('active') // as imagem pequena fica ativa ao clicar

        // 01
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    //abrir
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    //fechar
    close() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

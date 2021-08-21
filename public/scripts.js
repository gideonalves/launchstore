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
        }).format(value / 100)
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "") // tira tods pontos e vigula e digito e troca por vazio

        // limita os numero depois do cnpj só deixa digitar 14 digitos
        if (value.length > 14)
            value = value.slice(0, -1)

        // verifica se é cnpj - 11.222.333/0001-11
        if (value.length > 11) {
            //11222333444455

            // 11.222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")

            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

             // 11.222.333/444455
             value = value.replace(/(\d{3})(\d)/, "$1/$2")

             // 11.222.333/4444-55
             value = value.replace(/(\d{4})(\d)/, "$1-$2")
        }else{
        // verifica se é cpf 111.222.333-44
              value = value.replace(/(\d{3})(\d)/, "$1.$2")

              value = value.replace(/(\d{3})(\d)/, "$1.$2")

              value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    }, 
    cep(value) {
        value = value.replace(/\D/g, "")


        if (value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
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

        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

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

        PhotosUpload.updateInputFiles()

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

        const newFiles = Array.from(PhotosUpload.preview.children).filter(function(file) {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })
        const index = newFiles.indexOf(photoDiv)
        PhotosUpload.files.splice(index, 1)

        PhotosUpload.updateInputFiles()

        photoDiv.remove()
    },

    // clica na imagem e exclui
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },

    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

    }

}

// imagem 
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'), // seleciona a imagem grande // 01
    preview: document.querySelectorAll('.gallery-preview img'), // pega todas as imagem
    setImage(e) {
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


// validação do email
const Validade = {
    //apply = aplique
    apply(input, func) {
        Validade.clearErrors(input)


       let results =  Validade[func](input.value)
       input.value = results.value

       if(results.error)
            Validade.displayError(input, results.error)

    },
    // Coloca uma mensagem de erro (email invalido)
    displayError(input, error) {
        const div = document.createElement('div') // cria uma div
        div.classList.add('error') // coloca a class error dentro da div
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    // Função faz limpar o input do email
    clearErrors(input) {
       const errorDiv = input.parentNode.querySelector(".error")
       if (errorDiv)
          errorDiv.remove()
    },

    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    },

    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto"
        }
        else if (cleanValues.length < 12 && cleanValues.length !== 11 ) {
            error = "CPF incorreto"
        }    

        return {
            error,
            value
        }
    },

    isCep(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length !== 8) {
            error = "CEP incorreto"
        }


        return {
            error,
            value
        }

    }

}

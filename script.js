const entradaArquivo = document.querySelector(".entrada-arquivo"),
    opcoesFiltro = document.querySelectorAll(".filtro button"),
    nomeFiltro = document.querySelector(".info-filtro .nome"),
    valorFiltro = document.querySelector(".info-filtro .valor"),
    sliderFiltro = document.querySelector(".slider input"),
    opcoesGirar = document.querySelectorAll(".girar button"),
    imgPreview = document.querySelector(".imagem-preview img"),
    btnRedefinirFiltro = document.querySelector(".redefinir-filtro"),
    btnEscolherImagem = document.querySelector(".escolher-imagem"),
    btnSalvarImagem = document.querySelector(".salvar-imagem");

let brilho = "100", saturacao = "100", contraste = "0", cor = "0";
let girar = 0, virarHorizontal = 1, virarVertical = 1;

const carregarImagem = () => {
    let arquivo = entradaArquivo.files[0];
    if (!arquivo) return;
    imgPreview.src = URL.createObjectURL(arquivo);
    imgPreview.addEventListener("load", () => {
        btnRedefinirFiltro.click();
        document.querySelector(".container").classList.remove("desabilitado");
    });
}

const aplicarFiltro = () => {
    imgPreview.style.transform = `rotate(${girar}deg) scale(${virarHorizontal}, ${virarVertical})`;
    imgPreview.style.filter = `brightness(${brilho}%) saturate(${saturacao}%) invert(${contraste}%) grayscale(${cor}%)`;
}

opcoesFiltro.forEach(opcao => {
    opcao.addEventListener("click", () => {
        document.querySelector(".ativo").classList.remove("ativo");
        opcao.classList.add("ativo");
        nomeFiltro.innerText = opcao.innerText;
        if (opcao.id === "brilho") {
            sliderFiltro.max = "200";
            sliderFiltro.value = brilho;
            valorFiltro.innerText = `${brilho}%`;
        } else if (opcao.id === "saturacao") {
            sliderFiltro.max = "200";
            sliderFiltro.value = saturacao;
            valorFiltro.innerText = `${saturacao}%`
        } else if (opcao.id === "contraste") {
            sliderFiltro.max = "100";
            sliderFiltro.value = contraste;
            valorFiltro.innerText = `${contraste}%`;
        } else {
            sliderFiltro.max = "100";
            sliderFiltro.value = cor;
            valorFiltro.innerText = `${cor}%`;
        }
    });
});

const atualizarFiltro = () => {
    valorFiltro.innerText = `${sliderFiltro.value}%`;
    const filtroSelecionado = document.querySelector(".filtro .ativo");
    if (filtroSelecionado.id === "brilho") {
        brilho = sliderFiltro.value;
    } else if (filtroSelecionado.id === "saturacao") {
        saturacao = sliderFiltro.value;
    } else if (filtroSelecionado.id === "contraste") {
        contraste = sliderFiltro.value;
    } else {
        cor = sliderFiltro.value;
    }
    aplicarFiltro();
}

opcoesGirar.forEach(opcao => {
    opcao.addEventListener("click", () => {
        if (opcao.id === "esquerda") {
            girar -= 90;
        } else if (opcao.id === "direita") {
            girar += 90;
        } else if (opcao.id === "horizontal") {
            virarHorizontal = virarHorizontal === 1 ? -1 : 1;
        } else {
            virarVertical = virarVertical === 1 ? -1 : 1;
        }
        aplicarFiltro();
    });
});

const redefinirFiltro = () => {
    brilho = "100"; saturacao = "100"; contraste = "0"; cor = "0";
    girar = 0; virarHorizontal = 1; virarVertical = 1;
    opcoesFiltro[0].click();
    aplicarFiltro();
}

const salvarImagem = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgPreview.naturalWidth;
    canvas.height = imgPreview.naturalHeight;

    ctx.filter = `brightness(${brilho}%) saturate(${saturacao}%) invert(${contraste}%) grayscale(${cor}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (girar !== 0) {
        ctx.rotate(girar * Math.PI / 180);
    }
    ctx.scale(virarHorizontal, virarVertical);
    ctx.drawImage(imgPreview, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "imagem.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

sliderFiltro.addEventListener("input", atualizarFiltro);
btnRedefinirFiltro.addEventListener("click", redefinirFiltro);
btnSalvarImagem.addEventListener("click", salvarImagem);
entradaArquivo.addEventListener("change", carregarImagem);
btnEscolherImagem.addEventListener("click", () => entradaArquivo.click());

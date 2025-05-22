document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projetos-container");
    const projetosProntos = document.getElementById("projetosProntos");

    const novoProjeto = document.createElement("article");
    novoProjeto.className = "col-1 article-figure-card";
    novoProjeto.dataset.id = "novoProjeto";
    novoProjeto.innerHTML = `
    <figure class="projeto-card novo-projeto">
        <a href="#" class="no-underline" style="all: unset; cursor: pointer;">
            <div class="grid-fundo-novo novo d-flex justify-content-center align-items-center">
                <i class="fas fa-plus fa-2x text-white bg-black bg-opacity-75 rounded-circle p-3"></i>
            </div>
            <figcaption class="text-center mt-2">Novo Projeto</figcaption>
        </a>
    </figure>

    <div class="d-flex justify-content-between align-items-center mt-2" >
        <p class="mb-0">Novo Projeto</p>
        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
        </button>
    </div>        
`;

    const projetoPronto1 = document.createElement("article");
    projetoPronto1.className = "col-1 article-figure-card";
    projetoPronto1.dataset.id = "1";
    projetoPronto1.innerHTML = `
        <figure class="projeto-card">
            <a href="#">
                <div class="grid-fundo novo"></div>
                <figcaption class="text-center mt-2">Casa</figcaption>
            </a>
        </figure>

        <div class="d-flex justify-content-between align-items-center mt-2">
        <p class="mb-0">Casa 1</p>
        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
        </button>
    </div>        
    `;
    const projetoPronto2 = document.createElement("article");
    projetoPronto2.className = "col-1 article-figure-card";
    projetoPronto2.dataset.id = "2";
    projetoPronto2.innerHTML = `
        <figure class="projeto-card">
            <a href="#">
                <div class="grid-fundo novo"></div>
                <figcaption class="text-center mt-2">Casa 2</figcaption>
            </a>
        </figure>

        <div class="d-flex justify-content-between align-items-center mt-2">
        <p class="mb-0">Casa 2</p>
        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
        </button>
    </div>        
    `;
    const projetoPronto3 = document.createElement("article");
    projetoPronto3.className = "col-1 article-figure-card";
    projetoPronto3.dataset.id = "3";
    projetoPronto3.innerHTML = `
        <figure class="projeto-card">
            <a href="#">
                <div class="grid-fundo novo"></div>
                <figcaption class="text-center mt-2">Casa 3</figcaption>
            </a>
        </figure>

        <div class="d-flex justify-content-between align-items-center mt-2">
        <p class="mb-0">Casa 3</p>
        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
        </button>
    </div>        
    `;

    // evento só para o "novo projeto"
    projetoPronto1.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "1");
        window.location.href = "../html/teste.html";
    });
    projetoPronto2.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "2");
        window.location.href = "../html/teste.html";
    });
    projetoPronto3.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "3");
        window.location.href = "../html/teste.html";
    });
    novoProjeto.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "novoProjeto");
        window.location.href = "../html/teste.html";
    });

    projetosProntos.append(novoProjeto, projetoPronto1, projetoPronto2, projetoPronto3);

    // carrega os outros projetos normalmente
    fetch(`http://localhost:8080/Constructo/php/listaProjetos.php`)
        .then(response => response.json())
        .then(projetos => {
            projetos.forEach(projeto => {
                const article = document.createElement("article");
                article.className = "col-1 article-figure-card";
                article.dataset.id = projeto.id;

                article.innerHTML = `
                <figure class="projeto-card mb-0">
                    <a href="#" class="text-decoration-none">
                        <div class="grid-fundo"></div>
                        <figcaption class="text-center mt-0 pt-1 small">${projeto.nome}</figcaption>
                    </a>
                </figure>
                <div class="d-flex align-items-center" >
                    <p class="mb-0 pe-1" font-size: 0.8rem;">${projeto.nome}</p>
                    <button class="btn btn-sm btn-link text-danger btn-deletar " >
                        <i class="fas fa-trash" style="font-size: 0.7rem;"></i>
                    </button>
                </div>
                `;

                // evento de clique pro projeto
                article.addEventListener("click", function () {
                    const id = this.dataset.id;
                    if (id) {
                        localStorage.setItem("idProjeto", id);
                        window.location.href = "../html/teste.html";
                    }
                });

                // evento de deletar
                const botaoDeletar = article.querySelector(".btn-deletar");
                botaoDeletar.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    Swal.fire({
                        title: "Tem certeza?",
                        text: "Isso vai apagar o projeto permanentemente.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sim, deletar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch("http://localhost:8080/Constructo/php/deletar.php", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: `id=${projeto.id}`
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        Swal.fire("Deletado!", "Projeto removido com sucesso.", "success")
                                            .then(() => article.remove());
                                    } else {
                                        Swal.fire("Erro", data.error || "Erro ao deletar", "error");
                                    }
                                })
                                .catch(err => {
                                    Swal.fire("Erro", "Erro ao comunicar com o servidor", "error");
                                });
                        }
                    });
                });

                container.appendChild(article);
            });
        })
        .catch(error => console.error("Erro ao carregar os projetos:", error));
});

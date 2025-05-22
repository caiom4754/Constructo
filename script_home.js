document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projetos-container");

    const projetosProntos = document.getElementById("projetosProntos");

    // adiciona manualmente o card de novo projeto
    const novoProjeto = document.createElement("article");
    novoProjeto.className = "col-md-3";
    novoProjeto.dataset.id = "novoProjeto";
    novoProjeto.innerHTML = `
        <figure class="projeto-card">
            <a href="#">
                <div class="grid-fundo novo"></div>
                <figcaption class="text-center mt-2">Novo Projeto</figcaption>
            </a>
        </figure>

        <div class="d-flex justify-content-between align-items-center mt-2">
        <p class="mb-0">Novo Projeto</p>
        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
        </button>
    </div>        
    `;

    const projetoPronto1 = document.createElement("article");
    projetoPronto1.className = "col-md-3";
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
    projetoPronto2.className = "col-md-3";
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
    projetoPronto3.className = "col-md-3";
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
        window.location.href = "teste.html";
    });
    projetoPronto2.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "2");
        window.location.href = "teste.html";
    });
    projetoPronto3.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "3");
        window.location.href = "teste.html";
    });
    novoProjeto.addEventListener("click", () => {
        localStorage.setItem("idProjeto", "novoProjeto");
        window.location.href = "teste.html";
    });

    projetosProntos.append(novoProjeto, projetoPronto1, projetoPronto2, projetoPronto3);

    // carrega os outros projetos normalmente
    fetch(`http://localhost:8080/Constructo/listaProjetos.php`)
        .then(response => response.json())
        .then(projetos => {
            projetos.forEach(projeto => {
                const article = document.createElement("article");
                article.className = "col-md-3";
                article.dataset.id = projeto.id;

                article.innerHTML = `
                    <figure class="projeto-card">
                        <a href="#">
                            <div class="grid-fundo"></div>
                            <figcaption class="text-center mt-2">${projeto.nome}</figcaption>
                        </a>
                    </figure>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <p class="mb-0">${projeto.nome}</p>
                        <button class="btn btn-sm btn-link text-danger btn-deletar" title="Excluir projeto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // evento de clique pro projeto
                article.addEventListener("click", function () {
                    const id = this.dataset.id;
                    if (id) {
                        localStorage.setItem("idProjeto", id);
                        window.location.href = "teste.html";
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
                            fetch("http://localhost:8080/Constructo/deletar.php", {
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

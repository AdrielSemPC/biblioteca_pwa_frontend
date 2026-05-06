export const getEmprestimosAPI = async () => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }
    )
    const d = await r.json();
    return d;
}

export const getEmprestimoPorCodigoAPI = async codigo => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos/${codigo}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }
    )
    const d = await r.json();
    return d;
}

export const deleteEmprestimoPorCodigoAPI = async codigo => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos/${codigo}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }
    )
    const d = await r.json();
    return d;
}

export const cadastrarEmprestimoAPI = async (objeto) => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objeto)
        }
    )
    const d = await r.json();
    return d;
}

export const alterarEmprestimoAPI = async (objeto) => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos/${objeto.id_emprestimo}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objeto)
        }
    )
    const d = await r.json();
    return d;
}

export const finalizarEmprestimoAPI = async (id, multa = 0) => {
    const r = await fetch(`${process.env.REACT_APP_ENDERECO_API}/emprestimos/${id}/finalizar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id_emprestimo: id,
            valor_multa: multa 
        })
    });
    return await r.json();
}

import { useState, useEffect } from "react";

import {
  getEmprestimosAPI,
  getEmprestimoPorCodigoAPI,
  deleteEmprestimoPorCodigoAPI,
  cadastrarEmprestimoAPI,
  finalizarEmprestimoAPI
} from '../../../servicos/EmprestimoServico';
import { getClientesAPI } from '../../../servicos/ClienteServico';
import { getBibliotecariosAPI } from '../../../servicos/BibliotecarioServico';
import { getLivrosAPI } from '../../../servicos/LivroServico';

import Carregando from "../../reutilizaveis/Carregando";
import EmprestimoContext from "./EmprestimoContext";
import EmprestimoTabela from "./EmprestimoTabela";
import EmprestimoFormulario from "./EmprestimoFormulario";

function Emprestimo() {
    const estadoInicial = {
        id_agendamento: 0,
        id_cliente: 0,
        id_livro: 0,
        id_bibliotecario: 0,
        status: "ATIVO",
        data_inicio: null,
        data_fim: null,
        data_devolucao: null
    };

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [exibirForm, setExibirForm] = useState(false);
    const [objeto, setObjeto] = useState(estadoInicial);
    const [carregando, setCarregando] = useState(true);
    const [clientes, setClientes] = useState([]);
    const [livros, setLivros] = useState([]);
    const [bibliotecarios, setBibliotecarios] = useState([]);

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const [listaClientes, listaLivros, listaBiblio] = await Promise.all([
                    getClientesAPI(),
                    getLivrosAPI(),
                    getBibliotecariosAPI()
                ]);
                setClientes(listaClientes);
                setLivros(listaLivros);
                setBibliotecarios(listaBiblio);
                await recuperaEmprestimos();
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao carregar dados auxiliares." });
            } finally {
                setCarregando(false);
            }
        }
        carregarDadosIniciais();
    }, []);

    const recuperaEmprestimos = async () => {
        setCarregando(true);
        try {
            const dados = await getEmprestimosAPI();
            setListaObjetos(dados);
        } catch (err) {
            setAlerta({ status: "error", message: err.message });
        } finally {
            setCarregando(false);
        }
    };

    const remover = async (id_agendamento) => {
        if (window.confirm('Deseja remover este empréstimo?')) {
            try {
                const respostaAPI = await deleteEmprestimoPorCodigoAPI(id_agendamento);
                setAlerta({ status: "success", message: respostaAPI.message });
                await recuperaEmprestimos();
            } catch (err) {
                setAlerta({ status: "error", message: err.message });
            }
        }
    };

    const finalizar = async (id) => {
    try {
        const respostaAPI = await finalizarEmprestimoAPI(id);
        setAlerta({ status: respostaAPI.status, message: respostaAPI.message });
        recuperaEmprestimos();
    } catch (err) {
        setAlerta({ status: "error", message: "Erro ao finalizar: " + err });
    }
};

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto(estadoInicial);
        setExibirForm(true);
    };

    const editarObjeto = async (id_agendamento) => {
        try {
            const dados = await getEmprestimoPorCodigoAPI(id_agendamento);
            setObjeto(dados);
            setEditar(true);
            setAlerta({ status: "", message: "" });
            setExibirForm(true);
        } catch (err) {
            setAlerta({ status: "error", message: "Erro ao buscar dados do empréstimo." });
        }
    };


  const acaoCadastrar = async (e) => {
        e.preventDefault();
        
        try {
            let respostaAPI;
            
            if (editar) {
                // Chama a função PUT
                respostaAPI = await alterarEmprestimoAPI(objeto);
            } else {
                // Chama a função POST
                respostaAPI = await cadastrarEmprestimoAPI(objeto);
            }

            setAlerta({ status: respostaAPI.status, message: respostaAPI.message });
            
            // Se a operação foi bem sucedida
            if (respostaAPI.status === "success") {
                setObjeto(respostaAPI.objeto);
                setExibirForm(false); // Fecha o modal/formulário ao ter sucesso
                recuperaEmprestimos(); // Atualiza a lista
            }
            
        } catch (err) {
            setAlerta({ status: "error", message: "Erro ao processar a requisição!" });
            console.error(err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setObjeto({ ...objeto, [name]: value });
    };

    return (
        <EmprestimoContext.Provider value={{
                exibirForm,
                alerta,
                listaObjetos,
                remover,
                objeto,
                editarObjeto,
                acaoCadastrar,
                handleChange,
                novoObjeto,
                setExibirForm,
                clientes,
                livros,
                bibliotecarios,
                finalizar
        }}>
            <Carregando carregando={carregando}>
                <EmprestimoTabela />
            </Carregando>
            <EmprestimoFormulario />
        </EmprestimoContext.Provider>
    );
}

export default Emprestimo;

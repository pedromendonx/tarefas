import React, { useEffect, useState } from 'react';
import './ListaDeTarefas.css';

const App = () => {
  const [tarefasCompletas, setTarefasCompletas] = useState([]);
  const [tarefasPendentes, setTarefasPendentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resUsuarios, resTarefas] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/todos'),
        ]);

        if (!resUsuarios.ok || !resTarefas.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const [dadosUsuarios, dadosTarefas] = await Promise.all([
          resUsuarios.json(),
          resTarefas.json(),
        ]);

        setUsuarios(dadosUsuarios);

        const completas = dadosTarefas.filter(tarefa => tarefa.completed);
        const pendentes = dadosTarefas.filter(tarefa => !tarefa.completed);

        setTarefasCompletas(completas);
        setTarefasPendentes(pendentes);
      } catch (erro) {
        setErro(erro.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, []);

  const getNomeUsuario = userId => {
    const usuario = usuarios.find(user => user.id === userId);
    return usuario ? usuario.name : 'Usuário Desconhecido';
  };

  const moverParaCompletas = tarefaId => {
    const tarefaMovida = tarefasPendentes.find(tarefa => tarefa.id === tarefaId);
    if (tarefaMovida) {
      setTarefasPendentes(prev => prev.filter(tarefa => tarefa.id !== tarefaId));
      setTarefasCompletas(prev => [...prev, { ...tarefaMovida, completed: true }]);
      alert(`A tarefa "${tarefaMovida.title}" foi marcada como completa!`);
    }
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      <div className="tarefas-completas">
        <h2>Tarefas Completas</h2>
        {tarefasCompletas.length > 0 ? (
          tarefasCompletas.map(tarefa => (
            <div key={tarefa.id} className="tarefa-completa">
              <p>
                <strong>Usuário:</strong> {getNomeUsuario(tarefa.userId)}
              </p>
              <p>
                <strike>{tarefa.title}</strike>
              </p>
            </div>
          ))
        ) : (
          <p>Nenhuma tarefa completa.</p>
        )}
      </div>

      <div className="tarefas-pendentes">
        <h2>Tarefas Pendentes</h2>
        {tarefasPendentes.length > 0 ? (
          tarefasPendentes.map(tarefa => (
            <div
              key={tarefa.id}
              className="tarefa-pendente"
              onClick={() => moverParaCompletas(tarefa.id)}
              style={{ cursor: 'pointer' }}
            >
              <p>
                <strong>Usuário:</strong> {getNomeUsuario(tarefa.userId)}
              </p>
              <p>{tarefa.title}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma tarefa pendente.</p>
        )}
      </div>
    </div>
  );
};

export default App;

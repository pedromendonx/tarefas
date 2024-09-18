import React, { useEffect, useState } from 'react';
import './ListaDeTarefas.css'; 

const App = () => {
  const [tarefasCompletas, setTarefasCompletas] = useState([]);
  const [tarefasPendentes, setTarefasPendentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    
    const fetchUsuarios = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsuarios(data);
    };

    
    const fetchTarefas = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      
      
      const completas = data.filter(tarefa => tarefa.completed);
      const pendentes = data.filter(tarefa => !tarefa.completed);
      
      setTarefasCompletas(completas);
      setTarefasPendentes(pendentes);
    };

    fetchUsuarios();
    fetchTarefas();
  }, []);

  
  const getNomeUsuario = (userId) => {
    const usuario = usuarios.find(user => user.id === userId);
    return usuario ? usuario.name : 'Usuário Desconhecido';
  };

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      <div className="tarefas-completas">
        <h2>Tarefas Completas</h2>
        {tarefasCompletas.length > 0 ? (
          tarefasCompletas.map(tarefa => (
            <div key={tarefa.id}>
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
            <div key={tarefa.id}>
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

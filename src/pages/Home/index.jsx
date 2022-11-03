import React, { useState, useEffect } from 'react'
import { TrashSimple, Plus, UserSwitch } from "phosphor-react";
import './styles.css'

export function Home() {
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', avatar: '' })
  const [count, setCount] = useState(0);

  function addUser(){
    if(userName === ""){
      /* VALIDA INPUT VAZIO */
      document.getElementById("inputNameUser").placeholder = "Enter a participant name (required)";
      document.getElementById("inputNameUser").focus()
    } else{
      const newUser = {
        id: Math.floor(Date.now() * Math.random()).toString(36),
        name: userName,
        time: new Date().toLocaleTimeString('pt-br', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
      setUsers(prevState => [...prevState, newUser])

      /* REMOVE VALOR INPUT */
      document.getElementById("inputNameUser").focus()
      document.getElementById("list-users-legend").style.display = 'none';
    }
  } 

  const removeUser = (id) => {
    setUsers(users.filter((usuario) => usuario.id !== id));
    let listBeforeRemove = users.length -1

    if( listBeforeRemove === 0){
      document.getElementById("list-users-legend").style.display = 'block';
    }
  };
  
  function raffleUser(){
    /* PEGA O ARRAY DE USUÁRIOS E SORTEIA 1 */
    if(users.length <= 1){
      document.getElementById("inputNameUser").placeholder = "Digite um nome (campo obrigatório)";
      document.getElementById("inputNameUser").focus()
    } else{
      let u = users;
      let el = u[Math.floor(Math.random() * u.length)];
  
      document.getElementById("raffle-user").innerText = el.name;
      document.getElementById("container-raffle-user").style.display = 'block';
    }
  }

  useEffect(() => {
    fetch('https://api.github.com/users/shintaku-michel')
    .then(response => response.json())
    .then(data => {
      setUser({
        name: data.name,
        avatar: data.avatar_url,
        location: data.location,
        url: data.html_url
      })
    } )
  }, []);

  return (
    <div className='container'>
      <header>
        <div>
          <img src={user.avatar} alt="Imagem perfil" />
          <strong>{user.name}</strong>
          <span>Location: {user.location} - <a href={user.url}>gitHub</a></span>
        </div>
      </header>

      <h1>Single-page app to Raffle Gifts</h1>

      <input
        id="inputNameUser" 
        type="text" 
        placeholder="Enter a participant name"
        onChange={ callbackFuncao => setUserName(callbackFuncao.target.value)}
      />
      <div className='container-btns'>
        <button type="button" onClick={addUser}><Plus size={24} /> Add</button>
        <button type="button" onClick={
          function() {
            raffleUser()
            if(users.length >= 2){
              setCount(count + 1)
            }
          }
        }><UserSwitch size={24} /> Raffle user</button>
      </div>

      <div id='container-raffle-user'>
        <div>
          <p>Qtd. Sorteios: <span id='counter'>{count}</span></p>
          <span id="raffle-user"></span>
        </div>
      </div>

      <div className='list-users'>
        <h2>List of user <span>({users.length})</span></h2>

        <div id='list-users-legend'>[Empty list]</div>
      </div>

      {
        users.map( (usuario) => (
          <div className='card' key={usuario.id}>
              <div>
                  <p>Name: <strong>{usuario.name}</strong></p>
                  <p>Time: {usuario.time}</p>
              </div>
              <div>
                  <a onClick={ () => removeUser(usuario.id) }
                    className='link-card' 
                    href="#">
                    <TrashSimple size={24} /> <span className='btn_remove--text'>Remove</span>
                  </a>
              </div>
          </div>
        ))
      }
    </div>
  )
}

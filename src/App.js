import React, { Component } from 'react';
import logo from './logo.svg';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import InputCustom from './components/InputCustom.js';
import ButtonCustom from './components/ButtonCustom.js'


class App extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      lista :[],
      
      nome:'',
      email:'',
      senha:''
    }

    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  setNome(event)
  {
    this.setState({nome:event.target.value})
  }
  
  setEmail(event)
  {
    this.setState({email:event.target.value})
  }
  
  setSenha(event)
  {
    this.setState({senha:event.target.value})
  }

  enviaForm(evento)
  {
    evento.preventDefault();

    $.ajax({
      url:'https://cdc-react.herokuapp.com/api/autores',
      contentType: 'application/json',
      dataType: 'json',
      type:'post',
      data: JSON.stringify({nome:this.state.nome ,email:this.state.email, senha:this.state.senha }),
      success: function(resposta){
        console.log('enviado com sucesso');
        this.setState({lista:resposta})
      }.bind(this),
      error: function(resposta){
        console.log('erro');
      }

    });

    this.setState({nome:evento.target.nome.value});
    this.setState({email:evento.target.email.value});
    this.setState({senha:evento.target.senha.value});


    console.log(this.state);

  }


  componentDidMount()
  {
    $.ajax({
      url : "https://cdc-react.herokuapp.com/api/autores",
      dataType : 'json',
      success : function(resposta){
        this.setState({lista:resposta})
      }.bind(this)
    });
  }

  render() {
    return (
        <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">Company</a>

                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>

                  </ul>
              </div>
          </div>

          <div id="main">
            <div className="header">
              <h1>Cadastro de Autores</h1>
            </div>
            <div className="content" id="content">
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  onSubmit={this.enviaForm} method="post" >

                  <InputCustom label="Nome" id="nome" type="text" name="nome" value={this.state.name} onChange={this.setNome}  />
                  <InputCustom label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail}  />
                  <InputCustom label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha}  />

                  <ButtonCustom type="submit" texto="Gravar" />
                  
                </form>             

              </div>  
              <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.lista.map(function(autor){
                         return (       
                          <tr key={autor.id}>
                            <td>{autor.nome}</td>                
                            <td>{autor.email}</td>                
                          </tr>
                         ); 
                      })
                    }
                  </tbody>
                </table> 
              </div>             
            </div>
          </div>            
        </div>
    );
  }
}

export default App;

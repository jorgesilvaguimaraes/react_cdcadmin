import React, {Component} from 'react';
import $ from 'jquery';

import InputCustom from './InputCustom.js';
import ButtonCustom from './InputCustom.js';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros.js'

class FormularioAutor extends Component
{
    constructor(props)
    {
      super(props);
      this.state = {       
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
                PubSub.publish('lista',resposta);
                this.setState({nome:'', email:'', senha:''});

            }.bind(this),
            error: function(resposta){
                console.log('erro');
                if(resposta.status === 400)
                {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function()
            {
                PubSub.publish("limpa-erros",{});
            }
        });
    }



    render()
    {
        
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  onSubmit={this.enviaForm} method="post" >
                    <InputCustom label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}  />
                    <InputCustom label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail}  />
                    <InputCustom label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha}  />
                    <ButtonCustom type="submit" texto="Gravar" />
                </form>             
            </div>  
        );
    }
}

class TabelaAutores extends Component
{
   
    render()
    {
        return(
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
                        this.props.lista.map(function(autor){
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
        );
    }
}

export default class AutoBox extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {lista:[]};
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

        PubSub.subscribe('lista', function(topico, novaListagem){
            this.setState({lista:novaListagem});
        }.bind(this))
    }


    render()
    {
        return(
            <div>
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista} /> 
            </div>
        );
    }
}
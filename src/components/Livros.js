import React, {Component} from 'react';
import $ from 'jquery';
import InputCustom from './InputCustom.js';
import ButtonCustom from './ButtonCustom'
import TratadorErros from '../TratadorErros.js';
import PubSub from 'pubsub-js';


class FormLivro extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            titulo:'',
            preco:'',
            autorId: ''
        }
        this.enviaForm = this.enviaForm.bind(this);
    }



    salvaAlteracao(nomeInput, event)
    {
        var campoSendoAlterado = {};
        campoSendoAlterado[nomeInput] = event.target.value;
        this.setState(campoSendoAlterado);
    }

    enviaForm(event)
    {
        event.preventDefault();

        $.ajax({
            url : "https://cdc-react.herokuapp.com/api/livros",
            contentType : "application/json",
            dataType:"json",
            type:"post",
            data : JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId: this.state.autorId}),
            success : function(resposta){
                console.log('livros enviados com sucesso!');
                PubSub.publish('livros', resposta);
                this.setState({titulo:'',preco:'', autorId: ''});
            }.bind(this),
            error : function(resposta){
                if(resposta.status === 400)
                {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend :function(){
                PubSub.publish('limpa-erros', {})
            }

        });
    }

    render()
    {
        return (
            <div className="pure-form pure-form-aligned">
               
                <form className="pure-form pure-form-aligned"  onSubmit={this.enviaForm} method="post" >
                    <InputCustom label="Titulo" id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this, 'titulo')}  />
                    <InputCustom label="Preço" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.salvaAlteracao.bind(this, 'preco')}  />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">AutorId</label>     
                        <select id="autorId" name="autorId" value={this.state.autorId} onChange={this.salvaAlteracao.bind(this,'autorId')}>
                            <option value="">Selecione o Autor</option>
                            {
                                this.props.autores.map(function(autor){
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <ButtonCustom type="submit" texto="Gravar" />
                </form>   
            </div>
        );
    }
}

class TabelaLivros extends Component
{
    render()
    {
        return (
            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preco</th>
                        <th>Autor</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map(function(livro){
                            return (       
                            <tr key={livro.id}>
                                <td>{livro.titulo}</td>                
                                <td>{livro.preco}</td>    
                                <td>{livro.autor.nome}</td>            
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

export default class LivrosBox extends Component 
{

    constructor(props)
    {
        super(props);
        this.state = {
            lista:[],
            autores :[],
        }
    }


    componentWillMount()
    {
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/livros",
            dataType:"json",
            success : function(resposta){
                this.setState({lista: resposta});
            }.bind(this)
        });

        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/autores",
            dataType:"json",
            success : function(resposta){
                this.setState({autores:resposta});
            }.bind(this)
        });

        PubSub.subscribe('livros', function(topico, novaListaLivros){
            this.setState({lista:novaListaLivros});
        }.bind(this))

    }

    render()
    {
        return(
            <div>
                <FormLivro autores={this.state.autores}/>
                <TabelaLivros lista={this.state.lista}/>
            </div>
        );
    }

}
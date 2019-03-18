import React, {Component} from 'react';
import PubSub from 'pubsub-js';


export default class InputCustom extends Component 
{

    constructor(props)
    {
        super(props);
        this.state = {
            mensagemErro : '',
        }
    }

    componentDidMount()
    {
        PubSub.subscribe("errors",function(topico, erro){
            if(erro.field === this.props.name){
                this.setState({mensagemErro: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe("limpa-erros", function(topico){
            this.setState({mensagemErro: ''});
        }.bind(this));
    }

    render()
    {
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <input {...this.props} />                  
                <span className="error">{this.state.mensagemErro}</span>
            </div>
        );
    }
        
}
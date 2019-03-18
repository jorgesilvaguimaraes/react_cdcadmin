import PubSub from 'pubsub-js';


export default class TratadorErros {

    publicaErros(erros)
    {
        erros.errors.map(function(erro){
            PubSub.publish("errors", erro);
            return console.log(erro);
        })
    }

}
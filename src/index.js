import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AutorBox from './components/Autor'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/Home.js';
import LivrosBox from './components/Livros.js';


ReactDOM.render(
    (<Router >
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livros" component={LivrosBox} />

            </Switch>
        </App>
    </Router>), 
    document.getElementById('root')
);

serviceWorker.unregister();

import "./CSS/App.css";
import { useEffect, useState } from "react";

function App() {
  const [conteudo, setConteudo] = useState(<></>);
  // o setBusca e setConteudo são funções que dão valor para as variáveis, o useState é uma função que cria variáveis. 
  //O conteudo é a variável que vai receber o valor da função setConteudo, e o busca é a variável que vai receber o valor da função setBusca
  const [busca, setBusca] = useState("");

  function getStatus(status) {
    switch (status) {
      case "Alive":
        return "Vivo";
      case "Dead":
        return "Morto";
      case "unknown":
        return "desconhecido";
    }
  }

  function getGender(gender) {
    switch (gender) {
      case "Male":
        return "Masculino";
      case "Female":
        return "Feminino";
      case "unknown":
        return "desconhecido";
    }
  }

  function getSpecies(species) {
    switch (species) {
      case "Human":
        return "Humano";
      default:
        return "Desconhecido";
    }
  }
  
  async function carragarTodosOsPersonagens() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

    const results = await fetch(
      "https://rickandmortyapi.com/api/character"+busca,
      requestOptions
    )
      .then(response => response.text())
      .then(result => { return result; })
      .catch(error => console.log("error", error));

      const char = JSON.parse(results)
    
    return char.results
  }

  async function listaPersonagem() {
    const todosPersonagens = await carragarTodosOsPersonagens();

    return todosPersonagens.map((personagem) => (
      <div className="card">
        <img src={personagem.image} alt={personagem.nome} />
        <div className="cardname">
          {personagem.name}
        </div>
        <div className="cardspecies">
          <h3>Espécie: {getSpecies(personagem.species)}</h3>
        </div>
        <div className="cardgender">
          <h3>Gênero: {getGender(personagem.gender)}</h3>
        </div>
        <div className='cardepisode'>
	        <h5>Participações: {personagem.episode.map(ep => (
		        <span key={(personagem.name+(ep.split('episode/')[1]))}>Ep {ep.split('episode/')[1]},</span>))}
	        </h5>
        </div>
        <div className="cardstatus">
          <h3>Estado: {getStatus(personagem.status)}</h3>
        </div>
      </div>
    ));
  }

  function montarFiltro(tipo, valor) {
    const filtros = new URLSearchParams();
    /* 
    * filtros = {
    }
    */

    const batata = filtros.get(tipo)
    if (batata === valor){
      filtros.delete(tipo)
    } else{
      filtros.set(tipo, valor)
    }

    filtros.set(tipo, valor)
    /* 
    * filtros = {
    *   status: 'alive'
    }
    */

    setBusca('?'+filtros.toString())
  }



  useEffect(() => {
    async function getConteudo(){
      setConteudo(await listaPersonagem());
    }
    getConteudo();
  }, [busca]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rick and Morty API</h1>
        <h2><a href="/">Personagens</a></h2>
      </header>
      
      <div className="filtros">
        <span className="titulo-filtros">Filtros</span>
        <div className="filtro status">
          <b>Status:</b>
          <span onClick={() => montarFiltro('status', 'alive')}>Vivo</span>
          <span onClick={() => setBusca('?status=dead')}>Morto</span>
          <span onClick={() => setBusca('?status=unknown')}>Desconhecido</span>
        </div>
        <div className="filtro genero">
          <b>Gênero:</b>
          <span onClick={() => setBusca('?gender=male')}>Masculino</span>
          <span onClick={() => setBusca('?gender=female')}>Feminino</span>
          <span onClick={() => setBusca('?gender=genderless')}>Sem gênero</span>
          <span onClick={() => setBusca('?gender=unknown')}>Desconhecido</span>
        </div>
      </div>
      <div className="lista-principal">{conteudo}</div>
    </div>
  );
}

export default App;

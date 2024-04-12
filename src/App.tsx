//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import {useState} from 'react';

interface Joke{
  id :number,
  joke: string
}

interface MyButtonProps {
  responseHandler: (joke: Joke) => void
}

interface MyBottonPropsAllJokes{
  responseHandler :(jokes : Joke[]) => void
}

interface AddJokeButtonProps{
newJoke: string;
responseHandler :() => void;
}


function postRequest(props:Joke): Promise<Response>  {
  return fetch('http://localhost:3000/jokes',{
    
    method: 'POST', 
    mode: 'cors', 
    body: JSON.stringify(props),// body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/json",
    },
    
  })
}

function GetRandomJokeButton(props: MyButtonProps){
  
  async function handleClick(){
    const response = await fetch('http://localhost:3000/randomjoke')
    const data = await response.json() as Joke;
    props.responseHandler(data)
  }
  return(   
    <div>
      <button onClick={handleClick}>Click me to retrieve a random joke</button>     
    </div>
  )
}

function GetAllJokesButton(props: MyBottonPropsAllJokes){
  
  async function handleClick(){
    const response = await fetch('http://localhost:3000/jokes')
    const data = await response.json() as Joke[];
    props.responseHandler(data);
  }
  return(   
    <div>
        <button onClick={handleClick}>Click me to retrieve all Jokes</button>     
      </div>
    )  
  }
  
  function AddJokeButton(props: AddJokeButtonProps){
    return(
      <div>
        <button onClick={props.responseHandler}>Click me to enter a new joke</button> 
      </div>
    )
  }
  
  function AddJokeForm(){
    const [newJoke, setNewJoke]= useState("");
    
    async function handleClick(){
      const joke = {id:0, joke:newJoke};
      
      const response = await postRequest(joke);   
      console.log(response.json());     
      setNewJoke("");
    }

  return(
    <>
    <form>
      <AddJokeButton newJoke={newJoke} responseHandler={handleClick} />
      <input name="myInput" onChange={e=>setNewJoke(e.target.value)} value={newJoke}/>
    </form>
    </>
  )
}


function App() {
  const [jokeText, setJokeText] = useState('');
  const [jokeTexts, setJokeTexts] = useState([] as Joke[]);
  

  function callBack(joke: Joke){
    setJokeText(joke.joke)
  }

  function callBackAllJokes(jokes :Joke[]){
    const newJokes =[...jokes];
    setJokeTexts(newJokes);
  }

  
  return (
     <>
     <button onClick={()=>{setJokeTexts([]); setJokeText('')}}>Clear all Jokes</button>
     <hr/>
      <GetRandomJokeButton responseHandler={callBack} />
      <p>{jokeText}</p>
      <hr/>
      <GetAllJokesButton responseHandler={callBackAllJokes}/>
      <p>
        {jokeTexts.map(joke =><li key={joke.id}>{joke.joke}</li>)}
      </p>
      <hr/>
      <AddJokeForm />
     </>
  )
}

export default App

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import {useEffect, useState} from 'react';
import Link from './Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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

interface DeleteJokeButtonProps{
  responseHandler :() => void;
}

// interface ShowLinkApp{
//   responseHander :(token:string)=> void;
// }

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

function deleteRequest(props:number) : Promise<Response>{

  return fetch(`http://localhost:3000/jokes/:${props}`,{
    method: 'DELETE', 
    mode: 'cors', 
    body: JSON.stringify(props),// body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/javascript",
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

  function DeleteJokeButton(props: DeleteJokeButtonProps){
    return(
      <div>
        <button onClick={props.responseHandler}>Click me to delete a joke</button>
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
      <label>
      <input name="myInput" onChange={e=>setNewJoke(e.target.value)} value={newJoke}/>
      </label>
    </form>
    </>
  )
}

  function DeleteJokeById(){

  const [deletedJokdId, setIdToDelete]= useState(-1);
  async function handleClick(){
    const response = await deleteRequest(deletedJokdId);
    let data =await response.text();
    console.log(data);

  }
  
  return(
    <>
      <DeleteJokeButton responseHandler={handleClick}/>
      <label>
        <input name="DeleteByIdInput" type="number" onChange={e=>setIdToDelete(e.target.valueAsNumber)}></input>
      </label>
    </>

  )
}

interface LinkData{
 ExpirationData : Date,
 link_token : string,
 request_id: string
}

// function StartCallButton(props: ShowLinkApp){

//   async function handleClick(){
//     const response = await fetch('http://localhost:3000/api/create_link_token')
  
//     console.log(response);
//     const result = (await response.json()) as LinkData
//     if(result.link_token!=null && result.request_id!=null){
//       props.responseHander(result.link_token);
//     }

//   }
//   return(
//     <>
//     <button onClick={handleClick}>Start a call to the backend to get Plaid going</button>
//     </>
//   )
// }



function App() {
  const [jokeText, setJokeText] = useState('');
  const [jokeTexts, setJokeTexts] = useState([] as Joke[]);
  const [linkToken, setLinkToken] = useState('');
  

  function callBack(joke: Joke){
    setJokeText(joke.joke)
  }

  function callBackAllJokes(jokes :Joke[]){
    const newJokes =[...jokes];
    setJokeTexts(newJokes);
  }

  //  function callBackDisplayPlaidTab(token:string){
  //   setLinkToken(token);
  // }

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
 
  const handleTabChange = (e:React.SyntheticEvent, tabIndex: number) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

     useEffect(() => {
      handleClick();      
    },[]);

    async function handleClick(){
      const response = await fetch('http://localhost:3000/api/create_link_token')
    
      console.log(response);
      const result = (await response.json()) as LinkData
      if(result.link_token!=null && result.request_id!=null){
        setLinkToken(result.link_token);
      }
  
    }
  

  return (
     <>
     <Tabs value={currentTabIndex} onChange={handleTabChange}>
        <Tab label='Tab 1'/> 
        <Tab label='Tab 2' />
      </Tabs> 
      { currentTabIndex == 1 ? <>{linkToken? <Link linkToken={linkToken}/> :<></>}  </> : undefined }
      {currentTabIndex == 0 ? 
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
          <hr/>
          <DeleteJokeById/>
        </> : undefined}
      </>
  )
}

export default App

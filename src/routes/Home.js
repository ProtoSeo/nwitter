import { dbService, storageService } from 'fbase';
import React ,{useState,useEffect}from 'react'
import Nweet from '../components/Nweet'
import {v4 as uuidv4} from 'uuid';
const Home = ({userObj}) => {
  const [nweet,setNweet] = useState("");
  const [nweets,setNweets] = useState([]);
  const [attachment,setAttachment] = useState();
  // const getNweets = async () =>{
  //   const dbNweets = await dbService.collection("nweets").get();
  //   dbNweets.forEach((document)=>{
  //     const nweetObject = {
  //       ...document.data(),
  //       id:document.id,
  //     }
  //     setNweets((prev)=> [nweetObject,...prev]);
  //   });
  // }
  useEffect(() => {
    // getNweets();
    dbService.collection("nweets").onSnapshot(snapshot=>{
      const  nweetArray = snapshot.docs.map(doc =>({
        id:doc.id, ...doc.data(),
      }))
      console.log(nweetArray);
      setNweets(nweetArray);
    })
  }, [])
  const onSubmit = async (event) =>{
    event.preventDefault();
    const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
    const response = await fileRef.putString(attachment,"data_url");
    // await dbService.collection('nweets').add({
    //   text:nweet,
    //   createAt:Date.now(),
    //   creatorId: userObj.uid,
    // });
    console.log(response);
    setNweet("");
  }
  const  onChange = (event) =>{
    const {target:{value}} = event;
    setNweet(value);
  }
  const onFileChange = (event) =>{
    const {target:{files}} = event;
    const theFile =files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent)=>{
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result); 
    }
    reader.readAsDataURL(theFile);
  }
  const onClearAttachment = () => setAttachment(null);
  return (
  <div>
    <form onSubmit={onSubmit}>
      <input value ={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
      <input type="file" accpet="image/*" onChange={onFileChange}/>
      <input type="submit" value="Nweet" />
      {attachment&&<div>
        <img src={attachment} width="50px" height="50px"/>
        <button onClick={onClearAttachment}>Clear</button>
        </div>}
    </form>
    <div>
      {nweets.map((nweet)=>(
        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId===userObj.uid } />
      ))}
    </div>
  </div>
  )
}
export default Home;
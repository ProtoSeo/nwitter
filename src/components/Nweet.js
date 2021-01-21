import { dbService, storageService } from 'fbase';
import React ,{useState} from 'react'

const Nweet = ({nweetObj,isOwner})=>{
  const [editing,setEditing] = useState(false);
  const [newNweet,setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () =>{
    const ok = window.confirm("삭제하시겠습니다?");
    if(ok){
      //delete nweet
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  }
  const toggleEditting = () => setEditing((prev)=>!prev); 
  const onSubmit = async (event) =>{
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text:newNweet 
    });
    setEditing(false);
 
  }
  const onChange = (event) =>{
    const {target:{value}} = event;
    setNewNweet(value);
  }
  return(
    <div key={nweetObj.id}>
      {
        editing?(
          <>
            <form onSubmit={onSubmit}>
              <input type="text" placeholder="Edit yout Nweet" value={newNweet} required onChange={onChange}/>
              <input type="submit" value="Update Nweet"/>
            </form>
            <button onClick={toggleEditting}>Cancle</button>
          </>
        ) : (
          <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl&&<img src = {nweetObj.attachmentUrl} width="50px" height="50px"/>}
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditting}>Edit Nweet</button>
              </>
            )}
          </>
        )
      }
    </div>
  )
}

export default Nweet;
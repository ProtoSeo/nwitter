import { authService } from 'fbase';
import {useHistory} from 'react-router-dom';
import React from 'react'
const Profile = ()=>{
  const history = useHistory();
  const onLogoutClick = () => {
    authService.signOut();
    history.push('/');
  }
  return (
    <>
      <button onClick={onLogoutClick}>Log Out</button>
    </>
  )  
}
export default Profile;
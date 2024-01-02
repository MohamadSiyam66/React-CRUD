/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';  
import {Button} from 'react-bootstrap' ;
import { EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const AppToaster= Toaster.create({
  position: "top"
})

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newWebSite, setNewWebSite] = useState("")
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=> response.json())
    .then((json)=> setUsers(json))
  },[])

  function addUser(){
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebSite.trim();
    
    if(name && email && website){
      fetch('https://jsonplaceholder.typicode.com/users',
      {
        method: "POST",
        body: JSON.stringify({name,email,website}),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      }
      ).then((response) => response.json() )
      .then(data => {
        setUsers([...users, data]);
        AppToaster.show({
          message: "User Added Successfully...",
          position: "top",
          intent: "success",
          timeout: 3000
        })
        setNewEmail("");
        setNewName("");
        setNewWebSite("");
      })
    }
  }

  function onChangeHandler(id, key, value){
    setUsers((users)=>{
      return users.map(user => {
        return user.id === id ? {...user, [key]: value} : user;
      })
    })
  }

  function updateUser(id){
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      }
      ).then((response) => response.json() )
      .then(data => {
        AppToaster.show({
          message: "User Updated Successfully...",
          intent: 'success',
          timeout: 3000
        })
      })
  }

  return (
    <div className="App">
      <table class="">
  <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Email</th>
      <th>Website</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user=>
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email}/></td>
      <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website}/></td>
      <td>
        <Button variant="primary" onClick={()=> updateUser(user.id)}>Update</Button>
        <Button variant="danger">Delete</Button>
      </td>
    </tr>
    )}
  </tbody>
  <tfoot>
    <tr>
      <td></td>
      <td><InputGroup 
            value={newName} 
            onChange={(e)=>setNewName(e.target.value)} 
            placeholder='Enter Name...'
          />
      </td>
      <td><InputGroup 
            value={newEmail} 
            onChange={(e)=>setNewEmail(e.target.value)} 
            placeholder='Enter Email...'
          />
      </td>
      <td><InputGroup 
            value={newWebSite} 
            onChange={(e)=>setNewWebSite(e.target.value)} 
            placeholder='Enter Website...'
          />
      </td>
      <td><Button variant='success' onClick={addUser}>Add User</Button></td>
    </tr>
  </tfoot>
</table>
    </div>
  );
}

export default App;

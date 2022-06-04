import NoteContext from './noteContext.js'
import { useState } from 'react'

const NoteState = (props) =>{
  const host = "http://localhost:5000/"
    const notesInitial=[
        {
          "_id": "628fdb464964bd9ecd05d571",
          "user": "628e6f06980b157c86b2cfde",
          "title": "Hello",
          "description": "Good Morning",
          "tags": "General",
          "date": "2022-05-26T19:55:50.343Z",
          "__v": 0
        },
        {
          "_id": "628fdb864964bd9ecd05d573",
          "user": "628e6f06980b157c86b2cfde",
          "title": "Hello",
          "description": "Good Morning",
          "tags": "General",
          "date": "2022-05-26T19:56:54.423Z",
          "__v": 0
        },
        {
          "_id": "628fdb8r64964bd9ecd05d573",
          "user": "628e6f06980b157c86b2cfde",
          "title": "Hello",
          "description": "Good Morning",
          "tags": "General",
          "date": "2022-05-26T19:56:54.423Z",
          "__v": 0
        },
        {
          "_id": "628fwdb864964bd9ecd05d573",
          "user": "628e6f06980b157c86b2cfde",
          "title": "Hello",
          "description": "Good Morning",
          "tags": "General",
          "date": "2022-05-26T19:56:54.423Z",
          "__v": 0
        },
        {
          "_id": "628fdb864964bdr9ecd05d573",
          "user": "628e6f06980b157c86b2cfde",
          "title": "Hello",
          "description": "Good Morning",
          "tags": "General",
          "date": "2022-05-26T19:56:54.423Z",
          "__v": 0
        }
      ]
      const [notes, setNotes] = useState(notesInitial)
      
      const getNotes= async()=>{
        
          const response = await fetch(`${host}api/notes/fetchnotes`, {
            //API Call
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')              
            }
          });
          const json = await response.json();
          setNotes(json);
                   
      }

      //Adding a new note
      const addNote=async(title, description, tags)=>{

        const response = await fetch(`${host}api/notes/addnote`, {
          //API Call
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')              
          },
          body: JSON.stringify({title, description, tags})
        });
        const json = await response.json();
      
          setNotes(notes.concat(json));
      }

      const deleteNote = async(id)=>{
        //API Call
        const response = await fetch(`${host}api/notes/deletenote/${id}`, {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
           'auth-token': localStorage.getItem('token')              
         }
       });

        const newNote = notes.filter((note)=>{return note._id!==id});
        setNotes(newNote);
      }

      const editNote = async(id, title, description, tags)=>{
        //API Call
        const response = await fetch(`${host}api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')              
          },
          body: JSON.stringify({title, description, tags})
        });
        let newNotes = JSON.parse(JSON.stringify(notes));
        

        //logic to edit node at client side
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tags=tags;
            break;
          }
        }
        setNotes(newNotes);
      }

    return(
        <NoteContext.Provider value={{notes, addNote, deleteNote, getNotes, editNote}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState
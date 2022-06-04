import React, {useState, useContext} from 'react'
import noteContext from '../context/notes/noteContext';



export default function AddNote(props) {
    const [note, setNote] = useState({title: "", description: "", tags: ""});
    const context =  useContext(noteContext);
    const {addNote} = context;

    const onChange=(e)=>{
        setNote({...note, [e.target.id]: e.target.value})
    }
    const clickHandler=(e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tags)
        props.showAlert("Note has been added successfully", "success")
        setNote({title: "", description: "", tags: ""})
    }


  return (
    <div>
        <h2>Add Note</h2>
      <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            aria-describedby="emailHelp"
            onChange={onChange}
            minLength={5}
            required
            value={note.title}
          />
          
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
          Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            onChange={onChange}
            minLength={5}
            required
            value={note.description}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
          Tags
          </label>
          <input
            type="text"
            className="form-control"
            id="tags"
            onChange={onChange}
            value={note.tags}
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={clickHandler} disabled={note.title.length<5 || note.description.length<5}>
          Submit
        </button>
      </form>
    </div>
  )
}

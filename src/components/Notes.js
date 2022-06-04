import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import NoteItem from './NoteItem.js';

export default function Notes(props) {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const ref = useRef(null);
  const [note, setNote] = useState({etitle: "", edescription: "", etags: "default"});
  const {showAlert} = props;
  const navigate = useNavigate();


  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, []);

  const updateNoteClick = note => {
    ref.current.click();
    setNote({id:note._id, etitle:note.title, edescription:note.description, etags:note.tags})
  };
  const onChange=(e)=>{
    setNote({...note, [e.target.id]: e.target.value})
}
const submitHandler=()=>{
  ref.current.click();
  editNote(note.id, note.etitle, note.edescription, note.etags)
  showAlert("Note Updated Successfully", "success")
}

  return (
    <>
      <AddNote showAlert={showAlert}/>
      <button
        type="button"
        ref={ref}
        className="btn d-none btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    value={note.etitle}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    onChange={onChange}
                    value={note.edescription}
                    minLength={5}
                    required

                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etags" className="form-label">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etags"
                    onChange={onChange}
                    value={note.etags}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={submitHandler} disabled={note.etitle.length<5 || note.edescription.length<5}>
                Submit Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <h2>Your Notes</h2>
        {notes.length===0 && 
        <div>No Notes Here. Get Noting...s</div>}
        {notes.map(note => {
          return (
            <NoteItem key={note._id} showAlert={showAlert} updateNoteClick={updateNoteClick} note={note} />
          );
        })}
      </div>
    </>
  );
}

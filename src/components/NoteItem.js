import React, {useContext} from 'react';
import noteContext from '../context/notes/noteContext';


export default function NoteItem(props) {
    const context = useContext(noteContext);
    const {deleteNote} = context;
  const { note, updateNoteClick } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
            <div className="d-flex align-items-center mb-2">

          <h5 className="card-title m-0">{note.title}</h5>
          <i className="fa-solid fa-trash-can mx-2" onClick={()=>{deleteNote(note._id);
          props.showAlert("Note Deleted Successfully", "success")}}></i>
          <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>updateNoteClick(note)}></i>
            </div>
          <p className="card-text">
            {note.description}
          </p>

        </div>
      </div>
    </div>
  );
}

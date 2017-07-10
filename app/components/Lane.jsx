import React from 'react';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import Notes from './Notes';
import LaneHeader from './LaneHeader';

const Lane = ({
  lane, notes, LaneActions, NoteActions, ...props
}) => {
  const deleteNote = (noteId, e) => {
    e.stopPropagation();
    NoteActions.delete(noteId);
    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    })
  };

  const activateNoteEdit = id => {
    NoteActions.update({ id, editing: true });
  };

  const editNote = (id, task) => {
    NoteActions.update({ id, task, editing: false });
  };

  return (
    <div {...props}>
      <LaneHeader lane={lane} />
      <Notes
        notes={selectNotesByIds(notes, lane.notes)}
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
};

function selectNotesByIds(allNotes, noteIds = []) {
  return noteIds.reduce((notes, id) =>
    notes.concat(
      allNotes.filter(note => note.id === id)
    ), []);
}

export default connect(
  ({ notes }) => ({
    notes
  }), {
    NoteActions,
    LaneActions
  }
)(Lane)
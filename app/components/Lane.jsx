import React from 'react';
import { compose } from 'redux';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../constants/itemTypes';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import Notes from './Notes';
import LaneHeader from './LaneHeader';

const Lane = ({
  connectDropTarget, lane, notes, LaneActions, NoteActions, ...props
}) => {
  const deleteNote = (noteId, e) => {
    e.stopPropagation();
    NoteActions.delete(noteId);
    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    })
  };

  Lane.propTypes = {
    lane: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      editing: React.PropTypes.bool,
      name: React.PropTypes.string,
      notes: React.PropTypes.array
    }).isRequired,
    LaneActions: React.PropTypes.object,
    NoteActions: React.PropTypes.object,
    connectDroptarget: React.PropTypes.func
  };
  Lane.defaultProps = {
    name: '',
    notes: []
  };

  const activateNoteEdit = id => {
    NoteActions.update({ id, editing: true });
  };

  const editNote = (id, task) => {
    NoteActions.update({ id, task, editing: false });
  };

  return connectDropTarget(
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

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    // If the target lane doesn't have notes,
    // attach the note to it.
    //
    // `attachToLane` performs necessarly
    // cleanup by default and it guarantees
    // a note can belong only to a single lane
    // at a time.
    if (!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
}

export default compose(
  DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
    connect(({ notes }) => ({
    notes
  }), {
    NoteActions,
    LaneActions
  })
)(Lane)
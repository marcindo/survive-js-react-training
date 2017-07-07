import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';
import connect from '../libs/connect';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do laundry'
        }
      ]
    }
  }
  render() {
    const { notes } = this.state;

    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <Notes
          notes={notes}
          onNoteClick={this.activateNoteEdit}
          onEdit={this.editNote}
          onDelete={this.deleteNote}
        />
      </div>
    );
  }
  addNote = () => {
    this.setState({
      notes: [...this.state.notes, {
        id: uuid.v4(),
        task: 'New task'
      }]
    });
  }

  handleNoteEdit = (id, editing, task = null) => {
    this.setState({
      notes: this.state.notes.map(note => {
        if (note.id === id) {
          note.editing = editing;
          note.task = task ? task : note.task
        }
        return note;
      })
    });
  }

  activateNoteEdit = (id) => {
    this.handleNoteEdit(id, true);
  }

  editNote = (id, task) => {
    this.handleNoteEdit(id, false, task);
  }

  deleteNote = (id, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    this.setState({
      notes: this.state.notes.filter(note => note.id !== id)
    });
  }
}

export default connect(() => {})(App)
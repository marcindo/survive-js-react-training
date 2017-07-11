import React from 'react';
import {
  renderIntoDocument
} from 'react-addons-test-utils';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import assert from 'assert';
import Note from '../app/components/Note';

describe('Note', function () {
  it('renders children', function () {
    const test = 'test';
    const NoteContent = wrapInTestContext(Note);
    const component = renderIntoDocument(
      <NoteContent id='demo'>{test}</NoteContent>
    );
    assert.equal(component.props.children, test);
  });
});

function wrapInTestContext(DecorateComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends React.Component {
    render() {
      return <DecorateComponent {...this.props} />;
    }
  }
  return TestContextContainer;
}

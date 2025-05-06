// src/extensions/DrawingNode.tsx
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer }    from '@tiptap/react';
import DrawingEditor                from '../pages/DrawingEditor.js';

export const DrawingNode = Node.create({
  name: 'drawing',
  group: 'block',
  atom: true,            // single inseparable node
  selectable: true,
  parseHTML() {
    return [{ tag: 'div[data-type="drawing"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {'data-type': 'drawing'}), 0];
  },
  addNodeView() {
    // this will mount your DrawingEditor component in the editor
    return ReactNodeViewRenderer(DrawingEditor);
  },
});
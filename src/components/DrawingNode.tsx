// src/extensions/DrawingNode.tsx
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import DrawingEditor from '../pages/DrawingEditor.js';

export const DrawingNode = Node.create({
  name: 'drawing',
  group: 'block',
  atom: true, // treat as a single, non-editable node

  addAttributes() {
    return {
      // store the stroke data in node attributes
      elements: {
        default: [],
        parseHTML: (element) => {
          const raw = element.getAttribute('data-elements');
          return raw ? JSON.parse(raw) : [];
        },
        renderHTML: (attrs) => {
          if (!attrs.elements || !attrs.elements.length) {
            return {};
          }
          return { 'data-elements': JSON.stringify(attrs.elements) };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="drawing"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    // output a single <div> with our stored data
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'drawing' }),
    ];
  },

  addNodeView() {
    // mount the React drawing UI
    return ReactNodeViewRenderer(DrawingEditor);
  },
});

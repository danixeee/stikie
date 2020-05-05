import {
  isComment,
} from "./utils";

import { createPopper } from "@popperjs/core";
import { Comment } from "./comments"

function create(parent, comment, x = 0, y = 0) {
  createPopper(parent, comment, {
    placement: "top-start",
    modifiers: [
      {
        name: "flip",
        enabled: false,
      },
      {
        name: "offset",
        options: {
          offset: [x, -y],
        },
      },
    ],
  });
}

function addComment(el, e, type = "comment2" /* will change */) {
  const comment = Comment.createAt(el, e.clientX, e.clientY, type);
  const [parent, x, y] = comment.getPosition();

  // use popper to show comments
  create(parent, comment.getHtmlElement(), x, y);
}

/*
  Allow users to left comments on a site...
 */
export function register() {
  // do not replace someone's onclick event listener
  const existingOnClickFn = window.onclick;
  window.onclick = (e) => {
    // execute existing onclick function
    if (existingOnClickFn) {
      existingOnClickFn(e);
    }
    // add comments
    const elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
    if (!isComment(elementMouseIsOver)) {
      addComment(elementMouseIsOver, e);
    }
  };
}

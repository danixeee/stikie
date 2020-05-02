import {
  uuidv4,
  createElementFromHTML,
  getElementByXPath,
  getXPathForElement,
} from "./utils";

import { createPopper } from "@popperjs/core";

/*
 */
class Comment {
  constructor(id, path, x, y) {
    this.id = id;
    this.path = path;
    this.x = x;
    this.y = y;
  }

  getPosition() {
    const el = getElementByXPath(this.path);
    const rect = el.getBoundingClientRect();
    return [el, rect.left + this.x, rect.top + this.y];
  }

  getEl() {
    return document.getElementById(this.id);
  }
}

const commentsDB = [];

function create(parent, comment, x = 0, y = 0) {
  createPopper(parent, comment, {
    placement: "top-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [x, -y],
        },
      },
    ],
  });
}

function addComment(el, e) {
  const commentsSection = document.getElementById("comments");
  const id = uuidv4();
  const template = `
      <div
          id=${id} role="tooltip" class="tooltip">
          <input type="text" value="Neki input" />
          <!--<div class="arrow" data-popper-arrow></div>-->
      </div>
  `;
  const commentEl = createElementFromHTML(template);
  commentsSection.append(commentEl);
  const commentRect = document.getElementById(id).getBoundingClientRect();

  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const y = e.clientY - rect.top + commentRect.height; //y position within the element.

  const comment = new Comment(id, getXPathForElement(el), x, y);

  commentsDB.push(comment);

  const [parent, xx, yy] = comment.getPosition();
  create(parent, comment.getEl(), xx, yy);

  // renderComments();
}

/*
 */
export function register() {
  // do not replace someone's on click event listener
  const existingOnClickFn = window.onclick;
  window.onclick = (e) => {
    existingOnClickFn(e);

    const elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
    addComment(elementMouseIsOver, e);
  };
}

import {
  uuidv4,
  createElementFromHTML,
  getXPathForElement,
  isComment,
} from "./utils";

import { createPopper } from "@popperjs/core";

let STIKIE_COMMENTS_EL;

const commentsDB = [];

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

function addComment(el, e) {
  const commentsSection = document.getElementById("comments");
  const id = uuidv4();
  const commentEl = createElementFromHTML(Comment.getTemplate(id));
  commentsSection.append(commentEl);
  const commentRect = document.getElementById(id).getBoundingClientRect();

  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const y = e.clientY - rect.top + commentRect.height / 2 + window.scrollY; //y position within the element.

  const comment = new Comment(id, getXPathForElement(el), x, y);

  commentsDB.push(comment);

  const [parent, xx, yy] = comment.getPosition();
  create(parent, comment.getEl(), xx, yy);

  // renderComments();
}

function createCommentsContainer() {
  const stikieCommentsElId = "stikie-comments";
  const containerEl = createElementFromHTML(
    `<div id="${stikieCommentsElId}"></div>`
  );

  window.document.body.insertBefore(
    containerEl,
    window.document.body.firstChild
  );

  return document.getElementById(stikieCommentsElId);
}

/*
 */
export function register() {
  STIKIE_COMMENTS_EL = createCommentsContainer();

  // do not replace someone's onclick event listener
  const existingOnClickFn = window.onclick;
  window.onclick = (e) => {
    if (existingOnClickFn) {
      existingOnClickFn(e);
    }
    const elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
    if (!isComment(elementMouseIsOver)) {
      addComment(elementMouseIsOver, e);
    }
  };
}

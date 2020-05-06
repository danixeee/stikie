import {
  isComment,
} from "./utils";

import { createPopper } from "@popperjs/core";
import { Comment } from "./comments";

const commentsDb = [];

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

  commentsDb.push(comment);
  // use popper to show comments
  create(parent, comment.getHtmlElement(), x, y);

  console.log(JSON.stringify(commentsDb));
}

function renderComments(comments) {
  for (const comment of comments) {
    const [parent, x, y] = comment.getPosition();
    create(parent, comment.getHtmlElement(), x, y);
  }
}

function sampleToComments() {
  const samples = [
    {
      "id": "bd9bb441-eaed-458a-a16a-8848493357b6",
      "path": "id(\"investing-img\")",
      "x": 197,
      "y": 348,
      "type": "comment2"
    },
    {
      "id": "b22ee2e6-fcaa-4b6e-b815-5e9a4fcac4f4",
      "path": "id(\"investing-img\")",
      "x": 656,
      "y": 15,
      "type": "comment2"
    },
    {
      "id": "64246aee-3bbc-4c69-9fb0-77617e908741",
      "path": "id(\"investing-img\")",
      "x": 765,
      "y": 281,
      "type": "comment2"
    },
    {
      "id": "51065098-04f9-4cae-830a-0c962558db19",
      "path": "/html[1]/body[1]/div[2]/div[1]/div[1]/div[1]",
      "x": 905,
      "y": 388,
      "type": "comment2"
    }
  ];

  const comments = [];
  for (const sample of samples) {
    comments.push(
      new Comment(sample['id'], sample['path'], sample['x'], sample['y'], sample['type']));
  }
  return comments;
}

/*
  Allow users to left comments on a site...
 */
export function register() {
  // renderComments(sampleToComments()); // testing

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

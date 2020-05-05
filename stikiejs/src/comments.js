import {
  getElementByXPath,
  uuidv4,
  createElementFromHTML,
  getXPathForElement,
} from "./utils";

const COMMENTS_CONTAINER_ID = "stikie-comments";

const COMMENT_TEMPLATES = {}; // [template-type] = template-snippet

COMMENT_TEMPLATES["comment1"] = (id) => `
<div id="${id}" role="comment" class="panel panel-default">
  <div class="panel-heading">
    <strong>danixeeee</strong> <span class="text-muted">commented 5 days ago</span>
    </div>
    <div class="panel-body">
    Test test test
    </div>
  </div>
</div>
`;

COMMENT_TEMPLATES["comment2"] = (id) => `
<div
  id=${id} role="comment" class="tooltip">
  <input type="text" value="Neki input" />
</div>
`;
function getCommentsContainer() {
  let commentsContainer = document.getElementById(COMMENTS_CONTAINER_ID);
  if (!commentsContainer) {
    commentsContainer = createElementFromHTML(`<div id="${COMMENTS_CONTAINER_ID}"></div>`);
    window.document.body.insertBefore(commentsContainer, window.document.body.firstChild);
  }

  return commentsContainer
}

export class Comment {
  constructor(id, path, x, y) {
    this.id = id;
    this.path = path;
    this.x = x;
    this.y = y;
  }

  /*
    Used when adding comments..
  */
  static createAt(targetEl, mouseX, mouseY, type) {
    const container = getCommentsContainer();

    // create comment as html element
    const id = uuidv4();
    const commentEl = createElementFromHTML(Comment.getTemplate(id, type));
    container.append(commentEl);
    // calculate relative distance from top-left corner of target element
    const commentRect = commentEl.getBoundingClientRect();
    const rect = targetEl.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top + commentRect.height + window.scrollY;

    return new Comment(id, getXPathForElement(targetEl), x, y);
  }

  static getTemplate(id, type) {
    return COMMENT_TEMPLATES[type](id);
  }

  getPosition() {
    const el = getElementByXPath(this.path);
    const rect = el.getBoundingClientRect();
    return [el, rect.left + this.x, rect.top + this.y];
  }

  getHtmlElement() {
    return document.getElementById(this.id);
  }
}

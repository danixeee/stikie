// Kada se kreira klasa, kreira se i html element i odrede se pozicije u odnosu na kursor

class AbstractComment {
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

  getHtmlElement() {
    return document.getElementById(this.id);
  }

  static getTemplate(id) {
    throw new Error("Not implemented!");
  }
}

class Comment extends AbstractComment {
  static getTemplate(id) {
    return `
      <div id="${id}" role="comment" class="panel panel-default">
        <div class="panel-heading">
          <strong>myusername</strong> <span class="text-muted">commented 5 days ago</span>
          </div>
          <div class="panel-body">
          Panel content
          </div>
        </div>
      </div>
    `;
  }
}

class StickyNote extends AbstractComment {}
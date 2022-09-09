//

/*
  COMPONENT PROCESS
  For each component attr found in app:
    1)  Clone 
*/

/*
  RENDER PROCESS
  1)  Set Host/Root/App element.
  2)  Find elements w/in host w/ component attr.
  3)  Clone 
*/

const templateState = {
  hostElement,
  renderedComponents: [],
  setHost(element) {
    templateState.hostElement = element;
    return this.hostElement;
  }
}


const clearHost = () => {};

const parseTemplate = () => {};

export const template = (name) => {
  return document.querySelector(`#${name}-template`)
    .content.firstElementChild
    .cloneNode(true);
};

const render = () => {};

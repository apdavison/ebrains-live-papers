/*
This is a local copy of showdown-katex v0.8.0 with a few lines commented out.

It is included (as allowed by the MIT Licence of showdown-katex)
because the packaged version causes an error when testing.

MIT License

Copyright (c) 2016 obedm503

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import katex from 'katex';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import showdown from 'showdown';
import asciimathToTex from './asciimath-to-tex';

// if (process.env.TARGET === 'cjs') {
//   const { JSDOM } = require('jsdom');
//   const jsdom = new JSDOM();
//   global.DOMParser = jsdom.window.DOMParser;
//   global.document = jsdom.window.document;
// }

/**
 * @param {object} opts
 * @param {NodeListOf<Element>} opts.elements
 * @param opts.config
 * @param {boolean} opts.isAsciimath
 */
function renderBlockElements({ elements, config, isAsciimath }) {
  if (!elements.length) {
    return;
  }

  elements.forEach(element => {
    const input = element.textContent;
    const latex = isAsciimath ? asciimathToTex(input) : input;
    const html = katex.renderToString(latex, config);
    element.parentNode.outerHTML = `<span title="${input.trim()}">${html}</span>`;
  });
}

/**
 * https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 * @param {string} str
 * @returns {string} regexp escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\$^|]/g, '\\$&');
}

// katex config
const getConfig = (config = {}) => ({
  displayMode: true,
  throwOnError: false, // fail silently
  errorColor: '#ff0000',
  ...config,
  delimiters: (config.delimiters || []).concat([
    { left: '$$', right: '$$', display: false },
    { left: '~', right: '~', display: false, asciimath: true },
  ]),
});

const showdownKatex = userConfig => () => {
  const parser = new DOMParser();
  const config = getConfig(userConfig);
  const asciimathDelimiters = config.delimiters
    .filter(item => item.asciimath)
    .map(({ left, right }) => {
      const test = new RegExp(
        `${escapeRegExp(left)}(.*?)${escapeRegExp(right)}`,
        'g',
      );
      const replacer = (match, asciimath) => {
        return `${left}${asciimathToTex(asciimath)}${right}`;
      };
      return { test, replacer };
    });

  return [
    {
      type: 'output',
      filter(html = '') {
        // parse html
        const wrapper = parser.parseFromString(html, 'text/html').body;

        if (asciimathDelimiters.length) {
          // convert inline asciimath to inline latex
          // ignore anything in code and pre elements
          wrapper.querySelectorAll(':not(code):not(pre)').forEach(el => {
            /** @type Text[] */
            const textNodes = [...el.childNodes].filter(
              // skip "empty" text nodes
              node => node.nodeName === '#text' && node.nodeValue.trim(),
            );

            textNodes.forEach(node => {
              const newText = asciimathDelimiters.reduce(
                (acc, { test, replacer }) => acc.replace(test, replacer),
                node.nodeValue,
              );
              node.nodeValue = newText;
            });
          });
        }

        // find the math in code blocks
        const latex = wrapper.querySelectorAll('code.latex.language-latex');
        const asciimath = wrapper.querySelectorAll(
          'code.asciimath.language-asciimath',
        );

        renderBlockElements({ elements: latex, config });
        renderBlockElements({ elements: asciimath, config, isAsciimath: true });

        renderMathInElement(wrapper, config);

        // return html without the wrapper
        return wrapper.innerHTML;
      },
    },
  ];
};

// register extension with default config
showdown.extension('showdown-katex', showdownKatex());

export default showdownKatex;

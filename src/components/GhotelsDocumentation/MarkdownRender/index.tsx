import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import { Maindiv } from '../../../Common/styled';
import copy from 'copy-to-clipboard';

const MarkdownRender = ({ markdown }) => {
  const [copyText, setCopyText] = useState('');
  return (
    <Maindiv>
      <ReactMarkdown
        children={markdown}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <>
                <button
                  className="hljs__copy"
                  type="button"
                  aria-label="Copy code to clipboard"
                  onClick={() => {
                    copy(String(children).replace(/\n$/, ''));

                    setCopyText(String(children).replace(/\n$/, ''));
                    setTimeout(() => {
                      setCopyText('');
                    }, 1000);
                  }}
                >
                  <strong
                    className="hljs__copy-title"
                    style={{
                      opacity:
                        copyText === String(children).replace(/\n$/, '')
                          ? 1
                          : 0,
                    }}
                  >
                    Copied
                  </strong>
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 7.24091H8.25C7.42157 7.24091 6.75 7.96132 6.75 8.85V16.0909C6.75 16.9796 7.42157 17.7 8.25 17.7H15C15.8284 17.7 16.5 16.9796 16.5 16.0909V8.85C16.5 7.96132 15.8284 7.24091 15 7.24091Z"
                      stroke="#666666"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M3.75 12.0682H3C2.60218 12.0682 2.22064 11.8986 1.93934 11.5969C1.65804 11.2951 1.5 10.8858 1.5 10.4591V3.21818C1.5 2.79142 1.65804 2.38214 1.93934 2.08038C2.22064 1.77861 2.60218 1.60909 3 1.60909H9.75C10.1478 1.60909 10.5294 1.77861 10.8107 2.08038C11.092 2.38214 11.25 2.79142 11.25 3.21818V4.02272"
                      stroke="#666666"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
                <code
                  className="hljs"
                  data-scrollbar="true"
                  tabIndex={-1}
                  style={{ overflow: 'hidden', outline: 'none' }}
                >
                  <div className="scroll-content">
                    {String(children).replace(/\n$/, '')}
                  </div>
                  <div
                    className="scrollbar-track scrollbar-track-x"
                    style={{ display: 'none' }}
                  >
                    <div
                      className="scrollbar-thumb scrollbar-thumb-x"
                      style={{
                        width: '658px',
                        transform: 'translate3d(0px, 0px, 0px)',
                      }}
                    ></div>
                  </div>
                  <div
                    className="scrollbar-track scrollbar-track-y"
                    style={{ display: 'none' }}
                  >
                    <div
                      className="scrollbar-thumb scrollbar-thumb-y"
                      style={{
                        height: '94px',
                        transform: 'translate3d(0px, 0px, 0px)',
                      }}
                    ></div>
                  </div>
                </code>
                <div className="hljs__header">
                  <div className="hljs__header-dots">
                    <span className="hljs__header-dots-span"></span>
                    <span className="hljs__header-dots-span"></span>
                    <span className="hljs__header-dots-span"></span>
                  </div>
                  <div className="hljs__header-title"></div>
                </div>
              </>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </Maindiv>
  );
};

export default MarkdownRender;

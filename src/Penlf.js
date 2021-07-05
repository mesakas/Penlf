require('./PenlfDefaultTheme.scss')

function exec(command) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return document.execCommand(command, false, value);
}

function addEventListener(parent, type, listener) {
    return parent.addEventListener(type, listener);
}

function queryCommandValue(command) {
    return document.queryCommandValue(command);
}

function queryCommandState(command) {
    return document.queryCommandState(command);
}

function init(editorOfHtmlElement, savedHandler, moreActions) {

    let actions = [
        // 加粗
        {
            name: "bold",
            icon: "<b>B</b>",
            title: "加粗",
            type: 'button',
            state: () => {
                return queryCommandState('bold');
            },
            result: () => {
                return exec('bold')
            }
        },
        // 斜体
        {
            name: "italic",
            icon: "<i>I</i>",
            title: "斜体",
            type: 'button',
            state: () => {
                return queryCommandState('italic');
            },
            result: () => {
                return exec('italic')
            }
        },
        // 下划线
        {
            name: "underline",
            icon: "<u>U</u>",
            title: "下划线",
            type: 'button',
            state: () => {
                return queryCommandState('underline');
            },
            result: () => {
                exec('underline')
            }
        },
        // h1-h4
        {
            name: "heading1",
            icon: "<b>H1</b>",
            title: "一级标题",
            type: 'button',
            result: () => {
                return exec('formatBlock', '<h1>')
            }
        },
        {
            name: "heading2",
            icon: "<b>H2</b>",
            title: "二级标题",
            type: 'button',
            result: () => {
                return exec('formatBlock', '<h2>')
            }
        },
        {
            name: "heading3",
            icon: "<b>H3</b>",
            title: "三级标题",
            type: 'button',
            result: () => {
                return exec('formatBlock', '<h3>')
            }
        },
        {
            name: "heading4",
            icon: "<b>H4</b>",
            title: "四级标题",
            type: 'button',
            result: () => {
                return exec('formatBlock', '<h4>')
            }
        },
        {
            name: "quote",
            icon: "“”",
            title: "引用",
            type: 'button',
            result: () => {
                return exec('formatBlock', '<blockquote>');
            }
        },
        {
            name: "oList",
            icon: "·",
            title: "有序列表",
            type: 'button',
            result: () => {
                return exec('insertOrderedList');
            }
        },
        {
            name: "uList",
            icon: "123",
            title: "无序列表",
            type: 'button',
            result: () => {
                return exec('insertUnorderedList');
            }
        },
        {
            name: "line",
            icon: "line",
            title: "分割线",
            type: 'button',
            result: () => {
                exec('insertHorizontalRule')
                exec('formatBlock', '<p>')
            }
        },
    ]

    if (moreActions) for (let i = 0; i < moreActions.length; i++) actions.push(moreActions[i])

    editorOfHtmlElement.className = "RichTextEditor"

    // 初始化editor
    let editor = document.createElement('div');
    editor.id = 'editor'
    editor.className = 'editor'
    editor.contentEditable = 'true'
    editor.style.overflow = 'auto'

    // 初始化actionsBar
    let actionsBar = document.createElement('div');
    actionsBar.className = 'actionsBar'

    // 初始化按钮
    actions.forEach((action) => {
        if (Object.keys(action).includes('init')) {
            action.init(editor, action, actionsBar)
            return
        }
        let button = document.createElement('button')
        button.classList.add('icon')
        button.classList.add(action.icon)
        button.innerHTML = action.icon

        // 更改样式的处理器
        let changeCssHandler = () => {
            if (Object.keys(action).includes('state')) {
                if (action.state()) {
                    button.classList.add('using')
                } else button.classList.remove('using')
            }
        }

        button.onclick = () => {
            action.result()
            changeCssHandler()
        }

        addEventListener(editor, 'keyup', changeCssHandler)
        addEventListener(editor, 'mouseup', changeCssHandler)
        addEventListener(editor, 'click', changeCssHandler)

        editorOfHtmlElement.appendChild(actionsBar)
        editorOfHtmlElement.appendChild(editor)
        actionsBar.appendChild(button)
    })


    let continuousEnterInPre = 0
    editor.onkeydown = (event) => {
        // 处理引用段的跳出
        if (event.key === 'Enter' && queryCommandValue('formatBlock') === 'blockquote') {
            setTimeout(function () {
                return exec('formatBlock', '<p>');
            }, 0);
        }
        // 处理代码段的跳出
        if (event.key === 'Enter' && queryCommandValue('formatBlock') === 'pre') {
            continuousEnterInPre++
            if (continuousEnterInPre >= 2) {
                setTimeout(function () {
                    return exec('formatBlock', '<p>');
                }, 0);
            } else {

            }
        } else continuousEnterInPre = 0
    }


    // 快捷键绑定
    addEventListener(editor, 'keydown', function (e) {
        if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();

            // 保存
            if (savedHandler) savedHandler(editor.innerHTML)
            else console.log("save")

        }
    });

    exec('defaultParagraphSeparator', 'p')
}

let editor = function editor(editor, saveHandler, moreActions) {
    if (typeof editor !== 'string') throw new Error("type of 'editor' variate must be 'string'.")
    init(document.querySelector(editor), saveHandler, moreActions)

    return {version: "0.3(beta)"}
}

window.editor = editor

export default {editor}

// module.exports = editor

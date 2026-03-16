/**
 * File to handle easy dialog for React.
 *
 * @package react-dialog
 */
import './style.scss'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Generate the React driven modal.
 *
 * @param args
 * @returns {JSX.Element}
 * @constructor
 */
class Modal extends React.Component {
    /**
     * Run callback until component has been mount.
     */
    componentDidMount() {
        if( this.props.dialog.callback ) {
            eval( this.props.dialog.callback );
        }
    }

    render() {
        let args = this.props;
        /**
         * Define the close action.
         */
        const closeDialog = () => {
            top.document.getElementById('react-dialog-for-wordpress-root').remove();
        };

        /**
         * Define class names.
         *
         * @type {string}
         */
        let classNames = "modal";
        if (args.dialog.className) {
            classNames = "modal " + args.dialog.className;
        }

        return (
            <>
                <div className="modal_bg" onClick={() => closeDialog()} />
                <div className={classNames}>
                    {args.dialog.title &&
                        <h1 className="react-dialog-title">{args.dialog.title}</h1>
                    }
                    {args.dialog.showClose &&
                        <a class="modal_close_button" href="javascript:void()" onClick={() => closeDialog()}></a>
                    }
                    {args.dialog.texts && args.dialog.texts.map(function(text) {
                            return (
                                <div key={text} dangerouslySetInnerHTML={{ __html: text }} className="react-dialog-text" />
                            )
                        }
                    )
                    }
                    {args.dialog.progressbar && args.dialog.progressbar.active && (
                        <div
                            className="react-progressbar"
                        >
                            <progress max="100" id={args.dialog.progressbar.id}
                                      value={args.dialog.progressbar.progress}>&nbsp;</progress>
                        </div>
                    )}
                    {args.dialog.buttons && args.dialog.buttons.map(function(button) {
                            return (
                                <button className={button.variant} onClick={() => eval(button.action)}>
                                    {button.text}
                                </button>
                            )
                        }
                    )
                    }
                </div>
            </>
        );
    }
}

/**
 * Show dialog, initiated by any event.
 *
 * If dialog already exist, it will be closed.
 *
 * @type {null}
 */
function add_react_dialog( dialog ) {
    if( dialog ) {
        if( ! top.document.getElementById('react-dialog-for-wordpress-root') ) {
            let root = top.document.createElement('div');
            root.id = 'react-dialog-for-wordpress-root';
            top.document.body.append(root);
        }
        // we use ReactDom.render as Divi comes with React 16 and not React 18.
        ReactDOM.render(<Modal dialog={dialog}/>, top.document.getElementById('react-dialog-for-wordpress-root'));
    }
}

function react_dialog_init() {
    // on each element with the class "react-dialog-for-wordpress".
    let dialog_links = document.getElementsByClassName('react-dialog-for-wordpress');
    for( let i=0;i<dialog_links.length;i++ ) {
        dialog_links[i].onclick = function(e) {
            e.preventDefault();
            document.body.dispatchEvent(new CustomEvent("react-dialog-for-wordpress", { detail: JSON.parse(this.dataset.dialog) }));
        };
    }
}

/**
 * Add events where the dialog should be fired.
 */
document.addEventListener( 'DOMContentLoaded', () => {
    // add listener which could be used to trigger the dialog with given configuration.
    document.body.addEventListener('react-dialog-for-wordpress', function(attr) {
        if( attr.detail ) {
            add_react_dialog(attr.detail);
        }
    });

    /**
     * Add listener for reinitialization.
     *
     * Example: TODO
     */
    document.body.addEventListener('react-dialog-for-wordpress-reinit', function() {
        react_dialog_init();
    });

    /**
     * On each element with the class "react-dialog-for-wordpress".
     */
    react_dialog_init();
})


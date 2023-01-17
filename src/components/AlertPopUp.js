import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import '../styles/AlertPopUp.css';

function AlertPopUp(props) {
    const { show, content } = props;

    return (
        show && (
            <div id="alert-pop-up">
                <FontAwesomeIcon icon={faCircleExclamation} />
                <p>{content}</p>
            </div>
        )
    );
}

export default AlertPopUp;

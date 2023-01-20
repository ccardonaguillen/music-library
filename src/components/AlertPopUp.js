import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import '../styles/AlertPopUp.css';

function AlertPopUp(props) {
    const { message } = props;

    return (
        <div id="alert-pop-up">
            <FontAwesomeIcon icon={faCircleExclamation} />
            <p>{message}</p>
        </div>
    );
}

export default AlertPopUp;

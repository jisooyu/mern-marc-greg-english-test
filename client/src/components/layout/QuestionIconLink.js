import React from 'react';
import { FaQuestion } from 'react-icons/fa';

const QuestionIconLink = () => {
    return (
        <div>
            <a href='/question' >
                <FaQuestion size={30} />
            </a>
        </div>
    )
}

export default QuestionIconLink
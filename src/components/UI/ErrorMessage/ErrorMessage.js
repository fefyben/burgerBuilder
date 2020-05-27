import React, { Fragment } from 'react';

import classes from './ErrorMessage.module.css';

const errorMessage = props =>  (
  <Fragment>
    <div
      className={ classes.ErrorMessage }
      role="alert">
      { props.message }
    </div>
  </Fragment>
);

export default errorMessage;

import React from 'react';

import classes from './BuildControl.module.css';

const buildControl = props => (
  <div className={ classes.BuildControl }>
    <button
      className={ classes.Less }
      onClick={ props.less }
      disabled={ props.disabled }>-</button>
    <p className={ classes.Label }>{ props.label }</p>
    <button
      className={ classes.More }
      onClick={ props.more }>+</button>
  </div>
);

export default buildControl;

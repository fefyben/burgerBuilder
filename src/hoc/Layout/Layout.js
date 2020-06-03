import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Footer from '../../components/Navigation/Footer/Footer';

const Layout = props => {
  const [ sidedrawerIsVisible, setSidedrawerIsVisible ] = useState(false);

  const isAuthenticated = useSelector(state => state.auth.token !== null);

  const sideDrawerClosedHandler = () => {
    setSidedrawerIsVisible(false);
  };

  const drawerToggleHandler = () => {
    setSidedrawerIsVisible(!sidedrawerIsVisible);
  };

  return(
    <Fragment>
      <Toolbar
        isAuth={ isAuthenticated }
        drawerToggleCliked={ drawerToggleHandler } />
      <SideDrawer
        isAuth={ isAuthenticated }
        open={ sidedrawerIsVisible }
        closed={ sideDrawerClosedHandler } />
      <main className={ classes.Content }>
        { props.children }
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;

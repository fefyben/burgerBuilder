import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Footer from '../../components/Navigation/Footer/Footer';

class Layout extends Component {
  state ={
    showSideDrawer: false
  }

  SideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  }

  drawerToggleHandler = () => {
    // This has a flaw because it uses 'this.state' inside 'this.setState'
    // this.setState({showSideDrawer: !this.state.showSideDrawer});

    // IMPORTANT: Fixing the flaw above
    // This is the clean way of setting the state when it dependes on the old state
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  }

  render() {
    return(
      <Fragment>
        <Toolbar
          isAuth={ this.props.isAuthenticated }
          drawerToggleCliked={ this.drawerToggleHandler } />
        <SideDrawer
          isAuth={ this.props.isAuthenticated }
          open={ this.state.showSideDrawer }
          closed={ this.SideDrawerClosedHandler } />
        <main className={ classes.Content }>
          { this.props.children }
        </main>
        <Footer />
      </Fragment>
    );
  }
}

 const mapStateToProps = state => {
   return {
     isAuthenticated: state.auth.token !== null
   };
 };

export default connect(mapStateToProps)(Layout);

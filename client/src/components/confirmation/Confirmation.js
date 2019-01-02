import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'

class Confirmation extends Component {
  componentDidMount() {
    let token = window.location.href.split('/').pop()
    Axios.get('/api/users/confirmation/' + token)
    .catch(err => console.log(err))
  }
  state = {
    redirect: false
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/dashboard' />
    }
  }
  render () {
    return (
       <div>
        {this.renderRedirect()}
        Merci d'avoir confirmer votre adresse email
        <button className="btn btn-info btn-block mt-4" onClick={this.setRedirect}>Connectez-vous</button>
       </div>
    )
  }
}

  export default Confirmation;
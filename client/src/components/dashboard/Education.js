import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>
          <Moment format="MMM YYYY  - ">{edu.from}</Moment>
          {edu.to === null ? (
            ' Now'
          ) : (
            <Moment format="MMM YYYY">{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, edu._id)}
            className="btn btn-danger"
          >
            Supprimer
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Enseignement</h4>
        <table className="table">
          <thead>
            <tr>
              <th>École</th>
              <th>Diplôme</th>
              <th>Années</th>
              <th />
            </tr>
            {education}
          </thead>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);

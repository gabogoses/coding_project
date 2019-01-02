import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';
import Uploads from '../uploads/Uploads'

class CreateProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      stage: false,
      skills: '',
      githubusername: '',
      bio: '',
      cv: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // Bring skills array back to CSV
      const skillsCSV = profile.skills.join(",");

      // If profile field doesnt exist, make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : '';
      profile.stage = !isEmpty(profile.stage) ? profile.stage : '';
      profile.skills = !isEmpty(profile.skills) ? profile.skills : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername: '';
      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter: '';
      profile.facebook = !isEmpty(profile.social.facebook)? profile.social.facebook: '';
      profile.linkedin = !isEmpty(profile.social.linkedin)? profile.social.linkedin: '';
      profile.youtube = !isEmpty(profile.social.youtube)? profile.social.youtube: '';
      profile.instagram = !isEmpty(profile.social.instagram)? profile.social.instagram: '';
      profile.cv = !isEmpty(profile.cv)? profile.cv: '';

      // Set component fields state
      this.setState({
        handle: profile.handle,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubusername: profile.githubusername,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube,
        instagram: profile.instagram,
        stage: profile.stage,
        cv: profile.cv
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram,
      stage: this.state.stage
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCheck(e) {
    console.log(this.state.stage);
    this.setState({
      disabled: !this.state.disabled,
      stage: !this.state.stage
    });
  }


  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />

          <InputGroup
            placeholder="Facebook Page URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />

          <InputGroup
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />

          <InputGroup
            placeholder="YouTube Channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />

          <InputGroup
            placeholder="Instagram Page URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    // Select options for status
    // const options = [
    //   { label: '* Selectionnez un statut professionnel', value: 0 },
    //   { label: 'Dévelopeur', value: 'Developer' },
    //   { label: 'Développeur Junior', value: 'Junior Developer' },
    //   { label: 'Développeur Senior', value: 'Senior Developer' },
    //   { label: 'Apprenant', value: 'Student or Learning' },
    //   { label: 'Gecko', value: 'Instructor or Teacher' },
    //   { label: 'Stagiaire', value: 'Intern' },
    //   { label: 'Autres', value: 'Other' }
    // ];

  //  // Select options for promotion
    const option = [
      { label: '* Selectionnez une promotion', value: 0 },
      { label: 'Octobre 2018', value: 'Octobre 2018' },
      { label: 'Juin 2018', value: 'Juin 2018' },
      { label: 'Fevrier 2018', value: 'Fevrier 2018' },
      { label: 'Octobre 2017', value: 'Octobre 2017' },
      { label: 'Juin 2017', value: 'Juin 2017' },
      { label: 'Fevrier 2017', value: 'Fevrier 2017' }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Retour
              </Link>
              <h1 className="display-4 text-center">Mise à jour profil</h1>
              <form onSubmit={this.onSubmit}>
              <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="stage"
                    value={this.state.stage}
                    checked={this.state.stage}
                    onChange={this.onCheck}
                    id="stage"
                  />
                  <label htmlFor="stage" className="form-check-label">
                    À la recherche d'un stage
                  </label>
                </div>
              
                <TextFieldGroup
                  placeholder="* Pseudo"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="Choissisez un pseudo"
                />
                {/* <SelectListGroup
                  placeholder="Statut"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  options={option}
                  error={errors.status}
                  info="Donnez-nous une idée de votre situation dans votre carrière"
                /> */}
                <SelectListGroup
                  placeholder="Promotion"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  options={option}
                  error={errors.status}
                  info="Selectionnez votre promotion"
                />
                <TextFieldGroup
                  placeholder="SiteWeb"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="URL de votre site web"
                />
                <TextFieldGroup
                  placeholder="Ville"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="Ville"
                />
                <TextFieldGroup
                  placeholder="* Compétences informatiques"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Veuillez utiliser des virgules pour séparer les compétences (HTML,CSS,JavaScript,PHP)"
                />
                <TextFieldGroup
                  placeholder="Github"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  error={errors.githubusername}
                  info="Veuillez indiquez votre nom d'utilisateur GitHub"
                />
                <TextAreaFieldGroup
                  placeholder="Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Parlez-nous de vous"
                />                
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                  Liens reseaux sociaux
                  </button>
                  <span className="text-muted"> facultatif</span>
                </div>
                {socialInputs}
                <Uploads>
                </Uploads>
                <input
                  onClick={this.uploadHandler}
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(CreateProfile)
);

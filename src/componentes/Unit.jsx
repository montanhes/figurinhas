import React from 'react';
import PropTypes from 'prop-types';

class Unit extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (!this.props.onClick) return;

    this.props.onClick(event, this.props.unitId);
  }

  render() {
    const {
      unitId,
      name,
      own,
      img,
    } = this.props;
    const gamepediaUrl = `https://exvius.gamepedia.com/${name.replace(/\s/g, "_")}`;

    const className = [
      this.props.className,
      'unit',
    ].filter(entry => !!entry).join(' ');

    return (
      <div className={className}>
        <div onClick={this.onClick} className="unit-image-container">
          <img
            id={unitId}
            src={img}
            alt={name}
            className={own ? 'unit-img' : 'unit-img unit-hide'}
            data-own={own}
          />
        </div>
        <div>
          <a href={gamepediaUrl}>{name}</a>
        </div>
      </div>
    );
  }
}

Unit.propTypes = {
  className: PropTypes.string,
  own: PropTypes.bool,
  name: PropTypes.string.isRequired,
  unitId: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  img: PropTypes.string,
};

Unit.defaultProps = {
  className: undefined,
  own: false,
  onClick: undefined,
};

export default Unit;

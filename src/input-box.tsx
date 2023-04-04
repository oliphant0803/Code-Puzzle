import React, { Component } from 'react';

interface Props {
  label: string;
  onChange: (value: string) => void;
}

interface State {
  value: string;
}


class InputBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}

export default InputBox
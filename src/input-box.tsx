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
    const { label } = this.props;
    const { value } = this.state;

    const parts = label.split('{input}');
    const inputIndex = parts.length <= 1 ? -1 : parts.length-1;

    return (
      <div>
        {parts.map((part, index) => (
          <span key={index}>
            {index === inputIndex && (
              <input
                type="text"
                className="input-content"
                value={value}
                onChange={this.handleChange}
              />
            )}
            {part}
          </span>
        ))}
      </div>
    );
  }
}

export {
  InputBox
}